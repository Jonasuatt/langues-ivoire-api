/**
 * Cerveau Numérique — couche de réponse du traducteur.
 *
 * Avant tout appel à un modèle payant, on interroge le patrimoine déjà
 * numérisé : dictionnaire et phrases utiles. Une traduction déjà présente
 * en base ne doit jamais être rachetée à l'IA.
 */
const prisma = require('../lib/prisma');

/** Minuscules, sans accents, sans ponctuation de bord, espaces compactés. */
const normalize = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[.,;:!?¿¡"'«»()\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const FR_ALIASES = new Set(['fr', 'fra', 'francais', 'français', 'french']);
const isFrench = (lang) => FR_ALIASES.has(normalize(lang));

/** Retrouve une langue par son nom, son code ou son code ISO 639-3. */
async function resolveLanguage(label) {
  if (!label) return null;
  const n = normalize(label);
  const langues = await prisma.language.findMany({
    select: { id: true, nom: true, code: true, iso639_3: true },
  });
  return (
    langues.find((l) => normalize(l.nom) === n) ||
    langues.find((l) => normalize(l.code) === n) ||
    langues.find((l) => l.iso639_3 && normalize(l.iso639_3) === n) ||
    null
  );
}

/**
 * Cherche une traduction dans le patrimoine.
 * @param {string} text        texte saisi
 * @param {string} languageId  langue locale concernée
 * @param {boolean} toLocal    true = français → langue locale
 * @returns {object|null} { traduction, phonetique?, note?, sens_litteral?, origine }
 */
async function lookup(text, languageId, toLocal) {
  const q = normalize(text);
  if (!q || !languageId) return null;

  // 1) Tentative ciblée (indexée) : couvre la grande majorité des cas sans
  //    charger le dictionnaire entier.
  const champPhrase = toLocal ? 'traduction' : 'phrase';
  const champMot    = toLocal ? 'traduction' : 'mot';
  const [pExact, mExact] = await Promise.all([
    prisma.usefulPhrase.findFirst({
      where: { languageId, status: 'PUBLISHED', [champPhrase]: { equals: text.trim(), mode: 'insensitive' } },
      select: { phrase: true, traduction: true, transcription: true, contexte: true },
    }),
    prisma.dictionaryEntry.findFirst({
      where: { languageId, status: 'PUBLISHED', [champMot]: { equals: text.trim(), mode: 'insensitive' } },
      select: { mot: true, traduction: true, transcription: true,
                exemplePhrase: true, exempleTraduction: true, categorie: true },
    }),
  ]);
  if (pExact) return formatPhrase(pExact, toLocal);
  if (mExact) return formatMot(mExact, toLocal);

  // 2) Repli normalisé (accents, ponctuation, casse) sur le corpus de la langue.
  const [mots, phrases] = await Promise.all([
    prisma.dictionaryEntry.findMany({
      where: { languageId, status: 'PUBLISHED' },
      select: { mot: true, traduction: true, transcription: true,
                exemplePhrase: true, exempleTraduction: true, categorie: true },
    }),
    prisma.usefulPhrase.findMany({
      where: { languageId, status: 'PUBLISHED' },
      select: { phrase: true, traduction: true, transcription: true, contexte: true },
    }),
  ]);

  // Une phrase utile prime sur un mot isolé : elle porte l'usage réel.
  const phrase = phrases.find((p) => normalize(toLocal ? p.traduction : p.phrase) === q);
  if (phrase) return formatPhrase(phrase, toLocal);

  const mot = mots.find((m) => normalize(toLocal ? m.traduction : m.mot) === q);
  if (mot) return formatMot(mot, toLocal);

  return null;
}

function formatPhrase(p, toLocal) {
  return {
    traduction: toLocal ? p.phrase : p.traduction,
    phonetique: toLocal ? p.transcription || undefined : undefined,
    note:       p.contexte || undefined,
    origine:    'phrases utiles',
  };
}

function formatMot(m, toLocal) {
  const exemple = m.exemplePhrase && m.exempleTraduction
    ? `Exemple : ${m.exemplePhrase} — ${m.exempleTraduction}`
    : undefined;
  return {
    traduction:    toLocal ? m.mot : m.traduction,
    phonetique:    toLocal ? m.transcription || undefined : undefined,
    note:          exemple,
    sens_litteral: !toLocal && m.categorie ? `Catégorie : ${m.categorie}` : undefined,
    origine:       'dictionnaire',
  };
}

module.exports = { normalize, isFrench, resolveLanguage, lookup };
