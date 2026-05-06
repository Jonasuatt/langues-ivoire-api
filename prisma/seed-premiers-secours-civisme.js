/**
 * Seed — Premiers Secours & Civisme
 * Contenu authentique en langues ivoiriennes
 * node prisma/seed-premiers-secours-civisme.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── IDs des langues ───────────────────────────────────────────────────────────
const LANGS = {
  baoule:  'f6f45144-06da-4f12-92f2-4e0f356e4f70',
  dioula:  '2bbc52e2-a1ee-486d-a5cf-bd015f6db970',
  bete:    '1de1675c-9ff3-44e4-b382-123ef2379ba3',
  senoufo: 'd0706991-ffb9-4650-8c5d-1bb02b1846ab',
  agni:    '42c4b895-839d-449f-9bf5-e67fb13ad61c',
  gouro:   '7d39c327-9761-4501-910a-09989cb0262d',
  guere:   '2a6632cb-ded1-48ee-b212-b00b73ccaf84',
  nouchi:  '8816c821-ef80-41c4-920a-15f4c8683e24',
};

// ─── PREMIERS SECOURS ──────────────────────────────────────────────────────────
const PREMIERS_SECOURS = [

  // ── APPEL SECOURS ──────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    situation: 'appel_secours',
    consigne: 'Ka seben 15 fɔ ka dɔgɔtɔrɔ wele',
    traduction: 'Appelez le 15 pour appeler un médecin',
    transcription: '[ka sɛbɛn kɛ̃za fɔ ka dɔgɔtɔrɔ wɛlɛ]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    situation: 'appel_secours',
    consigne: 'Bɔ 15 nun wa dɔkɔtɔ wule',
    traduction: 'Composez le 15 et appelez le docteur',
    transcription: '[bɔ kɛ̃za nun wa dɔkɔtɔ wulɛ]',
    genreVoix: 'F',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.bete,
    situation: 'appel_secours',
    consigne: 'Sɛ nɔmɔrɔ 15 glɔ dɔkɔtɔ',
    traduction: 'Appelez le numéro 15 pour le médecin',
    transcription: '[sɛ nɔmɔrɔ kɛ̃za glɔ dɔkɔtɔ]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.guere,
    situation: 'appel_secours',
    consigne: 'Gbɔ 15 kɔ dɔkɔtɔ kɔlɛ',
    traduction: 'Composez le 15 pour appeler le médecin',
    transcription: '[gbɔ kɛ̃za kɔ dɔkɔtɔ kɔlɛ]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    situation: 'appel_secours',
    consigne: 'Djo 15 là, djo vite ! C\'est urgence !',
    traduction: 'Appelle le 15, fais vite ! C\'est une urgence !',
    transcription: '[dʒo kɛ̃za la, dʒo vitɛ ! sɛ yʁɑ̃s !]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },

  // ── ARRET CARDIAQUE ─────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    situation: 'arret_cardiaque',
    consigne: 'A sɔnɔ tɛ kɛ — A sɔnɔ — Ka se a dɔnkili kɔ sigi ani ka dòni kɛ',
    traduction: 'Il ne respire pas — Appelez — Posez vos mains sur sa poitrine et appuyez',
    transcription: '[a sɔnɔ te ke — a sɔnɔ — ka se a dɔnkili kɔ sigi ani ka doni ke]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    situation: 'arret_cardiaque',
    consigne: 'Wa mlo su ndɛ — wule 15 — nga wla ɔ wɔsu wa pɔlɛ',
    traduction: 'Il ne respire plus — Appelez le 15 — Posez tes mains sur sa poitrine et appuie',
    transcription: '[wa mlo su ndɛ — wulɛ kɛ̃za — ŋga wla ɔ wɔsu wa pɔlɛ]',
    genreVoix: 'F',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.agni,
    situation: 'arret_cardiaque',
    consigne: 'Ɔ wiene mlɔ kwɛ — Wule 15 — Fa wo nsã bla n\'guan su wié pɔlɛ',
    traduction: 'Il ne respire plus du tout — Appelez le 15 — Mets tes mains sur sa poitrine et appuie',
    transcription: '[ɔ wiɛnɛ mlɔ kwɛ — wulɛ kɛ̃za — fa wo nsã bla ŋguan su wiɛ pɔlɛ]',
    genreVoix: 'F',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    situation: 'arret_cardiaque',
    consigne: 'Le gars ya son cœur qui s\'arrêté — Appui fort sur son poitrail — Compte 1-2-3 !',
    traduction: 'Le cœur s\'est arrêté — Effectuez un massage cardiaque — Comptez le rythme',
    transcription: '[lɛ ɡa ja sɔ̃ kœʁ ki saʁɛte — apɥi fɔʁ syʁ sɔ̃ pwatʁaj — kɔ̃t ɛ̃-dø-tʁwa]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },

  // ── ETOUFFEMENT ─────────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    situation: 'etouffement',
    consigne: 'Nεgεn a kɔfɛ ka a dɔgɔ fla — a ka jaanu bɛ a dɔn na',
    traduction: 'Penchez-le en avant et frappez-lui 5 fois dans le dos — l\'objet sortira',
    transcription: '[nɛgɛn a kɔfɛ ka a dɔgɔ fla — a ka jaanu bɛ a dɔn na]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    situation: 'etouffement',
    consigne: 'Yɔ ɔ n\'glɔ su kpata — bo ɔ akɔkɔ nun 5 cɛn',
    traduction: 'Penchez-le en avant — Frappez-lui le dos 5 fois',
    transcription: '[jɔ ɔ nglɔ su kpata — bo ɔ akɔkɔ nun sanu cɛn]',
    genreVoix: 'F',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.guere,
    situation: 'etouffement',
    consigne: 'Gblɛ a to kɔ — kpli a kɔ vlo anu ble',
    traduction: 'Penchons-le en avant — Donnons 5 coups dans le dos',
    transcription: '[gblɛ a to kɔ — kpli a kɔ vlo anu blɛ]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    situation: 'etouffement',
    consigne: 'Djê-le en avant — tape fort dans son dos — 5 fois direct !',
    traduction: 'Penchez-le en avant — tapez-lui fort dans le dos 5 fois',
    transcription: '[dʒe lɛ ɑ̃ avɑ̃ — tap fɔʁ dɑ̃ sɔ̃ do — sɛ̃k fwa diʁɛkt]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },

  // ── MISE EN SECURITE ────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    situation: 'mise_en_securite',
    consigne: 'Bɔ a ka sira kɔnɔ — Ka a laban ka a sigi a kɔfɛ la',
    traduction: 'Écartez-le du danger — Tournez-le sur le côté pour qu\'il reste allongé',
    transcription: '[bɔ a ka sira kɔnɔ — ka a laban ka a sigi a kɔfɛ la]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    situation: 'mise_en_securite',
    consigne: 'Tɔ ɔ a bɔlɛ su — yɔ ɔ kɔ wa côté',
    traduction: 'Éloignez-le du danger — Mettez-le en position latérale de sécurité',
    transcription: '[tɔ ɔ a bɔlɛ su — jɔ ɔ kɔ wa kote]',
    genreVoix: 'F',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.senoufo,
    situation: 'mise_en_securite',
    consigne: 'Pàa ŋ̀ bɛ kasɛɛ — ŋ̀ tɛgɛ kɛɛn kɔnɔ',
    traduction: 'Éloignez-le du danger — Couchez-le sur le côté',
    transcription: '[pàa ŋ bɛ kasɛɛ — ŋ tɛgɛ kɛɛn kɔnɔ]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    situation: 'mise_en_securite',
    consigne: 'Mets-le loin du danger là — Couche-le sur le côté — Fais vite !',
    traduction: 'Éloignez-le du danger — Mettez-le en position latérale de sécurité',
    transcription: '[mɛ lɛ lwɛ̃ dy dɑ̃ʒe la — kuʃ lɛ syʁ lɛ kote — fɛ vit]',
    genreVoix: 'M',
    priorite: 2,
    isActive: true,
  },

  // ── NOYADE ──────────────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    situation: 'noyade',
    consigne: 'Bɔ mɔgɔ jii kɔnɔ — Ka a sigi a kɔfɛ — Ka a sɔnɔ kɔrɔ',
    traduction: 'Sortez la personne de l\'eau — Allongez-la sur le côté — Vérifiez si elle respire',
    transcription: '[bɔ mɔgɔ jiː kɔnɔ — ka a sigi a kɔfɛ — ka a sɔnɔ kɔrɔ]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    situation: 'noyade',
    consigne: 'Tɔ ɔ ndɛ ji su — Yɔ ɔ kɔ — Hɔ ɔ mlo',
    traduction: 'Sortez-le de l\'eau — Allongez-le — Vérifiez sa respiration',
    transcription: '[tɔ ɔ ndɛ ji su — jɔ ɔ kɔ — hɔ ɔ mlo]',
    genreVoix: 'F',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.gouro,
    situation: 'noyade',
    consigne: 'Ɓa ŋɛ ji la — Ŋ sigi we — Ɓɛlɛ ŋ sɔnɔ',
    traduction: 'Sortez-le de l\'eau — Allongez-le — Vérifiez sa respiration',
    transcription: '[ɓa ŋɛ ji la — ŋ sigi wɛ — ɓɛlɛ ŋ sɔnɔ]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    situation: 'noyade',
    consigne: 'Tire-le de l\'eau vite — Couche-le — Vérifie s\'il soufle encore',
    traduction: 'Sortez-le de l\'eau rapidement — Allongez-le — Vérifiez sa respiration',
    transcription: '[tiʁ lɛ dɛ lo vit — kuʃ lɛ — veʁifi sil sufl ɑ̃kɔʁ]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },

  // ── BRULURE ─────────────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    situation: 'brulure',
    consigne: 'Jii jɛlen don a kan dɔ min minɛn — Bɔ a fani',
    traduction: 'Versez de l\'eau froide dessus pendant 10 minutes — Enlevez les vêtements',
    transcription: '[jiː dʒɛlɛn don a kan dɔ min minɛn — bɔ a fani]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    situation: 'brulure',
    consigne: 'Fɔlɔ ji jɛlɛn su — Minman 10 — Bɔ ndɛ fani',
    traduction: 'Versez d\'abord de l\'eau froide — Pendant 10 minutes — Enlevez les habits',
    transcription: '[fɔlɔ ji dʒɛlɛn su — minman kɔɲɔŋ — bɔ ndɛ fani]',
    genreVoix: 'F',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.bete,
    situation: 'brulure',
    consigne: 'Dɔ ji jɛlɛn a kan — Mɛɛn 10 — Bɔ a fani',
    traduction: 'Mettre de l\'eau froide sur la brûlure — 10 minutes — Enlever les habits',
    transcription: '[dɔ ji dʒɛlɛn a kan — mɛɛn kɔɲɔŋ — bɔ a fani]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    situation: 'brulure',
    consigne: 'Mets de l\'eau froide dessus — 10 minutes chacun ! — Enlève ses habits brûlés',
    traduction: 'Refroidissez la brûlure à l\'eau froide 10 minutes — Retirez les vêtements',
    transcription: '[mɛ dɛ lo fʁwad dɛsy — dis minyt ʃakɛ̃ — ɑ̃lɛv sɛ abi bʁyle]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },

  // ── FRACTURE ────────────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    situation: 'fracture',
    consigne: 'Kana a yɔrɔ nin jɔn — Ka a jɛ ka boloki — Ka wele sɔrɔ',
    traduction: 'Ne bougez pas la partie blessée — Immobilisez-la — Appelez des secours',
    transcription: '[kana a jɔrɔ nin dʒɔn — ka a dʒɛ ka boloki — ka wɛlɛ sɔrɔ]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    situation: 'fracture',
    consigne: 'Kaman bo ndɛ yɔli — Yɔ ka ka a man — Wule sɔrɔ',
    traduction: 'Ne bougez pas la partie abîmée — Attachez-la bien — Appelez à l\'aide',
    transcription: '[kaman bo ndɛ jɔli — jɔ ka ka a man — wulɛ sɔrɔ]',
    genreVoix: 'F',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    situation: 'fracture',
    consigne: 'Bouge pas le member cassé — Attache bien — Appelle docteur direct',
    traduction: 'N\'immobilisez pas la partie fracturée de force — Immobilisez-la — Appelez',
    transcription: '[buʒ pa lɛ mɑ̃bʁ kase — ataʃ bjɛ̃ — apɛl dɔktœʁ diʁɛkt]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },

  // ── SAIGNEMENT ──────────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    situation: 'saignement',
    consigne: 'Di i bolo kan a joli bɔ yɔrɔ la — Ka a boloki dɔ — Ka wele sɔrɔ sɔn',
    traduction: 'Mettez la main sur la plaie — Appuyez fort — Appelez des secours rapidement',
    transcription: '[di i bolo kan a dʒoli bɔ jɔrɔ la — ka a boloki dɔ — ka wɛlɛ sɔrɔ sɔn]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    situation: 'saignement',
    consigne: 'Su bo wɔ blɛ su — Pɔ su — Wule sɔrɔ',
    traduction: 'Appuyez sur la plaie — Appuyez fort — Appelez à l\'aide',
    transcription: '[su bo wɔ blɛ su — pɔ su — wulɛ sɔrɔ]',
    genreVoix: 'F',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.guere,
    situation: 'saignement',
    consigne: 'Fa i bolo bli su — Pɔ jɔn — Glɔ sɔrɔ',
    traduction: 'Mets ta main sur la plaie — Appuie bien — Appelle à l\'aide',
    transcription: '[fa i bolo bli su — pɔ dʒɔn — glɔ sɔrɔ]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    situation: 'saignement',
    consigne: 'Appui ta main fort là où ça saigne — Tiens bien — Appelle le 15 !',
    traduction: 'Appuyez sur la plaie — Maintenez la pression — Appelez le 15',
    transcription: '[apɥi ta mɛ̃ fɔʁ la u sa sɛɲ — tjɛ̃ bjɛ̃ — apɛl lɛ kɛ̃za]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },

  // ── MALAISE ─────────────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    situation: 'malaise',
    consigne: 'Ka a sigi hɛrɛ la — Ka a sɔnɔ kɔrɔ — Ni a ma ɲɛ ka wele sɔrɔ',
    traduction: 'Installez-le confortablement — Vérifiez sa respiration — S\'il ne va pas mieux, appelez',
    transcription: '[ka a sigi hɛrɛ la — ka a sɔnɔ kɔrɔ — ni a ma ɲɛ ka wɛlɛ sɔrɔ]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    situation: 'malaise',
    consigne: 'Yɔ ɔ ba hɛrɛ — Hɔ ɔ mlo — Sɛ ɔ mman wo wule sɔrɔ',
    traduction: 'Installez-le à l\'aise — Vérifiez sa respiration — S\'il ne va pas mieux appelez',
    transcription: '[jɔ ɔ ba hɛrɛ — hɔ ɔ mlo — sɛ ɔ mman wo wulɛ sɔrɔ]',
    genreVoix: 'F',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.senoufo,
    situation: 'malaise',
    consigne: 'Tɛgɛ ŋ hɛrɛ — Ŋ sɔnɔ kɔrɔ — Ni ŋ ma ɲɛ wele sɔrɔ',
    traduction: 'Couchez-le à l\'aise — Vérifiez sa respiration — S\'il ne va pas mieux, appelez',
    transcription: '[tɛgɛ ŋ hɛrɛ — ŋ sɔnɔ kɔrɔ — ni ŋ ma ɲɛ wɛlɛ sɔrɔ]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    situation: 'malaise',
    consigne: 'Allonge-le quelque part — Vérifie s\'il respire — Si ça va pas, djo le 15',
    traduction: 'Allongez-le — Vérifiez la respiration — Si ça ne va pas, appelez le 15',
    transcription: '[alɔ̃ʒ lɛ kɛlkpaʁ — veʁifi sil ʁɛspiʁ — si sa va pa, dʒo lɛ kɛ̃za]',
    genreVoix: 'M',
    priorite: 1,
    isActive: true,
  },

  // ── EVALUATION ──────────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    situation: 'evaluation',
    consigne: 'Mamankan: I ka kɛnɛya di? — A sɔnɔ be? — A be miiri?',
    traduction: 'Posez les questions: Vous allez bien? — Il respire? — Il est conscient?',
    transcription: '[mamankan: i ka kɛnɛya di — a sɔnɔ bɛ — a bɛ miiri]',
    genreVoix: 'M',
    priorite: 0,
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    situation: 'evaluation',
    consigne: 'Bue: Aw bo hɛrɛ? — A mlo be? — A gbe be?',
    traduction: 'Demandez: Ça va? — Il respire? — Il est conscient?',
    transcription: '[buɛ: aw bo hɛrɛ — a mlo bɛ — a gbɛ bɛ]',
    genreVoix: 'F',
    priorite: 0,
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    situation: 'evaluation',
    consigne: 'Demande: Tu m\'entend? — Ça va? — Il respire encore?',
    traduction: 'Évaluez l\'état de la victime: conscience, respiration, réaction',
    transcription: '[dɛmɑ̃d: ty mɑ̃tɑ̃ — sa va — il ʁɛspiʁ ɑ̃kɔʁ]',
    genreVoix: 'M',
    priorite: 0,
    isActive: true,
  },
];

// ─── CIVISME ───────────────────────────────────────────────────────────────────
const CIVISME = [

  // ── PROVERBES CIVIQUES ──────────────────────────────────────────────────────
  {
    languageId: LANGS.baoule,
    type: 'proverbe_civique',
    titre: 'L\'union fait la force',
    contenu: 'Ɔ su ɔ bɔ mianle, ɔ be kpa blɛ',
    traduction: 'Quand on s\'unit, on devient plus fort',
    explication: 'Ce proverbe Baoulé enseigne que la communauté est plus forte que l\'individu seul. La solidarité est une valeur fondamentale en Côte d\'Ivoire.',
    genreVoix: 'F',
    valeur: 'solidarite',
    isActive: true,
  },
  {
    languageId: LANGS.dioula,
    type: 'proverbe_civique',
    titre: 'Respecter les anciens',
    contenu: 'Mɔgɔ kɔrɔ ka ɲɛfɔ, k\'a mɔgɔ wiri kan',
    traduction: 'Écouter les anciens, c\'est éviter les erreurs',
    explication: 'En Dioula, le respect des aînés est considéré comme la base d\'une société harmonieuse. Les anciens sont les gardiens de la sagesse collective.',
    genreVoix: 'M',
    valeur: 'respect',
    isActive: true,
  },
  {
    languageId: LANGS.bete,
    type: 'proverbe_civique',
    titre: 'La vérité avant tout',
    contenu: 'Ɲɛn ye sɛbɛ gbɔn na',
    traduction: 'La vérité traverse tous les murs',
    explication: 'Ce proverbe Bété exprime que la vérité finit toujours par éclater, encourageant l\'honnêteté dans la vie sociale et civique.',
    genreVoix: 'M',
    valeur: 'respect',
    isActive: true,
  },
  {
    languageId: LANGS.agni,
    type: 'proverbe_civique',
    titre: 'Ensemble on bâtit',
    contenu: 'Yɛ awa bie awa klo klo, n\'gua ye bo awa su',
    traduction: 'Si nous construisons ensemble, notre maison sera solide',
    explication: 'Les Agni valorisent le travail collectif. Ce proverbe illustre que l\'effort commun produit des résultats durables pour toute la communauté.',
    genreVoix: 'F',
    valeur: 'solidarite',
    isActive: true,
  },
  {
    languageId: LANGS.guere,
    type: 'proverbe_civique',
    titre: 'La forêt protège ses arbres',
    contenu: 'Dɔ gbɔ ye a yiri bɛlɛ',
    traduction: 'La forêt veille sur chacun de ses arbres',
    explication: 'Pour les Guéré, la communauté prend soin de chacun de ses membres comme la forêt protège ses arbres. Ce proverbe symbolise la protection mutuelle.',
    genreVoix: 'M',
    valeur: 'solidarite',
    isActive: true,
  },
  {
    languageId: LANGS.senoufo,
    type: 'proverbe_civique',
    titre: 'La parole de l\'ancien est or',
    contenu: 'Tana tɛgɛ yiri woro',
    traduction: 'La parole de l\'aîné vaut de l\'or',
    explication: 'Chez les Senoufo, la sagesse des anciens est considérée comme le bien le plus précieux. Ce proverbe encourage l\'écoute et le respect des personnes âgées.',
    genreVoix: 'M',
    valeur: 'respect',
    isActive: true,
  },
  {
    languageId: LANGS.gouro,
    type: 'proverbe_civique',
    titre: 'La main gauche lave la droite',
    contenu: 'Bolo ciɛ ye bolo kofɛ ɲin',
    traduction: 'La main gauche lave la main droite',
    explication: 'Ce proverbe Gouro exprime la réciprocité et l\'entraide : nous avons tous besoin les uns des autres pour nous réaliser pleinement.',
    genreVoix: 'F',
    valeur: 'solidarite',
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    type: 'proverbe_civique',
    titre: 'Ensemble on gagne',
    contenu: 'On est ensemble, on peut tout faire. Seul t\'es rien.',
    traduction: 'Ensemble on peut tout accomplir. Seul on n\'est rien.',
    explication: 'Expression nouchi valorisant la solidarité entre les jeunes Ivoiriens, rappelant que l\'unité est la force de la jeunesse.',
    genreVoix: 'M',
    valeur: 'solidarite',
    isActive: true,
  },

  // ── SYMBOLES DE L'ETAT ──────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    type: 'symbole_etat',
    titre: 'Drapeau de Côte d\'Ivoire — Farafina ba',
    contenu: 'Farafina ba frapo: orange, funfun, jεgεn',
    traduction: 'Le drapeau national : orange (la savane), blanc (la paix), vert (la forêt)',
    explication: 'Orange représente les savanes du nord, blanc symbolise la paix, vert représente les forêts du sud et l\'espoir. Le drapeau est le symbole de l\'unité nationale.',
    genreVoix: 'M',
    valeur: 'patriotisme',
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    type: 'symbole_etat',
    titre: 'Drapeau — Liban de Côte d\'Ivoire',
    contenu: 'Liban de Côte d\'Ivoire: atinfin, funfun, guiguinan',
    traduction: 'Drapeau de Côte d\'Ivoire : orange, blanc, vert',
    explication: 'Le drapeau ivoirien symbolise les trois grandes zones géographiques du pays et la valeur fondamentale de la paix qui unit tous les Ivoiriens.',
    genreVoix: 'F',
    valeur: 'patriotisme',
    isActive: true,
  },
  {
    languageId: LANGS.bete,
    type: 'symbole_etat',
    titre: 'Hymne national — L\'Abidjanaise',
    contenu: 'Salut ô Côte d\'Ivoire, pays de l\'espérance',
    traduction: 'Salut, ô Côte d\'Ivoire, pays de l\'espérance',
    explication: 'L\'Abidjanaise est l\'hymne national ivoirien depuis 1960. Connaître son hymne est un devoir civique qui exprime l\'attachement à la nation.',
    genreVoix: 'M',
    valeur: 'patriotisme',
    isActive: true,
  },
  {
    languageId: LANGS.agni,
    type: 'symbole_etat',
    titre: 'Éléphant — Symbole national',
    contenu: 'Sono ye Côte d\'Ivoire bo gbagba',
    traduction: 'L\'éléphant est le symbole fort de la Côte d\'Ivoire',
    explication: 'L\'éléphant est l\'emblème national de la Côte d\'Ivoire, symbole de force, de sagesse et de mémoire. Le pays est surnommé "le pays de l\'éléphant".',
    genreVoix: 'F',
    valeur: 'patriotisme',
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    type: 'symbole_etat',
    titre: 'Notre pays, notre fierté',
    contenu: 'La Côte d\'Ivoire c\'est notre gâteau. Faut la respecter !',
    traduction: 'La Côte d\'Ivoire est notre bien commun. Respectons-la !',
    explication: 'Expression nouchi qui rappelle que le pays appartient à tous ses citoyens et que chacun a la responsabilité de le préserver et de le respecter.',
    genreVoix: 'M',
    valeur: 'patriotisme',
    isActive: true,
  },

  // ── SENSIBILISATION ─────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    type: 'sensibilisation',
    titre: 'Propreté de la rue',
    contenu: 'Kana i ka fɛn bali sira la — Sira ka kɛ i ka dugu ye',
    traduction: 'Ne jetez pas vos ordures dans la rue — La rue est aussi votre maison',
    explication: 'La propreté des espaces publics est la responsabilité de chaque citoyen. Jeter des ordures dans la rue favorise les maladies et dégrade notre cadre de vie.',
    genreVoix: 'M',
    valeur: 'proprete',
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    type: 'sensibilisation',
    titre: 'Garder la rue propre',
    contenu: 'Kaman bo ndɛ fɛn fon blɛ su — Su ye aw ka fie ye',
    traduction: 'Ne jetez pas d\'ordures dans la rue — La rue c\'est aussi votre maison',
    explication: 'En Baoulé, l\'enseignement civique de la propreté est transmis dès l\'enfance. Une rue propre reflète le respect que les habitants ont pour leur environnement.',
    genreVoix: 'F',
    valeur: 'proprete',
    isActive: true,
  },
  {
    languageId: LANGS.senoufo,
    type: 'sensibilisation',
    titre: 'Sécurité routière',
    contenu: 'Cɛnkɛninkɔrɔ sira kan — Ka a sira wili — Kana kɛ nafɛ fɛn kɛ',
    traduction: 'Traversez la route prudemment — Regardez des deux côtés — Ne courez pas',
    explication: 'La sécurité routière sauve des vies. Chaque année, de nombreux accidents évitables surviennent par manque de prudence sur les routes ivoiriennes.',
    genreVoix: 'M',
    valeur: 'securite_routiere',
    isActive: true,
  },
  {
    languageId: LANGS.guere,
    type: 'sensibilisation',
    titre: 'Protéger la forêt',
    contenu: 'Dɔ gbɔ ye an ka hɛrɛ — Kana a sɛgɛ — Ka a kɛlɛ',
    traduction: 'La forêt est notre bien — Ne la détruisez pas — Protégez-la',
    explication: 'La Côte d\'Ivoire a perdu une grande partie de ses forêts. Les Guéré, gardiens de la forêt de l\'ouest, transmettent ce message de protection environnementale.',
    genreVoix: 'M',
    valeur: 'environnement',
    isActive: true,
  },
  {
    languageId: LANGS.gouro,
    type: 'sensibilisation',
    titre: 'L\'eau est sacrée',
    contenu: 'Ji ye an ka hɛrɛ — Kana ji bɛn — Ka ji kɛlɛ',
    traduction: 'L\'eau est notre richesse — Ne la gaspillez pas — Protégez l\'eau',
    explication: 'Les Gouro ont une relation profonde avec l\'eau. Ce message de sensibilisation encourage la conservation de cette ressource vitale pour les générations futures.',
    genreVoix: 'F',
    valeur: 'environnement',
    isActive: true,
  },
  {
    languageId: LANGS.agni,
    type: 'sensibilisation',
    titre: 'Payer ses impôts',
    contenu: 'Impôt yé aw ka daty — A yé aw ka kplen bo nuan',
    traduction: 'L\'impôt est votre devoir — C\'est votre contribution au développement',
    explication: 'Payer ses impôts est un acte citoyen fondamental. Les recettes fiscales financent les écoles, les hôpitaux et les routes qui profitent à tous.',
    genreVoix: 'F',
    valeur: 'etat',
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    type: 'sensibilisation',
    titre: 'Respecte la route',
    contenu: 'Faut pas courir sur la route comme ça. Tu vas mourir pour rien !',
    traduction: 'Ne traversez pas la route imprudemment. Les accidents sont évitables.',
    explication: 'Message de sécurité routière en nouchi qui rappelle aux jeunes les dangers de l\'imprudence sur la voie publique.',
    genreVoix: 'M',
    valeur: 'securite_routiere',
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    type: 'sensibilisation',
    titre: 'Garder propre',
    contenu: 'Jette pas ta bricole par terre comme ça. C\'est ton pays aussi !',
    traduction: 'Ne jetez pas vos ordures par terre. Ce pays vous appartient aussi.',
    explication: 'Sensibilisation à la propreté des espaces publics en nouchi, langage des jeunes d\'Abidjan, pour encourager la citoyenneté quotidienne.',
    genreVoix: 'M',
    valeur: 'proprete',
    isActive: true,
  },

  // ── DROITS & DEVOIRS ────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    type: 'droit_devoir',
    titre: 'Droit à l\'éducation',
    contenu: 'Denmisɛn bɛɛ be se ka kalan — Denmisɛn bɛɛ ka kan ka don lakɔli la',
    traduction: 'Tout enfant a le droit d\'apprendre — Tout enfant doit aller à l\'école',
    explication: 'L\'éducation est un droit fondamental garanti par la Constitution ivoirienne. L\'école primaire est obligatoire pour tous les enfants de 6 à 16 ans.',
    genreVoix: 'M',
    valeur: 'etat',
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    type: 'droit_devoir',
    titre: 'Voter est un droit',
    contenu: 'Wale ye aw bule — Bule ka di aw ka sɔrɔ',
    traduction: 'Voter est votre droit — Le choix vous appartient',
    explication: 'Le droit de vote est la pierre angulaire de la démocratie ivoirienne. Chaque citoyen de 18 ans et plus a le droit et le devoir de voter.',
    genreVoix: 'F',
    valeur: 'etat',
    isActive: true,
  },
  {
    languageId: LANGS.bete,
    type: 'droit_devoir',
    titre: 'Respect de la loi',
    contenu: 'Yiri ye Côte d\'Ivoire ni bo — Ɲɛn bɛɛ ka kan ka a kɛlɛ',
    traduction: 'La loi protège la Côte d\'Ivoire — Tout le monde doit la respecter',
    explication: 'Le respect de la loi est le fondement du vivre ensemble. En Bété, la notion de règle collective est profondément ancrée dans la culture.',
    genreVoix: 'M',
    valeur: 'respect',
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    type: 'droit_devoir',
    titre: 'Va voter !',
    contenu: 'Eh ! Va voter ton gars. C\'est ton droit. Faut pas laisser les autres choisir pour toi.',
    traduction: 'Allez voter. C\'est votre droit. Ne laissez pas les autres décider à votre place.',
    explication: 'Message civique en nouchi encourageant les jeunes à exercer leur droit de vote, outil fondamental de la démocratie participative.',
    genreVoix: 'M',
    valeur: 'etat',
    isActive: true,
  },

  // ── INSTITUTIONS ────────────────────────────────────────────────────────────
  {
    languageId: LANGS.dioula,
    type: 'institution',
    titre: 'Mairie — Ka cɛ dugu bolo',
    contenu: 'Mairie ye dugu ka kɔnɔ — Ka taa mairie la k\'i ka baara kɛ',
    traduction: 'La mairie gère la commune — Allez à la mairie pour vos démarches',
    explication: 'La mairie est l\'institution de proximité qui gère l\'état civil (naissance, mariage, décès), les permis de construire et les services locaux.',
    genreVoix: 'M',
    valeur: 'etat',
    isActive: true,
  },
  {
    languageId: LANGS.baoule,
    type: 'institution',
    titre: 'Gendarmerie — Sɛkuriti',
    contenu: 'Sɛkuriti yé aw kɛlɛ — Ye problems wo taa a wun le',
    traduction: 'La gendarmerie vous protège — En cas de problème, allez les voir',
    explication: 'La gendarmerie nationale et la police sont les forces de l\'ordre qui garantissent la sécurité des citoyens sur tout le territoire ivoirien.',
    genreVoix: 'F',
    valeur: 'etat',
    isActive: true,
  },
  {
    languageId: LANGS.nouchi,
    type: 'institution',
    titre: 'Les papiers c\'est important',
    contenu: 'Fais ta CNI mon gars. Sans papiers t\'es personne devant la loi.',
    traduction: 'Faites votre Carte Nationale d\'Identité. Sans papiers, vous n\'existez pas légalement.',
    explication: 'La carte nationale d\'identité est le document officiel qui atteste de la citoyenneté ivoirienne. Elle est indispensable pour toutes les démarches administratives.',
    genreVoix: 'M',
    valeur: 'etat',
    isActive: true,
  },
];

// ─── SEED ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding Premiers Secours & Civisme...\n');

  // Vider les tables existantes (données de seed seulement)
  const existingPS = await prisma.premierSecoursPhrase.count();
  const existingCiv = await prisma.civicContent.count();

  if (existingPS > 0 || existingCiv > 0) {
    console.log(`⚠️  Données existantes : ${existingPS} fiches PS, ${existingCiv} contenus Civisme`);
    console.log('   Ajout des nouvelles données sans supprimer les existantes...\n');
  }

  // ── Premiers Secours
  let psCreated = 0;
  for (const item of PREMIERS_SECOURS) {
    try {
      await prisma.premierSecoursPhrase.create({ data: item });
      psCreated++;
      process.stdout.write(`\r   Premiers Secours : ${psCreated}/${PREMIERS_SECOURS.length}`);
    } catch (e) {
      console.error(`\n   ❌ Erreur PS: ${item.consigne?.slice(0,40)} — ${e.message}`);
    }
  }
  console.log(`\n   ✅ ${psCreated} fiches Premiers Secours créées`);

  // ── Civisme
  let civCreated = 0;
  for (const item of CIVISME) {
    try {
      await prisma.civicContent.create({ data: item });
      civCreated++;
      process.stdout.write(`\r   Civisme : ${civCreated}/${CIVISME.length}`);
    } catch (e) {
      console.error(`\n   ❌ Erreur Civisme: ${item.titre} — ${e.message}`);
    }
  }
  console.log(`\n   ✅ ${civCreated} contenus Civisme créés`);

  // Résumé
  const totalPS = await prisma.premierSecoursPhrase.count();
  const totalCiv = await prisma.civicContent.count();
  console.log(`\n📊 Total en base :`);
  console.log(`   🏥 Premiers Secours : ${totalPS} fiches`);
  console.log(`   🏛️  Civisme : ${totalCiv} contenus`);
  console.log('\n🎉 Seed terminé avec succès !');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
