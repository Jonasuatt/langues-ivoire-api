/**
 * seed-dpfc-programme.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Programme scolaire LANGUES IVOIRE — Alignement DPFC / Approche Par Compétences
 * Langue démo : Yacouba (Dan) — région de Man, Tonkpi
 *
 * Structure APC (DPFC) par leçon :
 *   competence  = "L'élève sera capable de..."
 *   situation   = Situation de communication (contexte réel)
 *   Steps       = VOCABULARY → DIALOGUE → GRAMMAR
 *
 * Usage : node seed-dpfc-programme.js <ADMIN_TOKEN>
 */

const https = require('https');

const API     = 'api-production-7107f.up.railway.app';
const LANG_ID = '95b00fe6-539f-405e-abf6-e847f2ae003b';

function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = https.request({
      hostname: API, path: '/api' + path, method,
      headers: {
        'Content-Type': 'application/json',
        ...(data   && { 'Content-Length': Buffer.byteLength(data) }),
        ...(token  && { Authorization: 'Bearer ' + token }),
      },
    }, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(buf) }); }
        catch { resolve({ status: res.statusCode, data: buf }); }
      });
    });
    req.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}
const post = (p, b, t) => req('POST', p, b, t);
const sleep = ms => new Promise(r => setTimeout(r, ms));

let ok = 0, fail = 0;
async function send(label, path, body, token) {
  await sleep(150);
  const r = await post(path, body, token);
  if (r.status >= 200 && r.status < 300) { ok++; process.stdout.write('.'); return r.data; }
  fail++;
  console.log(`\n  ✗ ${label}: ${r.status} — ${JSON.stringify(r.data).slice(0, 100)}`);
  return null;
}

// ─── PROGRAMME DPFC YACOUBA ──────────────────────────────────────────────────
// Format : { classe, pilier, trimestre, semaine, titre, description, competence, situation, steps[] }
// steps : { type: 'VOCABULARY'|'DIALOGUE'|'GRAMMAR', contenu: {} }

const PROGRAMME = [

  // ══════════════════════════════════════════════════════════════════
  //  CP1  (ordre 1) — 6 ans — Initiation à la langue
  // ══════════════════════════════════════════════════════════════════

  // ── CP1 · LANGUE_COMMUNICATION ────────────────────────────────────
  {
    classe: 'CP1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
    titre: 'Les salutations du matin',
    description: 'Apprendre à saluer en yacouba selon le moment de la journée et le rang social.',
    competence: "L'élève sera capable de saluer et de répondre à une salutation en yacouba.",
    situation: "Le premier matin à l'école primaire de Man, tu rencontres tes nouveaux camarades yacouba.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Kö',   traduction: 'Bonjour / Bienvenue',   transcription: '[kö]',   exemplePhrase: 'Kö, bé ö?',    exempleTraduction: 'Bonjour, comment vas-tu ?' },
        { mot: 'Wlö',  traduction: 'Au revoir',              transcription: '[wlö]',  exemplePhrase: 'Wlö, da!',     exempleTraduction: 'Au revoir, père !' },
        { mot: 'Bé?',  traduction: 'Comment vas-tu ?',       transcription: '[bé]',   exemplePhrase: 'Bé ö da?',     exempleTraduction: 'Comment vas-tu, père ?' },
        { mot: 'Gbin', traduction: 'Je vais bien',            transcription: '[gbin]', exemplePhrase: 'Gbin, nü.',    exempleTraduction: 'Je vais bien, merci.' },
        { mot: 'Nü',   traduction: 'Merci',                   transcription: '[nü]',   exemplePhrase: 'Nü, da!',      exempleTraduction: 'Merci, père !' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'La rencontre à l\'école',
        situation: 'Koné rencontre Yacouba avant la classe.',
        lignes: [
          { locuteur: 'Koné',   texte: 'Kö, Yacouba!',      traduction: 'Bonjour, Yacouba !' },
          { locuteur: 'Yacouba',texte: 'Kö! Bé ö?',         traduction: 'Bonjour ! Comment vas-tu ?' },
          { locuteur: 'Koné',   texte: 'Gbin, nü. Bé ö?', traduction: 'Je vais bien, merci. Et toi ?' },
          { locuteur: 'Yacouba',texte: 'Gbin bé, nü.',      traduction: 'Je vais très bien, merci.' },
          { locuteur: 'Koné',   texte: 'Wlö!',              traduction: 'Au revoir !' },
          { locuteur: 'Yacouba',texte: 'Wlö!',              traduction: 'Au revoir !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Structure de la salutation en yacouba',
        explication: 'En yacouba, on salue en demandant « Bé ö ? » (Comment vas-tu ?) suivi du nom ou du titre de la personne. La réponse est toujours « Gbin » (Je vais bien) même si ce n\'est pas tout à fait vrai !',
        pattern: 'Kö + [nom/titre] ! → Bé ö [nom/titre] ?',
        exemples: [
          { ya: 'Kö, da !',   fr: 'Bonjour, père !' },
          { ya: 'Bé ö, na ?', fr: 'Comment vas-tu, mère ?' },
          { ya: 'Gbin, nü.',  fr: 'Je vais bien, merci.' },
        ],
      }},
    ],
  },
  {
    classe: 'CP1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 2,
    titre: 'Me présenter — Mon nom',
    description: 'Dire son prénom et son nom en yacouba. Demander le nom d\'un camarade.',
    competence: "L'élève sera capable de se présenter et de demander le nom de quelqu'un.",
    situation: "Le maître demande à chaque élève de se présenter devant la classe en yacouba.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'N tö',       traduction: 'Mon nom (est)',        transcription: '[n tö]',      exemplePhrase: 'N tö Koné.',    exempleTraduction: 'Mon nom est Koné.' },
        { mot: 'Ö tö kà ?',  traduction: 'Quel est ton nom ?',   transcription: '[ö tö kà]',   exemplePhrase: 'Ö tö kà?',      exempleTraduction: 'Quel est ton nom ?' },
        { mot: 'N',          traduction: 'Je / Moi',              transcription: '[n]',         exemplePhrase: 'N kö.',         exempleTraduction: 'Bonjour (de ma part).' },
        { mot: 'Ö',          traduction: 'Tu / Toi / Il / Elle',  transcription: '[ö]',         exemplePhrase: 'Ö gbin?',       exempleTraduction: 'Tu vas bien ?' },
        { mot: 'Kà ?',       traduction: 'Quel ? / Quoi ?',       transcription: '[kà]',        exemplePhrase: 'Kà kpö kà?',    exempleTraduction: 'Qu\'est-ce que c\'est ?' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Je me présente',
        situation: 'La maîtresse Gbogbo demande à ses élèves de se présenter.',
        lignes: [
          { locuteur: 'Maîtresse', texte: 'Kö! Ö tö kà?',        traduction: 'Bonjour ! Quel est ton nom ?' },
          { locuteur: 'Élève 1',   texte: 'N tö Danho.',          traduction: 'Mon nom est Danho.' },
          { locuteur: 'Maîtresse', texte: 'Kö, Danho! Nü.',       traduction: 'Bonjour, Danho ! Merci.' },
          { locuteur: 'Élève 2',   texte: 'N tö Womian. Kö!',     traduction: 'Mon nom est Womian. Bonjour !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Les pronoms personnels en yacouba',
        explication: 'En yacouba, « N » = je/moi, « Ö » = tu/toi/il/elle. Le yacouba ne distingue pas le masculin du féminin dans les pronoms.',
        pattern: 'N + [verbe/nom] = ma possession ou mon action',
        exemples: [
          { ya: 'N tö Koné',  fr: 'Mon nom est Koné' },
          { ya: 'N da',       fr: 'Mon père' },
          { ya: 'Ö tö kà?',   fr: 'Quel est ton nom ?' },
        ],
      }},
    ],
  },
  {
    classe: 'CP1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 3,
    titre: 'Les membres de ma famille',
    description: 'Nommer les membres de la famille proche en yacouba : père, mère, frère, sœur.',
    competence: "L'élève sera capable de nommer les membres de sa famille en yacouba.",
    situation: "Danho montre la photo de sa famille à ses camarades et nomme chaque membre.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Da',    traduction: 'Père',         transcription: '[da]',     exemplePhrase: 'N da tö Gboié.',  exempleTraduction: 'Mon père s\'appelle Gboié.' },
        { mot: 'Na',    traduction: 'Mère',          transcription: '[na]',     exemplePhrase: 'N na gbin.',      exempleTraduction: 'Ma mère va bien.' },
        { mot: 'Pío',   traduction: 'Enfant / Fils', transcription: '[pío]',    exemplePhrase: 'Da pío.',         exempleTraduction: 'L\'enfant du père.' },
        { mot: 'Gbòn',  traduction: 'Grand frère / Aîné', transcription: '[gbɔ̀n]', exemplePhrase: 'N gbòn kö.',   exempleTraduction: 'Mon grand frère salue.' },
        { mot: 'Nyan',  traduction: 'Grand-mère',    transcription: '[ɲan]',    exemplePhrase: 'Nyan nü bé.',     exempleTraduction: 'Grand-mère dit merci.' },
        { mot: 'Gbagbo',traduction: 'Grand-père',    transcription: '[gbagbo]', exemplePhrase: 'Gbagbo gbin.',    exempleTraduction: 'Grand-père va bien.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'La famille de Danho',
        situation: 'Danho présente sa famille à la classe.',
        lignes: [
          { locuteur: 'Maîtresse',texte: 'Ö da tö kà?',           traduction: 'Comment s\'appelle ton père ?' },
          { locuteur: 'Danho',    texte: 'N da tö Gboié.',         traduction: 'Mon père s\'appelle Gboié.' },
          { locuteur: 'Maîtresse',texte: 'Ö na tö kà?',            traduction: 'Et ta mère ?' },
          { locuteur: 'Danho',    texte: 'N na tö Towai. Ö gbin.',  traduction: 'Ma mère s\'appelle Towai. Elle va bien.' },
          { locuteur: 'Maîtresse',texte: 'Nü, Danho!',             traduction: 'Merci, Danho !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'La possession en yacouba : N + nom de famille',
        explication: 'Pour exprimer « mon/ma », on place « N » devant le nom de parenté. Il n\'y a pas de mot séparé pour « mon » ou « ma ».',
        pattern: 'N + [lien de parenté] = "mon/ma + [lien de parenté]"',
        exemples: [
          { ya: 'N da',   fr: 'Mon père' },
          { ya: 'N na',   fr: 'Ma mère' },
          { ya: 'N gbòn', fr: 'Mon grand frère' },
          { ya: 'N pío',  fr: 'Mon enfant' },
        ],
      }},
    ],
  },
  {
    classe: 'CP1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 4,
    titre: 'Compter de 1 à 5',
    description: 'Les cinq premiers chiffres en yacouba avec des exercices de mémorisation.',
    competence: "L'élève sera capable de compter de 1 à 5 en yacouba.",
    situation: "La maîtresse distribue des mangues aux élèves et demande de compter en yacouba.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Do',    traduction: 'Un (1)',    transcription: '[do]',     exemplePhrase: 'Do kpan.',    exempleTraduction: 'Une igname.' },
        { mot: 'Ple',   traduction: 'Deux (2)',  transcription: '[ple]',    exemplePhrase: 'Ple gbi.',    exempleTraduction: 'Deux (portions de) riz.' },
        { mot: 'Taa',   traduction: 'Trois (3)', transcription: '[taː]',    exemplePhrase: 'Taa pío.',    exempleTraduction: 'Trois enfants.' },
        { mot: 'Yaaro', traduction: 'Quatre (4)',transcription: '[yaːro]',  exemplePhrase: 'Yaaro tii.',  exempleTraduction: 'Quatre arbres.' },
        { mot: 'Mu',    traduction: 'Cinq (5)',  transcription: '[mu]',     exemplePhrase: 'Mu kpö.',     exempleTraduction: 'Cinq mains.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Au marché avec maman',
        situation: 'Womian aide sa mère à compter les oranges au marché de Man.',
        lignes: [
          { locuteur: 'Na',    texte: 'Womian, bli do bha!',           traduction: 'Womian, prends une orange !' },
          { locuteur: 'Womian',texte: 'Do! Nü, na.',                   traduction: 'Une ! Merci, maman.' },
          { locuteur: 'Na',    texte: 'Ple? Taa? Yaaro? Mu?',          traduction: 'Deux ? Trois ? Quatre ? Cinq ?' },
          { locuteur: 'Womian',texte: 'Ple… taa… yaaro… mu! Gbin bé!', traduction: 'Deux… trois… quatre… cinq ! C\'est bon !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Les nombres en yacouba : position après le nom',
        explication: 'En yacouba, le nombre se place APRÈS le nom qu\'il qualifie (contrairement au français).',
        pattern: '[nom] + [nombre]',
        exemples: [
          { ya: 'Tii do',    fr: 'Un arbre (arbre un)' },
          { ya: 'Pío ple',   fr: 'Deux enfants' },
          { ya: 'Kpan taa',  fr: 'Trois ignames' },
          { ya: 'Bli yaaro', fr: 'Quatre oranges' },
          { ya: 'Gbi mu',    fr: 'Cinq (portions de) riz' },
        ],
      }},
    ],
  },

  // ── CP1 · LANGUE_COMMUNICATION T2 ────────────────────────────────
  {
    classe: 'CP1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T2', semaine: 1,
    titre: 'Les couleurs de la nature',
    description: 'Nommer les couleurs en yacouba à partir des éléments naturels (feuille, ciel, soleil).',
    competence: "L'élève sera capable de nommer les couleurs de base en yacouba.",
    situation: "Lors d'une sortie en forêt, la maîtresse demande aux élèves de nommer les couleurs des plantes.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Blõ',   traduction: 'Vert (couleur de la feuille)',  transcription: '[blõ]',  exemplePhrase: 'Tii blõ.',    exempleTraduction: 'L\'arbre vert.' },
        { mot: 'Gbɛ',   traduction: 'Blanc / Clair',                 transcription: '[gbɛ]',  exemplePhrase: 'Yii gbɛ.',    exempleTraduction: 'L\'eau claire.' },
        { mot: 'Gblen', traduction: 'Noir / Sombre',                  transcription: '[gblen]',exemplePhrase: 'Zan gblen.',  exempleTraduction: 'La nuit noire.' },
        { mot: 'Kpɔ',   traduction: 'Rouge',                          transcription: '[kpɔ]',  exemplePhrase: 'Gbö kpɔ.',   exempleTraduction: 'Le feu rouge.' },
        { mot: 'Wõ',    traduction: 'Jaune / Or',                     transcription: '[wõ]',   exemplePhrase: 'Sié wõ.',    exempleTraduction: 'Le soleil jaune.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'La sortie en forêt',
        situation: 'La maîtresse et les élèves observent la nature.',
        lignes: [
          { locuteur: 'Maîtresse', texte: 'Tii kpö kà nü?',        traduction: 'De quelle couleur est cet arbre ?' },
          { locuteur: 'Danho',     texte: 'Tii blõ!',               traduction: 'L\'arbre est vert !' },
          { locuteur: 'Maîtresse', texte: 'Blà! Sié kà nü?',        traduction: 'Oui ! Et le soleil ?' },
          { locuteur: 'Womian',    texte: 'Sié wõ bé!',             traduction: 'Le soleil est très jaune !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'La couleur en yacouba : adjectif après le nom',
        explication: 'Comme les nombres, les couleurs se placent toujours après le nom en yacouba.',
        pattern: '[nom] + [couleur]',
        exemples: [
          { ya: 'Tii blõ',   fr: 'L\'arbre vert' },
          { ya: 'Yii gbɛ',   fr: 'L\'eau claire' },
          { ya: 'Gbö kpɔ',   fr: 'Le feu rouge' },
        ],
      }},
    ],
  },
  {
    classe: 'CP1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T2', semaine: 2,
    titre: 'Mon corps',
    description: 'Nommer les principales parties du corps humain en yacouba.',
    competence: "L'élève sera capable d'identifier et nommer les parties du corps en yacouba.",
    situation: "La maîtresse joue au jeu « Touche ton... » et nomme les parties du corps en yacouba.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Gnin', traduction: 'Tête',    transcription: '[ɲin]',  exemplePhrase: 'N gnin gbé.',   exempleTraduction: 'Ma tête est blessée.' },
        { mot: 'Yɛ',   traduction: 'Œil',     transcription: '[yɛ]',   exemplePhrase: 'N yɛ ple.',     exempleTraduction: 'Mes deux yeux.' },
        { mot: 'Tö',   traduction: 'Oreille', transcription: '[tö]',   exemplePhrase: 'Tö bha!',       exempleTraduction: 'Écoute !' },
        { mot: 'Nü',   traduction: 'Bouche',  transcription: '[nü]',   exemplePhrase: 'Nü gbɛ.',       exempleTraduction: 'La bouche blanche (dents).' },
        { mot: 'Kpö',  traduction: 'Main',    transcription: '[kpö]',  exemplePhrase: 'Kpö ple.',      exempleTraduction: 'Les deux mains.' },
        { mot: 'Jie',  traduction: 'Pied',    transcription: '[dʒie]', exemplePhrase: 'N jie gbé.',    exempleTraduction: 'Mon pied est blessé.' },
        { mot: 'Wlin', traduction: 'Ventre',  transcription: '[wlin]', exemplePhrase: 'N wlin gba bé.',exempleTraduction: 'J\'ai très faim.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Jeu « Touche ton... »',
        situation: 'La maîtresse joue avec les élèves en classe.',
        lignes: [
          { locuteur: 'Maîtresse', texte: 'Gnin!',           traduction: '(Touche ta) tête !' },
          { locuteur: 'Élèves',    texte: '[touchent leur tête]', traduction: '(Tout le monde touche sa tête)' },
          { locuteur: 'Maîtresse', texte: 'Kpö!',            traduction: '(Touche ta) main !' },
          { locuteur: 'Danho',     texte: 'Kpö ple, tö!',    traduction: 'Deux mains, une oreille !' },
          { locuteur: 'Maîtresse', texte: 'Blà, blà!',       traduction: 'Oui, oui !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Exprimer la douleur en yacouba',
        explication: 'Pour dire « j\'ai mal à... » on utilise « N + [partie du corps] + gba ».',
        pattern: 'N + [partie du corps] + gba',
        exemples: [
          { ya: 'N gnin gba',  fr: 'J\'ai mal à la tête' },
          { ya: 'N wlin gba',  fr: 'J\'ai mal au ventre / J\'ai faim' },
          { ya: 'N jie gba',   fr: 'J\'ai mal au pied' },
        ],
      }},
    ],
  },
  {
    classe: 'CP1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T3', semaine: 1,
    titre: 'La nourriture du village',
    description: 'Nommer les aliments traditionnels yacouba et exprimer ses préférences.',
    competence: "L'élève sera capable de nommer les aliments de base et d'exprimer sa faim.",
    situation: "Lors du repas de midi à l'école, les élèves nomment les plats en yacouba.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Gbi',   traduction: 'Riz',           transcription: '[gbi]',   exemplePhrase: 'N ba gbi.',    exempleTraduction: 'Je mange du riz.' },
        { mot: 'Kpan',  traduction: 'Igname',         transcription: '[kpan]',  exemplePhrase: 'Kpan bé.',     exempleTraduction: 'Beaucoup d\'ignames.' },
        { mot: 'Blê',   traduction: 'Maïs',           transcription: '[blê]',   exemplePhrase: 'Blê wõ.',      exempleTraduction: 'Le maïs jaune.' },
        { mot: 'Gan',   traduction: 'Viande',          transcription: '[gan]',   exemplePhrase: 'Gan bé gbin.', exempleTraduction: 'La viande est très bonne.' },
        { mot: 'Sra',   traduction: 'Huile de palme',  transcription: '[sra]',   exemplePhrase: 'Sra kpɔ.',     exempleTraduction: 'L\'huile de palme rouge.' },
        { mot: 'Yii',   traduction: 'Eau',             transcription: '[yiː]',   exemplePhrase: 'N min yii.',   exempleTraduction: 'Je bois de l\'eau.' },
        { mot: 'Ba',    traduction: 'Manger',           transcription: '[ba]',    exemplePhrase: 'Ö ba gbi.',    exempleTraduction: 'Il mange du riz.' },
        { mot: 'Min',   traduction: 'Boire',            transcription: '[min]',   exemplePhrase: 'N min yii.',   exempleTraduction: 'Je bois de l\'eau.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Le repas de midi',
        situation: 'Les élèves mangent à la cantine de l\'école.',
        lignes: [
          { locuteur: 'Koné',   texte: 'Ö ba kà?',                traduction: 'Qu\'est-ce que tu manges ?' },
          { locuteur: 'Danho',  texte: 'N ba gbi kpan. Bé bé!',   traduction: 'Je mange du riz et de l\'igname. C\'est très bon !' },
          { locuteur: 'Koné',   texte: 'N min yii. N ba gbi bé!', traduction: 'Je bois de l\'eau. Je veux manger du riz !' },
          { locuteur: 'Danho',  texte: 'Blà! Gbi bé gbin!',       traduction: 'Oui ! Le riz est très bon !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Les verbes « manger » et « boire » en yacouba',
        explication: '« Ba » (manger) et « Min » (boire) sont des verbes essentiels. La structure de la phrase reste : Sujet + Verbe + Complément.',
        pattern: '[Sujet] + ba/min + [aliment/boisson]',
        exemples: [
          { ya: 'N ba gbi',     fr: 'Je mange du riz' },
          { ya: 'Ö min yii',    fr: 'Tu bois de l\'eau' },
          { ya: 'Ö ba kpan bé', fr: 'Il mange beaucoup d\'igname' },
        ],
      }},
    ],
  },
  {
    classe: 'CP1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T3', semaine: 2,
    titre: 'Compter de 6 à 10',
    description: 'Compléter l\'apprentissage des chiffres jusqu\'à 10 en yacouba.',
    competence: "L'élève sera capable de compter de 1 à 10 en yacouba.",
    situation: "Le vendeur de mangues compte ses fruits pour Womian au marché de Man.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Gbangba',  traduction: 'Six (6)',   transcription: '[gbangba]', exemplePhrase: 'Gbangba tii.',   exempleTraduction: 'Six arbres.' },
        { mot: 'Plɛkö',   traduction: 'Sept (7)',  transcription: '[plɛkö]',   exemplePhrase: 'Plɛkö bli.',    exempleTraduction: 'Sept oranges.' },
        { mot: 'Domu',     traduction: 'Huit (8)',  transcription: '[domu]',    exemplePhrase: 'Domu pío.',      exempleTraduction: 'Huit enfants.' },
        { mot: 'Gbangbado',traduction: 'Neuf (9)',  transcription: '[gbangbado]',exemplePhrase: 'Gbangbado kpan.',exempleTraduction: 'Neuf ignames.' },
        { mot: 'Plɛkö-do', traduction: 'Dix (10)', transcription: '[plɛkö-do]', exemplePhrase: 'Plɛkö-do gbi.', exempleTraduction: 'Dix (portions de) riz.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Je compte mes billes',
        situation: 'Les enfants jouent aux billes dans la cour.',
        lignes: [
          { locuteur: 'Koné',   texte: 'Ö bɛ gbangba kà?', traduction: 'Tu as six billes ?' },
          { locuteur: 'Danho',  texte: 'Aa. N bɛ domu.',   traduction: 'Non. J\'en ai huit.' },
          { locuteur: 'Koné',   texte: 'Do, ple, taa, yaaro, mu, gbangba, plɛkö, domu!', traduction: '1, 2, 3, 4, 5, 6, 7, 8 !' },
          { locuteur: 'Danho',  texte: 'Blà! Domu!',       traduction: 'Oui ! Huit !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Formation des nombres 6-10 en yacouba (système additif)',
        explication: 'Les nombres 6-10 en yacouba ont une logique additive. 6 = gbangba, 7 = plɛkö (5+2), 8 = domu (5+3?), 9 = gbangbado, 10 = plɛkö-do (5×2).',
        pattern: 'Récitation : Do, ple, taa, yaaro, mu, gbangba, plɛkö, domu, gbangbado, plɛkö-do',
        exemples: [
          { ya: 'Bli mu',        fr: '5 oranges' },
          { ya: 'Bli gbangba',   fr: '6 oranges' },
          { ya: 'Bli plɛkö-do',  fr: '10 oranges' },
        ],
      }},
    ],
  },

  // ── CP1 · CULTURE_CITOYENNETE ─────────────────────────────────────
  {
    classe: 'CP1', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
    titre: 'Ma famille yacouba',
    description: 'Découvrir l\'organisation de la famille élargie dans la culture Dan/Yacouba.',
    competence: "L'élève sera capable de décrire sa famille et de respecter chaque membre.",
    situation: "Gboié présente sa grande famille lors de la cérémonie de fin d'année du village.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Wõ',     traduction: 'Village',         transcription: '[wõ]',     exemplePhrase: 'N wõ Man.',   exempleTraduction: 'Mon village est Man.' },
        { mot: 'Kpö wõ', traduction: 'Grande famille / Clan', transcription: '[kpö wõ]', exemplePhrase: 'N kpö wõ bé.',exempleTraduction: 'Ma grande famille est importante.' },
        { mot: 'Do',     traduction: 'Ensemble / Un',   transcription: '[do]',     exemplePhrase: 'Wõ do.',      exempleTraduction: 'Le village ensemble.' },
        { mot: 'Blà',    traduction: 'Oui / C\'est vrai', transcription: '[blà]',  exemplePhrase: 'Blà, da!',    exempleTraduction: 'Oui, père !' },
        { mot: 'Aa',     traduction: 'Non',              transcription: '[aː]',     exemplePhrase: 'Aa, na!',     exempleTraduction: 'Non, maman !' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'La famille de Gboié',
        situation: 'Gboié explique sa famille à un ami d\'une autre région.',
        lignes: [
          { locuteur: 'Ami',   texte: 'Ö kpö wõ bé kà?',         traduction: 'Ta grande famille est comment ?' },
          { locuteur: 'Gboié', texte: 'N da, n na, n gbòn, n pío — do!', traduction: 'Mon père, ma mère, mon frère aîné, mon enfant — ensemble !' },
          { locuteur: 'Ami',   texte: 'Nyan kpö tö kà?',          traduction: 'Et ta grand-mère ?' },
          { locuteur: 'Gboié', texte: 'Nyan gbin bé! Ö nü kpö.',  traduction: 'Grand-mère va très bien ! Elle est sage.' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'La famille élargie en culture yacouba',
        explication: 'Chez les Yacouba, la famille ne s\'arrête pas aux parents immédiats. Les oncles, tantes et cousins font partie de la famille directe (kpö wõ = grande maison/famille). Les aînés (gbòn) sont respectés comme des guides.',
        pattern: 'Valeur culturelle : « Wõ gön blö do » — Le village n\'est fait que d\'un seul homme.',
        exemples: [
          { ya: 'Da = père biologique ET oncle paternel',  fr: 'Le terme « da » désigne aussi bien le père que l\'oncle' },
          { ya: 'Na = mère biologique ET tante maternelle', fr: 'Le terme « na » s\'applique à toutes les mères du clan' },
        ],
      }},
    ],
  },
  {
    classe: 'CP1', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T2', semaine: 1,
    titre: 'Mon village de Man',
    description: 'Découvrir la ville de Man, capitale de la région du Tonkpi, berceau de la culture Dan/Yacouba.',
    competence: "L'élève sera capable de décrire son environnement géographique et culturel.",
    situation: "La classe fait une sortie scolaire pour découvrir les monuments et lieux de Man.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Wõ-Man',  traduction: 'Ville de Man',         transcription: '[wõ man]',  exemplePhrase: 'N kɔ Wõ-Man.',    exempleTraduction: 'Je vais à Man.' },
        { mot: 'Gblon',   traduction: 'Montagne',              transcription: '[gblon]',   exemplePhrase: 'Gblon kpö.',       exempleTraduction: 'La grande montagne.' },
        { mot: 'Gla',     traduction: 'Forêt',                 transcription: '[gla]',     exemplePhrase: 'Gla blõ.',         exempleTraduction: 'La forêt verte.' },
        { mot: 'Glõ',     traduction: 'Fleuve / Rivière',      transcription: '[glõ]',     exemplePhrase: 'Glõ yii bé.',      exempleTraduction: 'Beaucoup d\'eau dans la rivière.' },
        { mot: 'Kɔ',      traduction: 'Aller',                 transcription: '[kɔ]',      exemplePhrase: 'N kɔ wõ.',         exempleTraduction: 'Je vais au village.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'La sortie à Man',
        situation: 'La maîtresse et ses élèves découvrent la ville de Man.',
        lignes: [
          { locuteur: 'Maîtresse', texte: 'Gblon kpö kà nü?',  traduction: 'De quelle couleur est la grande montagne ?' },
          { locuteur: 'Koné',     texte: 'Gblon blõ kpö!',      traduction: 'La montagne est très verte !' },
          { locuteur: 'Maîtresse', texte: 'Blà! Man wõ bé gbin. Ö bé kà?', traduction: 'Oui ! La ville de Man est très belle. Tu trouves ?' },
          { locuteur: 'Danho',    texte: 'Blà! N wõ gbin bé!',  traduction: 'Oui ! Mon village est très beau !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Man — capitale du pays Dan/Yacouba',
        explication: 'Man est surnommée « la cité des 18 montagnes ». Elle est le cœur culturel du peuple Dan/Yacouba. Les masques Gè, les courses de chars de bœufs (la Fête du Masque) et l\'artisanat du tissu y sont célèbres.',
        pattern: 'Valeur culturelle : « Wõ gbin » = Le village est beau (fierté locale)',
        exemples: [
          { ya: 'Gblon plɛkö-do kpö ple', fr: 'Man = ville des 18 montagnes' },
          { ya: 'Gè = masque sacré de la forêt', fr: 'Le G�� est l\'institution traditionnelle de justice' },
        ],
      }},
    ],
  },
  {
    classe: 'CP1', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T3', semaine: 1,
    titre: 'La solidarité au village',
    description: 'Comprendre la valeur de solidarité (Gbla gön) dans la société yacouba.',
    competence: "L'élève sera capable d'expliquer et de pratiquer la solidarité.",
    situation: "Lors d'une construction de maison au village, tout le monde aide : l'élève découvre la solidarité.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Gbla',   traduction: 'Aide / Entraide',   transcription: '[gbla]',   exemplePhrase: 'Gbla gön.',      exempleTraduction: 'Entraide communautaire.' },
        { mot: 'Gba',    traduction: 'Travailler / Force', transcription: '[gba]',   exemplePhrase: 'Gba bé!',        exempleTraduction: 'Travailler fort !' },
        { mot: 'Bha',    traduction: 'Venir',              transcription: '[bha]',   exemplePhrase: 'Bha wõ!',        exempleTraduction: 'Viens au village !' },
        { mot: 'Do',     traduction: 'Ensemble / Un',      transcription: '[do]',    exemplePhrase: 'Gba do.',        exempleTraduction: 'Travailler ensemble.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'On construit ensemble',
        situation: 'Les hommes du village construisent la maison de la veuve Towai.',
        lignes: [
          { locuteur: 'Chef',   texte: 'Towai wõ gbé. Gbla gön bha!', traduction: 'La maison de Towai est abîmée. Venez l\'aider !' },
          { locuteur: 'Gboié',  texte: 'Blà! Gba do!',                traduction: 'Oui ! Travaillons ensemble !' },
          { locuteur: 'Tous',   texte: 'Gba do! Wõ do!',              traduction: 'Ensemble ! Un village !' },
          { locuteur: 'Towai',  texte: 'Nü bé! Nü bé, kpö wõ!',      traduction: 'Merci beaucoup ! Merci, grande famille !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Proverbe fondateur yacouba : la solidarité',
        explication: '« Wõ gön blö do » — Le village n\'est pas fait d\'un seul homme. Ce proverbe enseigne que la prospérité collective dépend de la participation de chacun.',
        pattern: 'Gba do = Travailler ensemble (formule d\'entraide)',
        exemples: [
          { ya: 'Gbla gön',      fr: 'L\'entraide communautaire (tâche collective)' },
          { ya: 'Wõ gön blö do', fr: 'Proverbe : L\'union fait la force' },
        ],
      }},
    ],
  },

  // ── CP1 · PRATIQUE_METIERS ────────────────────────────────────────
  {
    classe: 'CP1', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
    titre: 'Au marché de Man',
    description: 'Vocabulaire des achats simples au marché : nommer les produits, compter, demander le prix.',
    competence: "L'élève sera capable de nommer les produits du marché et d'exprimer un prix simple.",
    situation: "Womian accompagne sa mère au grand marché de Man le samedi matin.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Kpɛ',    traduction: 'Marché',          transcription: '[kpɛ]',   exemplePhrase: 'N kɔ kpɛ.',     exempleTraduction: 'Je vais au marché.' },
        { mot: 'Sié gbè',traduction: 'Prix / Combien ?', transcription: '[sié gbè]',exemplePhrase: 'Sié gbè kà?',  exempleTraduction: 'Combien ça coûte ?' },
        { mot: 'Gbè',    traduction: 'Coûter / Prix',    transcription: '[gbè]',   exemplePhrase: 'Gbè kà?',       exempleTraduction: 'Quel prix ?' },
        { mot: 'Bli',    traduction: 'Orange',           transcription: '[bli]',   exemplePhrase: 'Bli kpɔ.',      exempleTraduction: 'L\'orange rouge.' },
        { mot: 'Tön',    traduction: 'Banane',           transcription: '[tön]',   exemplePhrase: 'Tön wõ.',       exempleTraduction: 'La banane jaune.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Acheter des oranges',
        situation: 'Womian achète des oranges pour sa mère.',
        lignes: [
          { locuteur: 'Womian',  texte: 'Kö! Bli sié gbè kà?',         traduction: 'Bonjour ! Combien coûtent les oranges ?' },
          { locuteur: 'Vendeur', texte: 'Kö! Bli do — do gbè.',         traduction: 'Bonjour ! Une orange — cent francs.' },
          { locuteur: 'Womian',  texte: 'Bli mu bé! Mu gbè?',           traduction: 'Je veux cinq oranges ! Cinq fois cent ?' },
          { locuteur: 'Vendeur', texte: 'Blà! Mu gbè do bé. Blà nü?',   traduction: 'Oui ! Cinq cents. C\'est d\'accord ?' },
          { locuteur: 'Womian',  texte: 'Blà. Nü bé!',                  traduction: 'D\'accord. Merci beaucoup !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Demander un prix en yacouba',
        explication: '« Sié gbè kà ? » est la formule standard pour demander le prix au marché. « Sié » = soleil/valeur/prix, « gbè » = coûter, « kà » = quoi/combien.',
        pattern: '[produit] + sié gbè kà? = Combien coûte [produit] ?',
        exemples: [
          { ya: 'Gbi sié gbè kà?', fr: 'Combien coûte le riz ?' },
          { ya: 'Kpan sié gbè kà?',fr: 'Combien coûte l\'igname ?' },
          { ya: 'Bli mu sié gbè kà?',fr: 'Combien coûtent 5 oranges ?' },
        ],
      }},
    ],
  },
  {
    classe: 'CP1', pilier: 'PRATIQUE_METIERS', trimestre: 'T2', semaine: 1,
    titre: 'Les métiers du village',
    description: 'Découvrir les métiers traditionnels pratiqués dans les villages yacouba.',
    competence: "L'élève sera capable de nommer les principaux métiers de son environnement.",
    situation: "Le père de Koné est forgeron. Il raconte son métier aux enfants de l'école.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Gbö wlan', traduction: 'Forgeron',      transcription: '[gbö wlan]', exemplePhrase: 'N da gbö wlan.',exempleTraduction: 'Mon père est forgeron.' },
        { mot: 'Tii wlan', traduction: 'Charpentier / Menuisier', transcription: '[tii wlan]',exemplePhrase: 'Tii wlan gba bé.',exempleTraduction: 'Le charpentier travaille bien.' },
        { mot: 'Kpɛ gön',  traduction: 'Commerçant / Vendeur',   transcription: '[kpɛ gön]', exemplePhrase: 'Kpɛ gön kö.',   exempleTraduction: 'Bonjour au commerçant.' },
        { mot: 'Na gba',   traduction: 'Agriculteur / Cultivatrice', transcription: '[na gba]',exemplePhrase: 'Na gba blê bé.',exempleTraduction: 'L\'agricultrice cultive le maïs.' },
        { mot: 'Wlan',     traduction: 'Travailler / Artisan',    transcription: '[wlan]',    exemplePhrase: 'Gba wlan.',     exempleTraduction: 'Travailler dur.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Le forgeron Gboié',
        situation: 'Gboié, père de Koné, explique son travail à la classe.',
        lignes: [
          { locuteur: 'Maîtresse',texte: 'Gboié, ö gba kà?',          traduction: 'Gboié, quel est ton métier ?' },
          { locuteur: 'Gboié',   texte: 'N gbö wlan. Gbö kpö gbè.',   traduction: 'Je suis forgeron. Je travaille le fer chaud.' },
          { locuteur: 'Koné',    texte: 'N da gba bé! Gbö wlan gbin!',traduction: 'Mon père travaille bien ! La forge, c\'est beau !' },
          { locuteur: 'Gboié',   texte: 'Wlan gba — gbin bé!',        traduction: 'Le travail bien fait, c\'est très beau !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Nommer un métier en yacouba : matériau + wlan',
        explication: 'En yacouba, de nombreux métiers se forment avec « wlan » (travailler/artisan) précédé du matériau ou de l\'outil principal : Gbö (feu/métal) + wlan = forgeron.',
        pattern: '[matériau/outil] + wlan = artisan de ce matériau',
        exemples: [
          { ya: 'Gbö wlan', fr: 'Forgeron (artisan du feu/métal)' },
          { ya: 'Tii wlan', fr: 'Charpentier (artisan du bois)' },
          { ya: 'Kpö wlan', fr: 'Tisserand (artisan du tissu)' },
        ],
      }},
    ],
  },
  {
    classe: 'CP1', pilier: 'PRATIQUE_METIERS', trimestre: 'T3', semaine: 1,
    titre: 'L\'agriculture en pays Dan',
    description: 'Découvrir les cultures vivrières cultivées par les Yacouba et leur importance.',
    competence: "L'élève sera capable de nommer les cultures vivrières locales et les outils agricoles.",
    situation: "Avec son grand-père cultivateur, Danho apprend à reconnaître les plantes du champ.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Blo',    traduction: 'Champ / Plantation', transcription: '[blo]',  exemplePhrase: 'N kɔ blo.',     exempleTraduction: 'Je vais au champ.' },
        { mot: 'Kpɔ blo',traduction: 'Houe',              transcription: '[kpɔ blo]',exemplePhrase: 'Gbagbo kpɔ blo gba.',exempleTraduction: 'Grand-père travaille avec la houe.' },
        { mot: 'Blê',    traduction: 'Maïs',              transcription: '[blê]',  exemplePhrase: 'Blê blõ.',       exempleTraduction: 'Le maïs vert.' },
        { mot: 'Kpan',   traduction: 'Igname',            transcription: '[kpan]', exemplePhrase: 'Kpan bé.',       exempleTraduction: 'Beaucoup d\'ignames.' },
        { mot: 'Gba',    traduction: 'Récolte / Travailler la terre', transcription: '[gba]',exemplePhrase: 'Gba blo bé!',   exempleTraduction: 'Travailler beaucoup dans le champ !' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Au champ avec grand-père',
        situation: 'Danho aide son grand-père au champ le matin.',
        lignes: [
          { locuteur: 'Gbagbo', texte: 'Danho, bha blo!',               traduction: 'Danho, viens au champ !' },
          { locuteur: 'Danho',  texte: 'Gbagbo, blo kà gbin?',          traduction: 'Grand-père, le champ est beau ?' },
          { locuteur: 'Gbagbo', texte: 'Blà! Kpan bé, blê bé!',         traduction: 'Oui ! Beaucoup d\'ignames, beaucoup de maïs !' },
          { locuteur: 'Danho',  texte: 'Gba do! N nü kpɔ blo.',         traduction: 'Travaillons ensemble ! Je veux la houe.' },
          { locuteur: 'Gbagbo', texte: 'Nü bé, pío! Gba gbin bé!',      traduction: 'Merci beaucoup, mon enfant ! Travaillez bien !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'L\'agriculture yacouba : cultures et saisons',
        explication: 'Les Yacouba pratiquent une agriculture traditionnelle sur les flancs des montagnes du Tonkpi. Les principales cultures sont le riz (gbi), le maïs (blê), l\'igname (kpan) et le manioc. La houe (kpɔ blo) est l\'outil principal.',
        pattern: 'Valeur : « Blo gba bé — Wõ gbin » = Un champ bien cultivé — un village prospère',
        exemples: [
          { ya: 'Gbi = riz (la base de l\'alimentation Dan)', fr: 'Le riz est la culture principale des Yacouba de montagne' },
          { ya: 'Kpan = igname (culture de prestige)',        fr: 'L\'igname est offerte lors des cérémonies' },
        ],
      }},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  //  CP2  (ordre 2) — 7 ans
  // ═══════════════════════════════════════════════════════════���══════
  { classe: 'CP2', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
    titre: 'Les animaux du village',
    description: 'Nommer les animaux domestiques et sauvages de l\'environnement yacouba.',
    competence: "L'élève sera capable de nommer les animaux et de les associer à leur environnement.",
    situation: "Lors d'une balade dans la savane près de Man, la maîtresse nomme les animaux en yacouba.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Sɛn',    traduction: 'Poulet / Oiseau', transcription: '[sɛn]',   exemplePhrase: 'Sɛn kpɔ.',    exempleTraduction: 'Le poulet rouge.' },
        { mot: 'Pɔ',     traduction: 'Chèvre',          transcription: '[pɔ]',    exemplePhrase: 'Pɔ gbɛ.',     exempleTraduction: 'La chèvre blanche.' },
        { mot: 'Gbaa',   traduction: 'Mouton',           transcription: '[gbaː]',  exemplePhrase: 'Gbaa bé.',    exempleTraduction: 'Beaucoup de moutons.' },
        { mot: 'Dɔ',     traduction: 'Chien',            transcription: '[dɔ]',    exemplePhrase: 'N dɔ gbin.',  exempleTraduction: 'Mon chien va bien.' },
        { mot: 'Glɔ',    traduction: 'Éléphant',         transcription: '[glɔ]',   exemplePhrase: 'Glɔ kpö bé.', exempleTraduction: 'Un très grand éléphant.' },
        { mot: 'Tö-gbö', traduction: 'Lion',             transcription: '[tö-gbö]',exemplePhrase: 'Tö-gbö kpö.', exempleTraduction: 'Un grand lion.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Les animaux du village',
        situation: 'Koné et Danho parlent des animaux de leur village.',
        lignes: [
          { locuteur: 'Danho',texte: 'Ö dɔ tö kà?',               traduction: 'Comment s\'appelle ton chien ?' },
          { locuteur: 'Koné', texte: 'N dɔ tö Gbö-kpɔ.',          traduction: 'Mon chien s\'appelle Gbö-kpɔ (feu rouge).' },
          { locuteur: 'Danho',texte: 'Dɔ gbö kpö — gbin bé!',     traduction: 'Un grand chien courageux — c\'est super !' },
          { locuteur: 'Koné', texte: 'Blà! Pɔ ple ö wõ kà?',      traduction: 'Oui ! Et toi, tu as des chèvres ?' },
          { locuteur: 'Danho',texte: 'N bɛ pɔ taa kpö gbaa mu.', traduction: 'J\'ai 3 chèvres et 5 moutons.' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'La possession « avoir » en yacouba : bɛ',
        explication: '« Bɛ » signifie « avoir ». Structure : N bɛ + [chose]. Pour nier : N bɛ aa + [chose].',
        pattern: 'N bɛ + [chose] = J\'ai [chose]',
        exemples: [
          { ya: 'N bɛ dɔ do',   fr: 'J\'ai un chien' },
          { ya: 'Ö bɛ pɔ taa',  fr: 'Tu as trois chèvres' },
          { ya: 'N bɛ aa sɛn',  fr: 'Je n\'ai pas de poulet' },
        ],
      }},
    ],
  },
  { classe: 'CP2', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
    titre: 'Le masque Gè — gardien de la justice',
    description: 'Découvrir le masque Gè, institution judiciaire traditionnelle du peuple Yacouba.',
    competence: "L'élève sera capable de présenter le rôle du masque Gè dans la société yacouba.",
    situation: "La semaine du masque à Man : le vieux Gbagbo explique aux enfants le rôle du masque Gè.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Gè',      traduction: 'Masque sacré (institution judiciaire)', transcription: '[gɛ]',  exemplePhrase: 'Gè nü kpö.',  exempleTraduction: 'Le grand masque parle.' },
        { mot: 'Nü kpö',  traduction: 'Parole d\'autorité / Sagesse',         transcription: '[nü kpö]',exemplePhrase: 'Gbòn nü kpö.',exempleTraduction: 'L\'aîné a l\'autorité.' },
        { mot: 'Gbla',    traduction: 'Justice / Paix',                        transcription: '[gbla]',  exemplePhrase: 'Gè gbla gön.', exempleTraduction: 'Le masque apporte la paix.' },
        { mot: 'Wõ gbla', traduction: 'Paix du village',                       transcription: '[wõ gbla]',exemplePhrase: 'Wõ gbla gbin.',exempleTraduction: 'La paix du village est bonne.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Gbagbo explique le masque',
        situation: 'Gbagbo raconte l\'histoire du masque Gè aux enfants.',
        lignes: [
          { locuteur: 'Danho',  texte: 'Gbagbo, Gè kà?',              traduction: 'Grand-père, c\'est quoi le Gè ?' },
          { locuteur: 'Gbagbo', texte: 'Gè — wõ gbla gön. Kpö kpö gön.', traduction: 'Le Gè — c\'est le gardien de la paix du village. C\'est très puissant.' },
          { locuteur: 'Koné',   texte: 'Gè nü kpö kà?',               traduction: 'Le masque parle avec autorité ?' },
          { locuteur: 'Gbagbo', texte: 'Blà! Gè nü — wõ gbla. Gè gba — do!', traduction: 'Oui ! Quand le masque parle — la paix revient. Il rassemble tout le monde !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Le masque Gè — institution fondamentale des Yacouba',
        explication: 'Le masque Gè (ou Gla) est bien plus qu\'un objet décoratif. Il incarne le droit ancestral (droit coutumier). Son apparition lors des conflits impose la paix et son jugement est respecté par tous. La Fête du Masque à Man en est la célébration annuelle.',
        pattern: 'Institution : Gè = Parole + Justice + Paix communautaire',
        exemples: [
          { ya: 'Fête du Masque de Man', fr: 'Célébration annuelle des masques sacrés Dan/Yacouba' },
          { ya: 'Gè nü = Le masque parle', fr: 'Formule qui annonce un jugement/décision du masque' },
        ],
      }},
    ],
  },
  { classe: 'CP2', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
    titre: 'Les outils du cultivateur',
    description: 'Reconnaître et nommer les outils agricoles traditionnels utilisés par les Yacouba.',
    competence: "L'élève sera capable de nommer les outils du cultivateur et de décrire leur usage.",
    situation: "Avec son père, Koné prépare les outils pour la saison des plantations.",
    steps: [
      { type: 'VOCABULARY', contenu: { mots: [
        { mot: 'Kpɔ blo', traduction: 'Houe',             transcription: '[kpɔ blo]',  exemplePhrase: 'Kpɔ blo gba.',    exempleTraduction: 'On travaille avec la houe.' },
        { mot: 'Kpö nü',  traduction: 'Coupe-coupe / Machette', transcription: '[kpö nü]', exemplePhrase: 'Kpö nü gbè.',  exempleTraduction: 'La machette est tranchante.' },
        { mot: 'Blo',     traduction: 'Champ',             transcription: '[blo]',       exemplePhrase: 'Blo blõ bé.',     exempleTraduction: 'Le champ est très vert.' },
        { mot: 'Yaan',    traduction: 'Graine / Semence',  transcription: '[yaan]',      exemplePhrase: 'Yaan blê.',       exempleTraduction: 'La graine de maïs.' },
        { mot: 'Gba',     traduction: 'Semer / Récolter / Travailler', transcription: '[gba]',exemplePhrase: 'Gba yaan blo.',exempleTraduction: 'Semer dans le champ.' },
      ]}},
      { type: 'DIALOGUE', contenu: {
        titre: 'Préparer les outils',
        situation: 'Koné et son père préparent le champ pour les semailles.',
        lignes: [
          { locuteur: 'Da',   texte: 'Koné, kpɔ blo bha!',        traduction: 'Koné, apporte la houe !' },
          { locuteur: 'Koné', texte: 'Da, kpö nü bha kà?',         traduction: 'Père, j\'apporte aussi la machette ?' },
          { locuteur: 'Da',   texte: 'Blà! Kpö nü kpö gba blo.',   traduction: 'Oui ! La grande machette pour débroussailler.' },
          { locuteur: 'Koné', texte: 'N bha yaan blê kà?',         traduction: 'J\'apporte aussi les graines de maïs ?' },
          { locuteur: 'Da',   texte: 'Blà! Gba blo do — gbin bé!', traduction: 'Oui ! Travaillons le champ ensemble — c\'est très bien !' },
        ],
      }},
      { type: 'GRAMMAR', contenu: {
        regle: 'Le cycle agricole yacouba',
        explication: 'En pays Dan, la saison agricole commence en mars avec le débroussaillage (kpö nü), suivi des semailles (gba yaan) en avril-mai, et la récolte (gba blo) en juillet-août pour le maïs et octobre-novembre pour le riz.',
        pattern: 'Cycle : Débroussailler → Semer (gba yaan) → Entretenir → Récolter (gba bé)',
        exemples: [
          { ya: 'Kpö nü gba = débroussailler', fr: 'Couper les herbes avec la machette' },
          { ya: 'Gba yaan = semer', fr: 'Mettre les graines en terre' },
          { ya: 'Gba blo = récolter le champ', fr: 'Cueillir la récolte' },
        ],
      }},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  //  CE1 → TLE : Titres + description + compétence + vocabulaire
  // ══════════════════════════════════════════════════════════════════
  ...([
    { classe: 'CE1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Décrire ma maison', description: 'Vocabulaire des pièces et des objets de la maison traditionnelle yacouba.',
      competence: "L'élève sera capable de décrire sa maison en yacouba.",
      situation: "Koné décrit sa maison à un visiteur étranger.",
      mots: [
        { mot: 'Wõ', traduction: 'Maison / Village', transcription: '[wõ]' },
        { mot: 'Wõ bé', traduction: 'Grande maison', transcription: '[wõ bé]' },
        { mot: 'Kpɔ wõ', traduction: 'Porte', transcription: '[kpɔ wõ]' },
        { mot: 'Yɛ wõ', traduction: 'Fenêtre', transcription: '[yɛ wõ]' },
      ]},
    { classe: 'CE1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T2', semaine: 1,
      titre: 'Les vêtements traditionnels', description: 'Nommer les vêtements portés lors des cérémonies yacouba.',
      competence: "L'élève sera capable de nommer les vêtements et de décrire une tenue.",
      situation: "La cérémonie de mariage au village : tout le monde est habillé en tenue traditionnelle.",
      mots: [
        { mot: 'Bɔ', traduction: 'Vêtement / Habit', transcription: '[bɔ]' },
        { mot: 'Bɔ kpö', traduction: 'Grand boubou', transcription: '[bɔ kpö]' },
        { mot: 'Gbɛ bɔ', traduction: 'Vêtement blanc', transcription: '[gbɛ bɔ]' },
        { mot: 'Kpɔ bɔ', traduction: 'Vêtement rouge (de cérémonie)', transcription: '[kpɔ bɔ]' },
      ]},
    { classe: 'CE1', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'Les fêtes traditionnelles yacouba', description: 'Découvrir les principales fêtes et cérémonies du peuple Dan.',
      competence: "L'élève sera capable de présenter les principales fêtes de sa culture.",
      situation: "La semaine du masque à Man : Gbagbo explique les fêtes aux enfants.",
      mots: [
        { mot: 'Gbagba', traduction: 'Fête / Célébration', transcription: '[gbagba]' },
        { mot: 'Gè gbagba', traduction: 'Fête du masque', transcription: '[gɛ gbagba]' },
        { mot: 'Dö', traduction: 'Chanter', transcription: '[dö]' },
        { mot: 'Kplö', traduction: 'Danser', transcription: '[kplö]' },
      ]},
    { classe: 'CE1', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'L\'artisanat yacouba', description: 'Découvrir les arts et l\'artisanat traditionnels : tissage, sculpture, forge.',
      competence: "L'élève sera capable de présenter un artisanat traditionnel yacouba.",
      situation: "Visite de l'atelier d'un tisserand à Man.",
      mots: [
        { mot: 'Kpö wlan', traduction: 'Tisserand', transcription: '[kpö wlan]' },
        { mot: 'Gbö wlan', traduction: 'Forgeron', transcription: '[gbö wlan]' },
        { mot: 'Tii kpö', traduction: 'Sculpture sur bois', transcription: '[tii kpö]' },
        { mot: 'Wlan gba', traduction: 'Bien travailler / Beau travail', transcription: '[wlan gba]' },
      ]},
    // CE2
    { classe: 'CE2', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Raconter une histoire', description: 'Introduction aux contes yacouba : structure narrative simple.',
      competence: "L'élève sera capable de raconter un conte court en yacouba.",
      situation: "Le soir au coin du feu, le vieux Gbagbo raconte un conte traditionnel.",
      mots: [
        { mot: 'Nü', traduction: 'Histoire / Conte (aussi : bouche)', transcription: '[nü]' },
        { mot: 'Zan', traduction: 'Nuit (moment des contes)', transcription: '[zan]' },
        { mot: 'Gbagbo nü', traduction: 'Le conte du vieux (formule d\'ouverture)', transcription: '[gbagbo nü]' },
        { mot: 'Bha kö', traduction: 'Venir écouter', transcription: '[bha kö]' },
      ]},
    { classe: 'CE2', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'Les proverbes yacouba', description: 'Comprendre et mémoriser des proverbes fondateurs de la sagesse Dan.',
      competence: "L'élève sera capable d'expliquer le sens d'un proverbe yacouba.",
      situation: "Le conseil des anciens du village : les proverbes guident les décisions.",
      mots: [
        { mot: 'Nü gbòn', traduction: 'Proverbe / Parole des sages', transcription: '[nü gbɔ̀n]' },
        { mot: 'Gön nü', traduction: 'Sagesse de l\'homme', transcription: '[gön nü]' },
        { mot: 'Tii kpö', traduction: 'Grand arbre (symbole de sagesse)', transcription: '[tii kpö]' },
      ]},
    { classe: 'CE2', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'Le commerce au marché de Man', description: 'Négocier et acheter des produits au marché de Man.',
      competence: "L'élève sera capable de négocier un prix simple au marché.",
      situation: "Womian va seule au marché pour la première fois et doit acheter de l'huile et du riz.",
      mots: [
        { mot: 'Gbè bé', traduction: 'C\'est cher', transcription: '[gbè bé]' },
        { mot: 'Gbè blõ', traduction: 'C\'est bon marché', transcription: '[gbè blõ]' },
        { mot: 'Gbè blà', traduction: 'Prix acceptable / D\'accord', transcription: '[gbè blà]' },
        { mot: 'Blö', traduction: 'Vouloir / Désirer', transcription: '[blö]' },
      ]},
    // CM1
    { classe: 'CM1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Le corps humain — santé et hygiène', description: 'Vocabulaire de la santé en yacouba : symptômes et soins traditionnels.',
      competence: "L'élève sera capable d'exprimer des problèmes de santé et de demander des soins.",
      situation: "Danho est malade et explique ses symptômes au guérisseur traditionnel du village.",
      mots: [
        { mot: 'Gblin nü', traduction: 'Médecin / Guérisseur', transcription: '[gblin nü]' },
        { mot: 'Gba', traduction: 'Douleur / Souffrance', transcription: '[gba]' },
        { mot: 'Gbin bé', traduction: 'Aller très bien / Guéri', transcription: '[gbin bé]' },
        { mot: 'Tii gba', traduction: 'Médecine par les plantes', transcription: '[tii gba]' },
      ]},
    { classe: 'CM1', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'L\'histoire des Yacouba (Dan)', description: 'Origines et migrations du peuple Dan depuis la Guinée vers la Côte d\'Ivoire.',
      competence: "L'élève sera capable de retracer les grandes lignes de l'histoire yacouba.",
      situation: "La maîtresse d'histoire raconte l'arrivée des Dan dans la région du Tonkpi.",
      mots: [
        { mot: 'Dan', traduction: 'Peuple yacouba (nom propre)', transcription: '[dan]' },
        { mot: 'Tonkpi', traduction: 'Région de Man (en Dan)', transcription: '[tonkpi]' },
        { mot: 'Kɔ bha', traduction: 'Migration / Aller et venir', transcription: '[kɔ bha]' },
        { mot: 'Gbagbo wõ', traduction: 'Village ancestral', transcription: '[gbagbo wõ]' },
      ]},
    { classe: 'CM1', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'Les chiffres et le calcul mental', description: 'Compter jusqu\'à 100 en yacouba et faire des calculs simples.',
      competence: "L'élève sera capable de compter jusqu'à 100 en yacouba.",
      situation: "Le marchand de bétail compte ses animaux avant la vente au marché.",
      mots: [
        { mot: 'Gbangba-mu', traduction: 'Dix (forme longue)', transcription: '[gbangba-mu]' },
        { mot: 'Plɛkö-do-mu', traduction: 'Vingt', transcription: '[plɛkö-do-mu]' },
        { mot: 'Gbangba-mu taa', traduction: 'Trente', transcription: '[gbangba-mu taa]' },
        { mot: 'Gbangba-mu plɛkö-do', traduction: 'Cent', transcription: '[gbangba-mu plɛkö-do]' },
      ]},
    // CM2
    { classe: 'CM2', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Rédiger une lettre en yacouba', description: 'Structure d\'une lettre simple en yacouba : formules d\'ouverture et de clôture.',
      competence: "L'élève sera capable d'écrire une lettre courte en yacouba.",
      situation: "Koné écrit une lettre à son oncle au village pour annoncer ses résultats scolaires.",
      mots: [
        { mot: 'Nü wlan', traduction: 'Lettre (écriture)', transcription: '[nü wlan]' },
        { mot: 'Kö bé', traduction: 'Formule de salutation épistolaire', transcription: '[kö bé]' },
        { mot: 'Wlö bé', traduction: 'Formule de clôture', transcription: '[wlö bé]' },
        { mot: 'Bha kö', traduction: 'Recevoir les nouvelles', transcription: '[bha kö]' },
      ]},
    { classe: 'CM2', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'La musique traditionnelle yacouba', description: 'Les instruments de musique et les rythmes traditionnels Dan.',
      competence: "L'élève sera capable de présenter les instruments de musique traditionnels yacouba.",
      situation: "Lors de la fête du village, les musiciens jouent des instruments traditionnels.",
      mots: [
        { mot: 'Gbã', traduction: 'Tambour (dum-dum)', transcription: '[gbã]' },
        { mot: 'Dö', traduction: 'Chanter', transcription: '[dö]' },
        { mot: 'Kplö', traduction: 'Danser', transcription: '[kplö]' },
        { mot: 'Gbã dö', traduction: 'Jouer du tambour', transcription: '[gbã dö]' },
      ]},
    { classe: 'CM2', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'Introduction à la gestion du ménage', description: 'Vocabulaire du budget familial et de l\'économie domestique en yacouba.',
      competence: "L'élève sera capable d'exprimer les besoins du foyer en yacouba.",
      situation: "La mère de Danho liste ses achats et son budget pour le mois.",
      mots: [
        { mot: 'Gbè wõ', traduction: 'Budget / Dépenses du foyer', transcription: '[gbè wõ]' },
        { mot: 'Gbè tö', traduction: 'Épargner', transcription: '[gbè tö]' },
        { mot: 'Blö bé', traduction: 'Besoin urgent', transcription: '[blö bé]' },
        { mot: 'Gbè kpö', traduction: 'Grande dépense / Prix élevé', transcription: '[gbè kpö]' },
      ]},
    // 6ème
    { classe: '6EME', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Expression orale — débattre en yacouba', description: 'Structurer une argumentation simple en yacouba.',
      competence: "L'élève sera capable d'exprimer et défendre une opinion en yacouba.",
      situation: "Débat en classe : faut-il conserver les traditions ou adopter les nouvelles technologies ?",
      mots: [
        { mot: 'N gba nü', traduction: 'Je pense que / Mon opinion', transcription: '[n gba nü]' },
        { mot: 'Aa, gba', traduction: 'Non, parce que', transcription: '[aː gba]' },
        { mot: 'Blà, gba', traduction: 'Oui, parce que', transcription: '[blà gba]' },
        { mot: 'Nü kpö', traduction: 'Argument / Raisonnement', transcription: '[nü kpö]' },
      ]},
    { classe: '6EME', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'Citoyenneté et droits des enfants', description: 'Les droits fondamentaux des enfants exprimés en yacouba.',
      competence: "L'élève sera capable d'expliquer les droits fondamentaux en yacouba.",
      situation: "Le délégué de classe présente les droits des enfants lors de la journée des droits de l'enfant.",
      mots: [
        { mot: 'Pío gbla', traduction: 'Droits de l\'enfant', transcription: '[pío gbla]' },
        { mot: 'Wõ gbla', traduction: 'Droit au logement / Sécurité', transcription: '[wõ gbla]' },
        { mot: 'Gba gbla', traduction: 'Droit au travail / Éducation', transcription: '[gba gbla]' },
        { mot: 'Gbla', traduction: 'Droit / Justice / Paix', transcription: '[gbla]' },
      ]},
    { classe: '6EME', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'Les métiers modernes en yacouba', description: 'Vocabulaire des professions modernes : médecin, enseignant, ingénieur.',
      competence: "L'élève sera capable de présenter des métiers modernes en yacouba.",
      situation: "La journée des métiers à l'école : chaque élève présente le métier de ses parents.",
      mots: [
        { mot: 'Nü gblin', traduction: 'Enseignant / Celui qui explique', transcription: '[nü gblin]' },
        { mot: 'Gblin nü', traduction: 'Médecin (celui qui guérit avec des mots)', transcription: '[gblin nü]' },
        { mot: 'Wõ wlan', traduction: 'Architecte / Bâtisseur', transcription: '[wõ wlan]' },
        { mot: 'Sié wlan', traduction: 'Électricien / Technicien de l\'énergie', transcription: '[sié wlan]' },
      ]},
    // 5ème
    { classe: '5EME', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Les temps du récit en yacouba', description: 'Raconter des événements passés et futurs — expression du temps.',
      competence: "L'élève sera capable d'exprimer des actions au passé et au futur en yacouba.",
      situation: "Koné raconte à sa classe ses vacances au village de Man.",
      mots: [
        { mot: 'Bé', traduction: 'Marqueur de complétude / Passé accompli', transcription: '[bé]' },
        { mot: 'Blö', traduction: 'Futur / Vouloir (intention)', transcription: '[blö]' },
        { mot: 'Ka', traduction: 'Déjà / Passé récent', transcription: '[ka]' },
        { mot: 'Tö', traduction: 'Encore / Futur proche', transcription: '[tö]' },
      ]},
    { classe: '5EME', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'L\'environnement et le développement durable', description: 'Protéger la forêt et la nature en culture yacouba.',
      competence: "L'élève sera capable de présenter l'importance de la nature dans la culture yacouba.",
      situation: "La déforestation menace les forêts sacrées du Tonkpi : débat en classe.",
      mots: [
        { mot: 'Gla gbla', traduction: 'Forêt protégée / Forêt sacrée', transcription: '[gla gbla]' },
        { mot: 'Tii gbla', traduction: 'Arbre sacré / Protéger les arbres', transcription: '[tii gbla]' },
        { mot: 'Yii gbla', traduction: 'Eau propre / Source protégée', transcription: '[yiː gbla]' },
        { mot: 'Gla gbé', traduction: 'Forêt abîmée / Déforestation', transcription: '[gla gbé]' },
      ]},
    { classe: '5EME', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'Le tourisme culturel à Man', description: 'Valoriser le patrimoine de Man pour le tourisme.',
      competence: "L'élève sera capable de présenter les atouts touristiques de Man en yacouba.",
      situation: "Un journaliste visite Man et interviewe les élèves sur les attraits de leur ville.",
      mots: [
        { mot: 'Wõ gbin', traduction: 'Belle région / Patrimoine', transcription: '[wõ gbin]' },
        { mot: 'Gè gbagba', traduction: 'Fête du masque (attraction touristique)', transcription: '[gɛ gbagba]' },
        { mot: 'Gblon bé', traduction: 'Montagnes impressionnantes', transcription: '[gblon bé]' },
        { mot: 'Bha wõ', traduction: 'Venir visiter / Bienvenue', transcription: '[bha wõ]' },
      ]},
    // 4ème
    { classe: '4EME', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Production écrite — le portrait', description: 'Rédiger le portrait d\'un personnage yacouba en style descriptif.',
      competence: "L'élève sera capable de rédiger un portrait détaillé en yacouba.",
      situation: "Décrire le masque Gè pour un dictionnaire culturel de la langue Dan.",
      mots: [
        { mot: 'Nü gbin', traduction: 'Description / Portrait', transcription: '[nü gbin]' },
        { mot: 'Kpö', traduction: 'Grand / Fort', transcription: '[kpö]' },
        { mot: 'Bé', traduction: 'Très / Beaucoup (intensificateur)', transcription: '[bé]' },
        { mot: 'Wõ gbin', traduction: 'Beau / Bienveillant', transcription: '[wõ gbin]' },
      ]},
    { classe: '4EME', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'Les femmes et la société yacouba', description: 'Rôle et statut de la femme dans la tradition et la modernité.',
      competence: "L'élève sera capable de présenter le rôle de la femme dans la société Dan.",
      situation: "La journée de la femme : les élèves présentent des femmes leaders de la communauté yacouba.",
      mots: [
        { mot: 'Wɛ kpö', traduction: 'Femme forte / Leader', transcription: '[wɛ kpö]' },
        { mot: 'Na gbla', traduction: 'Mère protectrice / Droit des femmes', transcription: '[na gbla]' },
        { mot: 'Wɛ gba', traduction: 'Femme active / Travailleuse', transcription: '[wɛ gba]' },
        { mot: 'Gbla do', traduction: 'Égalité / Justice pour tous', transcription: '[gbla do]' },
      ]},
    { classe: '4EME', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'L\'entrepreneuriat local', description: 'Créer une petite entreprise artisanale en pays Dan.',
      competence: "L'élève sera capable de présenter un projet entrepreneurial en yacouba.",
      situation: "Concours de mini-projets entrepreneuriaux à l'école : tissu Dan, artisanat, agroalimentaire.",
      mots: [
        { mot: 'Gbè wlan', traduction: 'Entreprise / Affaires', transcription: '[gbè wlan]' },
        { mot: 'Gbè gbin', traduction: 'Bon profit / Affaires qui marchent', transcription: '[gbè gbin]' },
        { mot: 'Wlan do', traduction: 'Travailler en équipe', transcription: '[wlan do]' },
        { mot: 'Yii gbè', traduction: 'Investissement (eau = source de richesse)', transcription: '[yiː gbè]' },
      ]},
    // 3ème
    { classe: '3EME', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'La communication interculturelle', description: 'Communiquer entre les langues et cultures ivoiriennes.',
      competence: "L'élève sera capable de présenter sa culture yacouba à un locuteur d'une autre langue ivoirienne.",
      situation: "Rencontre culturelle entre élèves yacouba, baoulé et dioula de différentes régions.",
      mots: [
        { mot: 'Nü blö', traduction: 'Vouloir parler / Communiquer', transcription: '[nü blö]' },
        { mot: 'Nü gblin', traduction: 'Traducteur / Interprète', transcription: '[nü gblin]' },
        { mot: 'Dan nü', traduction: 'Langue yacouba', transcription: '[dan nü]' },
        { mot: 'Nü kpö', traduction: 'Langue forte / Riche', transcription: '[nü kpö]' },
      ]},
    { classe: '3EME', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'Laïcité et coexistence pacifique', description: 'Vivre ensemble dans le respect des différences en Côte d\'Ivoire.',
      competence: "L'élève sera capable d'expliquer les valeurs de paix et de coexistence.",
      situation: "Le conseil municipal de Man vote pour un programme de cohésion sociale.",
      mots: [
        { mot: 'Gbla do', traduction: 'Paix pour tous / Égalité', transcription: '[gbla do]' },
        { mot: 'Wõ gbin do', traduction: 'Beau village pour tous', transcription: '[wõ gbin do]' },
        { mot: 'Nü gbla', traduction: 'Accord / Traité de paix', transcription: '[nü gbla]' },
        { mot: 'Do gba', traduction: 'Construire ensemble', transcription: '[do gba]' },
      ]},
    { classe: '3EME', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'Orientation professionnelle', description: 'Explorer les filières professionnelles accessibles depuis Man.',
      competence: "L'élève sera capable de présenter son projet professionnel en yacouba.",
      situation: "Journée portes ouvertes au lycée technique de Man : les élèves de 3ème découvrent les filières.",
      mots: [
        { mot: 'Gba blö', traduction: 'Projet professionnel / Ambition', transcription: '[gba blö]' },
        { mot: 'Wlan nü', traduction: 'Formation professionnelle', transcription: '[wlan nü]' },
        { mot: 'Blo gbagba', traduction: 'Avenir / Perspective', transcription: '[blo gbagba]' },
        { mot: 'N blö gba', traduction: 'Je veux travailler comme...', transcription: '[n blö gba]' },
      ]},
    // 2nde
    { classe: '2NDE', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Littérature orale Dan — les épopées', description: 'Étude des épopées heroïques transmises oralement dans la tradition yacouba.',
      competence: "L'élève sera capable d'analyser et de raconter une épopée yacouba.",
      situation: "Un griot professionnel vient présenter l'épopée de Gbagbo-Kpö (le grand ancêtre) à la classe.",
      mots: [
        { mot: 'Gbagbo nü kpö', traduction: 'Grande épopée ancestrale', transcription: '[gbagbo nü kpö]' },
        { mot: 'Gön kpö', traduction: 'Héros / Grand homme', transcription: '[gön kpö]' },
        { mot: 'Nü tö', traduction: 'Tradition orale / Récit', transcription: '[nü tö]' },
        { mot: 'Dö nü', traduction: 'Chanter le récit (griot)', transcription: '[dö nü]' },
      ]},
    { classe: '2NDE', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'Patrimoine immatériel et UNESCO', description: 'Le masque Gè et la candidature du patrimoine Dan à l\'UNESCO.',
      competence: "L'élève sera capable de présenter le patrimoine immatériel yacouba au niveau international.",
      situation: "La Côte d'Ivoire prépare un dossier UNESCO pour les masques Dan : les lycéens s'impliquent.",
      mots: [
        { mot: 'Gè gbla', traduction: 'Masque protégé / Patrimoine', transcription: '[gɛ gbla]' },
        { mot: 'Wõ kpö gbla', traduction: 'Patrimoine mondial', transcription: '[wõ kpö gbla]' },
        { mot: 'Gblin wõ', traduction: 'Présenter au monde', transcription: '[gblin wõ]' },
        { mot: 'Tö gbla', traduction: 'Préserver / Sauvegarder', transcription: '[tö gbla]' },
      ]},
    { classe: '2NDE', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'Agriculture moderne et tradition', description: 'Intégrer les techniques modernes à l\'agriculture traditionnelle yacouba.',
      competence: "L'élève sera capable de comparer les méthodes agricoles traditionnelles et modernes.",
      situation: "Un agronome explique comment améliorer les rendements tout en respectant les pratiques Dan.",
      mots: [
        { mot: 'Blo gbagba', traduction: 'Agriculture améliorée / Champ productif', transcription: '[blo gbagba]' },
        { mot: 'Yaan kpö', traduction: 'Semence améliorée', transcription: '[yaan kpö]' },
        { mot: 'Yii blo', traduction: 'Irrigation / Eau pour le champ', transcription: '[yiː blo]' },
        { mot: 'Gba kpö', traduction: 'Récolte abondante', transcription: '[gba kpö]' },
      ]},
    // 1ère
    { classe: '1ERE', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Linguistique du Dan — phonologie', description: 'Étude scientifique des tons et phonèmes de la langue Dan/Yacouba.',
      competence: "L'élève sera capable d'analyser le système tonal de la langue Dan.",
      situation: "Cours de linguistique appliquée : comment les tons changent le sens des mots en yacouba.",
      mots: [
        { mot: 'Nü gba', traduction: 'Linguistique / Science de la langue', transcription: '[nü gba]' },
        { mot: 'Tö bé', traduction: 'Ton haut', transcription: '[tö bé]' },
        { mot: 'Tö blõ', traduction: 'Ton bas', transcription: '[tö blõ]' },
        { mot: 'Nü wlan', traduction: 'Écriture / Alphabet Dan', transcription: '[nü wlan]' },
      ]},
    { classe: '1ERE', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'Les institutions politiques yacouba', description: 'Organisation politique traditionnelle et institutions modernes.',
      competence: "L'élève sera capable de comparer les institutions traditionnelles et modernes.",
      situation: "Le chef de canton et le sous-préfet travaillent ensemble : complémentarité des pouvoirs.",
      mots: [
        { mot: 'Wõ gbòn', traduction: 'Chef de village / Autorité', transcription: '[wõ gbɔ̀n]' },
        { mot: 'Gbla kpö', traduction: 'Loi / Constitution', transcription: '[gbla kpö]' },
        { mot: 'Gön nü kpö', traduction: 'Parlement / Conseil', transcription: '[gön nü kpö]' },
        { mot: 'Gbla do', traduction: 'Droit universel / Justice', transcription: '[gbla do]' },
      ]},
    { classe: '1ERE', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'Communication professionnelle en yacouba', description: 'Rédiger des documents professionnels simples en Dan.',
      competence: "L'élève sera capable de rédiger un rapport ou un compte-rendu en yacouba.",
      situation: "Le secrétaire de la coopérative agricole rédige le compte-rendu de la réunion en yacouba.",
      mots: [
        { mot: 'Nü wlan kpö', traduction: 'Rapport / Document officiel', transcription: '[nü wlan kpö]' },
        { mot: 'Gbla nü', traduction: 'Compte-rendu / Décision', transcription: '[gbla nü]' },
        { mot: 'Wlan gba', traduction: 'Rédiger soigneusement', transcription: '[wlan gba]' },
        { mot: 'Gba nü', traduction: 'Résumer / Synthétiser', transcription: '[gba nü]' },
      ]},
    // TLE
    { classe: 'TLE', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Maîtrise stylistique — la rhétorique Dan', description: 'Figures de style et procédés rhétoriques dans la langue Dan.',
      competence: "L'élève sera capable d'utiliser les figures de style de la tradition orale Dan.",
      situation: "Le concours d'éloquence en yacouba : défendre un point de vue avec art et persuasion.",
      mots: [
        { mot: 'Nü bé gbagba', traduction: 'Éloquence / Art oratoire', transcription: '[nü bé gbagba]' },
        { mot: 'Nü gbòn', traduction: 'Proverbe / Figure de style', transcription: '[nü gbɔ̀n]' },
        { mot: 'Dö nü', traduction: 'Poésie / Chant (rhétorique)', transcription: '[dö nü]' },
        { mot: 'Nü kpö gba', traduction: 'Argument puissant', transcription: '[nü kpö gba]' },
      ]},
    { classe: 'TLE', pilier: 'CULTURE_CITOYENNETE', trimestre: 'T1', semaine: 1,
      titre: 'Philosophie africaine et pensée yacouba', description: 'Les valeurs philosophiques fondamentales de la pensée Dan.',
      competence: "L'élève sera capable de présenter les valeurs philosophiques de la pensée yacouba.",
      situation: "Séance de philosophie : le concept yacouba de l'Ubuntu — « Je suis parce que nous sommes ».",
      mots: [
        { mot: 'Gön do', traduction: 'L\'humanité partagée / Ubuntu yacouba', transcription: '[gön do]' },
        { mot: 'Nü gbla kpö', traduction: 'Sagesse universelle', transcription: '[nü gbla kpö]' },
        { mot: 'Wõ gon do', traduction: 'Le village, c\'est nous tous', transcription: '[wõ gon do]' },
        { mot: 'Gblin kpö', traduction: 'Connaissance / Savoir', transcription: '[gblin kpö]' },
      ]},
    { classe: 'TLE', pilier: 'PRATIQUE_METIERS', trimestre: 'T1', semaine: 1,
      titre: 'Projet professionnel — valorisation de la langue', description: 'Créer une activité professionnelle centrée sur la valorisation de la langue yacouba.',
      competence: "L'élève sera capable de concevoir un projet de valorisation de la langue Dan.",
      situation: "Présentation de projets de fin d'études : application numérique, dictionnaire, podcast en yacouba.",
      mots: [
        { mot: 'Dan nü gbagba', traduction: 'Valorisation de la langue Dan', transcription: '[dan nü gbagba]' },
        { mot: 'Nü tö', traduction: 'Documenter / Archiver la langue', transcription: '[nü tö]' },
        { mot: 'Gba nü kpö', traduction: 'Projet ambitieux / Grande œuvre', transcription: '[gba nü kpö]' },
        { mot: 'Wõ kpö gblin', traduction: 'Diffuser au monde entier', transcription: '[wõ kpö gblin]' },
      ]},
    // CHERCHEUR I
    { classe: 'CHERCHEUR_1', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Méthodologie de la recherche linguistique', description: 'Initiation aux méthodes de collecte de données linguistiques en terrain yacouba.',
      competence: "Le chercheur sera capable de conduire une enquête linguistique de terrain.",
      situation: "Enquête dans les villages du Tonkpi pour collecter des variations dialectales du Dan.",
      mots: [
        { mot: 'Nü gblin kpö', traduction: 'Recherche linguistique avancée', transcription: '[nü gblin kpö]' },
        { mot: 'Wõ nü', traduction: 'Enquête de terrain', transcription: '[wõ nü]' },
        { mot: 'Nü tö kpö', traduction: 'Documentation complète', transcription: '[nü tö kpö]' },
        { mot: 'Dan nü tö', traduction: 'Archiver la langue Dan', transcription: '[dan nü tö]' },
      ]},
    { classe: 'CHERCHEUR_2', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Dialectologie du Dan — variations régionales', description: 'Étude des variantes dialectales du Dan dans les sous-préfectures de Man.',
      competence: "Le chercheur sera capable d'identifier et décrire les variantes dialectales du Dan.",
      situation: "Comparaison des parlers Dan de Man, Danané, Biankouma et Zouan-Hounien.",
      mots: [
        { mot: 'Dan tö', traduction: 'Dialecte local / Variante', transcription: '[dan tö]' },
        { mot: 'Nü kpö blö', traduction: 'Différence linguistique', transcription: '[nü kpö blö]' },
        { mot: 'Wõ Dan nü', traduction: 'Communauté linguistique Dan', transcription: '[wõ dan nü]' },
        { mot: 'Gblin do', traduction: 'Comprendre ensemble / Intercompréhension', transcription: '[gblin do]' },
      ]},
    { classe: 'CHERCHEUR_3', pilier: 'LANGUE_COMMUNICATION', trimestre: 'T1', semaine: 1,
      titre: 'Rédaction d\'un travail de recherche en Dan', description: 'Rédiger et soutenir un travail de recherche original sur la langue Dan.',
      competence: "Le chercheur sera capable de produire et diffuser un travail de recherche en langue Dan.",
      situation: "Soutenance du mémoire de Chercheur Linguiste ILA devant un jury d'experts.",
      mots: [
        { mot: 'Nü wlan kpö bé', traduction: 'Thèse / Grand travail de recherche', transcription: '[nü wlan kpö bé]' },
        { mot: 'Gblin kpö bé', traduction: 'Expert linguiste', transcription: '[gblin kpö bé]' },
        { mot: 'Dan nü kpö gbla', traduction: 'Sauvegarde complète de la langue Dan', transcription: '[dan nü kpö gbla]' },
        { mot: 'Wõ kpö gba', traduction: 'Contribuer à la connaissance mondiale', transcription: '[wõ kpö gba]' },
      ]},
  ].map(l => ({
    ...l,
    steps: [
      { type: 'VOCABULARY', contenu: { mots: l.mots } },
    ],
  }))),
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  const token = process.argv[2];
  if (!token) {
    console.error('Usage : node seed-dpfc-programme.js <ADMIN_TOKEN>');
    process.exit(1);
  }

  // 1) Récupérer la carte grade code → id
  const gradesRes = await (async () => {
    return new Promise((resolve, reject) => {
      https.get({
        hostname: API, path: '/api/curriculum/grades',
        headers: { Authorization: 'Bearer ' + token },
      }, res => {
        let buf = ''; res.on('data', c => buf += c);
        res.on('end', () => { try { resolve(JSON.parse(buf)); } catch { reject(buf); }});
      }).on('error', reject);
    });
  })();

  const gradeMap = {};
  const gradesList = gradesRes.grades ?? gradesRes;
  for (const g of gradesList) gradeMap[g.code] = g.id;

  console.log(`\n✅ ${Object.keys(gradeMap).length} classes chargées`);
  console.log('📚 Création du programme DPFC Yacouba...\n');

  let created = 0;
  for (const lecon of PROGRAMME) {
    const gradeLevelId = gradeMap[lecon.classe];
    if (!gradeLevelId) {
      console.warn(`  ⚠ Classe inconnue : ${lecon.classe}`);
      continue;
    }

    // Créer la leçon
    const lessonRes = await send(
      lecon.titre,
      '/lessons',
      {
        languageId:   LANG_ID,
        gradeLevelId,
        pilier:       lecon.pilier,
        trimestre:    lecon.trimestre,
        semaine:      lecon.semaine,
        titre:        lecon.titre,
        description:  lecon.description,
        competence:   lecon.competence,
        situation:    lecon.situation,
        isObligatoire: true,
        isActive:     true,
        niveau:       'A1',
        ordre:        (lecon.semaine ?? 1),
        pointsXp:     50,
      },
      token
    );

    if (!lessonRes?.lesson?.id && !lessonRes?.id) continue;
    const lessonId = lessonRes?.lesson?.id ?? lessonRes?.id;
    created++;

    // Créer les steps
    for (let i = 0; i < (lecon.steps ?? []).length; i++) {
      const step = lecon.steps[i];
      await send(
        `  step ${step.type}`,
        `/lessons/${lessonId}/steps`,
        { type: step.type, contenu: step.contenu, ordre: i + 1 },
        token
      );
    }
  }

  console.log(`\n\n✅ ${created} leçons créées · ${ok} requêtes OK · ${fail} erreurs`);
}

main().catch(console.error);
