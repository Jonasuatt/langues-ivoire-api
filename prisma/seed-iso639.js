/**
 * Seed des codes ISO 639-3 sur les langues existantes.
 * Norme internationale d'identification des langues (SIL / Ethnologue) —
 * indispensable pour l'interopérabilité, l'archivage scientifique du corpus
 * (standards OLAC/ELAR) et les dossiers UNESCO.
 *
 * Seuls les codes établis avec certitude sont renseignés ; les langues sans
 * correspondance sûre restent à valider par l'ILA (laissées à null).
 * NB: le Nouchi (argot urbain) n'a pas de code ISO 639-3 — c'est normal.
 *
 * Usage : node prisma/seed-iso639.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// code interne app → code ISO 639-3
const ISO_MAP = {
  // ── Langues MVP ──
  baoule:    'bci', // Baoulé
  dioula:    'dyu', // Dioula / Jula
  bete:      'bet', // Bété de Guiberoua (variantes : bev Daloa, btg Gagnoa)
  guere:     'gxx', // Guéré (Wè Southern)
  agni:      'any', // Agni / Anyin
  attie:     'ati', // Attié / Akyé
  senoufo:   'sef', // Sénoufo Cebaara (Senari)
  yacouba:   'dnj', // Dan / Yacouba
  gouro:     'goa', // Gouro

  // ── Autres langues ivoiriennes ──
  abron:     'abr', // Abron / Brong
  adjoukrou: 'adj', // Adjoukrou / Adioukrou
  abidji:    'abi',
  avikam:    'avi',
  alladian:  'ald',
  aboure:    'abu',
  nzima:     'nzi',
  dida:      'dic', // Dida de Lakota
  godie:     'god',
  neyo:      'ney',
  wobe:      'wob', // Wobé (Wè Northern)
  lobi:      'lob',
  bambara:   'bam',
  malinke:   'emk', // Maninka de l'Est
  mahou:     'mxx', // Mahou / Mawukakan
  djimini:   'dyi', // Sénoufo Djimini
  tagbana:   'tgw', // Tagwana
  soninke:   'snk',
  mwan:      'moa',
  wan:       'wan',
  gban:      'ggu', // Gban / Gagu
  gagou:     'ggu', // alias éventuel
  tura:      'neb', // Toura
  mano:      'mev',
  beng:      'nhb',
  koulango:  'nku', // Koulango de Bouna (kzc = Bondoukou)
  bakwe:     'bjw',
  nyabwa:    'nwb',
  koro:      'kfo', // Koro ivoirien
  aizi:      'ahp', // Aïzi (Aproumu)
  krobou:    'kxb',
  ebrie:     'ebr',
};

async function main() {
  const languages = await prisma.language.findMany({ select: { id: true, code: true, nom: true, iso639_3: true } });
  let updated = 0, skipped = 0;

  for (const lang of languages) {
    const iso = ISO_MAP[lang.code];
    if (!iso) { skipped++; continue; }
    if (lang.iso639_3 === iso) { skipped++; continue; }
    await prisma.language.update({ where: { id: lang.id }, data: { iso639_3: iso } });
    console.log(`✅ ${lang.nom} (${lang.code}) → ISO 639-3: ${iso}`);
    updated++;
  }

  console.log(`\n${updated} langue(s) mise(s) à jour, ${skipped} inchangée(s)/sans code.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
