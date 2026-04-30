/**
 * seed-sos-phrases.js
 * Phrases SOS & Utiles pour les langues ivoiriennes du MVP
 *
 * Usage :
 *   DATABASE_URL="postgresql://..." node prisma/seed-sos-phrases.js
 *
 * Les traductions Dioula sont vérifiées. Les autres langues sont des
 * approximations à faire valider par des locuteurs natifs (status DRAFT).
 * Le Dioula est publié directement (status PUBLISHED).
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// DONNÉES PAR LANGUE
// code = code ISO de la langue dans la DB
// ─────────────────────────────────────────────────────────────────────────────

const PHRASES_PAR_LANGUE = {

  // ── DIOULA (Jula) — langue véhiculaire, phrases vérifiées ─────────────────
  dioula: {
    status: 'PUBLISHED',
    phrases: [
      {
        traduction: 'Au secours !',
        phrase: 'Dɛmɛ ! Dɛmɛ !',
        transcription: 'dè-mè ! dè-mè !',
        categorie: 'urgence',
        contexte: 'Crier pour appeler de l\'aide en situation de danger',
      },
      {
        traduction: 'Appelez la police !',
        phrase: 'Polis wele !',
        transcription: 'po-lis wè-lè !',
        categorie: 'urgence',
        contexte: 'Demander à quelqu\'un d\'appeler la police',
      },
      {
        traduction: 'Appelez un médecin !',
        phrase: 'Dɔgɔtɔrɔ wele !',
        transcription: 'dô-go-to-ro wè-lè !',
        categorie: 'urgence',
        contexte: 'Demander à quelqu\'un d\'appeler un médecin',
      },
      {
        traduction: 'Où est l\'hôpital ?',
        phrase: 'Hɔpitali be min?',
        transcription: 'hô-pi-ta-li bè min ?',
        categorie: 'urgence',
        contexte: 'Chercher un établissement de santé',
      },
      {
        traduction: 'J\'ai besoin d\'aide.',
        phrase: 'N b\'a fɛ dɛmɛ.',
        transcription: 'n ba fè dè-mè',
        categorie: 'urgence',
        contexte: 'Exprimer le besoin d\'assistance',
      },
      {
        traduction: 'Je suis perdu(e).',
        phrase: 'N tɛ sira dɔn.',
        transcription: 'n tè si-ra dôn',
        categorie: 'urgence',
        contexte: 'Indiquer que l\'on ne sait plus où l\'on est',
      },
      {
        traduction: 'Au feu !',
        phrase: 'Tasuma ! Tasuma !',
        transcription: 'ta-su-ma ! ta-su-ma !',
        categorie: 'urgence',
        contexte: 'Signaler un incendie',
      },
      {
        traduction: 'Je suis malade.',
        phrase: 'N bɛ dimi.',
        transcription: 'n bè di-mi',
        categorie: 'sante',
        contexte: 'Indiquer un problème de santé',
      },
      {
        traduction: 'J\'ai mal ici.',
        phrase: 'N bɛ dimi yen.',
        transcription: 'n bè di-mi yèn',
        categorie: 'sante',
        contexte: 'Montrer l\'endroit où on a mal',
      },
      {
        traduction: 'Je ne parle pas Dioula.',
        phrase: 'N tɛ Julakan kuma.',
        transcription: 'n tè jou-la-kan kou-ma',
        categorie: 'urgence',
        contexte: 'Indiquer une barrière linguistique',
      },
      {
        traduction: 'Parlez-vous français ?',
        phrase: 'E bɛ Faransɛkan kuma wa?',
        transcription: 'é bè fa-ran-sè-kan kou-ma wa ?',
        categorie: 'urgence',
        contexte: 'Chercher quelqu\'un qui parle français',
      },
      {
        traduction: 'Merci beaucoup.',
        phrase: 'Aw ni ce.',
        transcription: 'a-ou ni tchè',
        categorie: 'salutations',
        contexte: 'Remercier chaleureusement',
      },
    ],
  },

  // ── BAOULÉ — à valider par locuteurs natifs ────────────────────────────────
  baoule: {
    status: 'DRAFT',
    phrases: [
      {
        traduction: 'Au secours !',
        phrase: 'Ɔkua ! Ɔkua !',
        transcription: 'ô-koua ! ô-koua !',
        categorie: 'urgence',
        contexte: 'Crier pour appeler de l\'aide',
      },
      {
        traduction: 'Appelez un médecin !',
        phrase: 'Kɔ dɔkita kɔ !',
        transcription: 'kô do-ki-ta kô !',
        categorie: 'urgence',
        contexte: 'Demander à quelqu\'un d\'appeler un médecin',
      },
      {
        traduction: 'Où est l\'hôpital ?',
        phrase: 'Ɔpitali lo fi?',
        transcription: 'ô-pi-ta-li lo fi ?',
        categorie: 'urgence',
        contexte: 'Chercher un établissement de santé',
      },
      {
        traduction: 'J\'ai besoin d\'aide.',
        phrase: 'N wla ɔkua.',
        transcription: 'n oua-la ô-koua',
        categorie: 'urgence',
        contexte: 'Exprimer le besoin d\'assistance',
      },
      {
        traduction: 'Je suis malade.',
        phrase: 'N yɔ bo.',
        transcription: 'n yô bo',
        categorie: 'sante',
        contexte: 'Indiquer un problème de santé',
      },
      {
        traduction: 'Merci.',
        phrase: 'Mo.',
        transcription: 'mo',
        categorie: 'salutations',
        contexte: 'Remercier',
      },
    ],
  },

  // ── BÉTÉ — à valider par locuteurs natifs ─────────────────────────────────
  bete: {
    status: 'DRAFT',
    phrases: [
      {
        traduction: 'Au secours !',
        phrase: 'Sɛ tʋ ! Sɛ tʋ !',
        transcription: 'sè tou ! sè tou !',
        categorie: 'urgence',
        contexte: 'Crier pour appeler de l\'aide',
      },
      {
        traduction: 'J\'ai besoin d\'aide.',
        phrase: 'N yɛ kpan sɛ.',
        transcription: 'n yè kpan sè',
        categorie: 'urgence',
        contexte: 'Exprimer le besoin d\'assistance',
      },
      {
        traduction: 'Je suis malade.',
        phrase: 'N ɲɔ klɔ.',
        transcription: 'n ñô klo',
        categorie: 'sante',
        contexte: 'Indiquer un problème de santé',
      },
      {
        traduction: 'Merci.',
        phrase: 'Ɛ bha.',
        transcription: 'è bha',
        categorie: 'salutations',
        contexte: 'Remercier',
      },
    ],
  },

  // ── GUÉRÉ (Wè) — à valider par locuteurs natifs ───────────────────────────
  guere: {
    status: 'DRAFT',
    phrases: [
      {
        traduction: 'Au secours !',
        phrase: 'Kɔɔ ! Kɔɔ !',
        transcription: 'kô-ô ! kô-ô !',
        categorie: 'urgence',
        contexte: 'Crier pour appeler de l\'aide',
      },
      {
        traduction: 'J\'ai besoin d\'aide.',
        phrase: 'N ye gbɔ.',
        transcription: 'n yè gbô',
        categorie: 'urgence',
        contexte: 'Exprimer le besoin d\'assistance',
      },
      {
        traduction: 'Je suis malade.',
        phrase: 'N ɲɔ yi.',
        transcription: 'n ñô yi',
        categorie: 'sante',
        contexte: 'Indiquer un problème de santé',
      },
    ],
  },

  // ── AGNI — à valider par locuteurs natifs ─────────────────────────────────
  agni: {
    status: 'DRAFT',
    phrases: [
      {
        traduction: 'Au secours !',
        phrase: 'Boa mi ! Boa mi !',
        transcription: 'boa mi ! boa mi !',
        categorie: 'urgence',
        contexte: 'Crier pour appeler de l\'aide',
      },
      {
        traduction: 'J\'ai besoin d\'aide.',
        phrase: 'Mi hia boa.',
        transcription: 'mi hia boa',
        categorie: 'urgence',
        contexte: 'Exprimer le besoin d\'assistance',
      },
      {
        traduction: 'Je suis malade.',
        phrase: 'Mi yɛ yadɛ.',
        transcription: 'mi yè ya-dè',
        categorie: 'sante',
        contexte: 'Indiquer un problème de santé',
      },
    ],
  },

  // ── ATTIÉ — à valider par locuteurs natifs ────────────────────────────────
  attie: {
    status: 'DRAFT',
    phrases: [
      {
        traduction: 'Au secours !',
        phrase: 'Ɛ kɛ ! Ɛ kɛ !',
        transcription: 'è kè ! è kè !',
        categorie: 'urgence',
        contexte: 'Crier pour appeler de l\'aide',
      },
      {
        traduction: 'J\'ai besoin d\'aide.',
        phrase: 'N wla ɛ kɛ.',
        transcription: 'n oua-la è kè',
        categorie: 'urgence',
        contexte: 'Exprimer le besoin d\'assistance',
      },
      {
        traduction: 'Je suis malade.',
        phrase: 'N nyɔ.',
        transcription: 'n ñô',
        categorie: 'sante',
        contexte: 'Indiquer un problème de santé',
      },
    ],
  },

};

// ─────────────────────────────────────────────────────────────────────────────
// EXÉCUTION
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌍 Seed Phrases SOS — Langues Ivoire\n');

  // Charger toutes les langues actives
  const langues = await prisma.language.findMany({
    where: { isActive: true },
    select: { id: true, code: true, nom: true },
  });

  console.log(`📋 ${langues.length} langue(s) active(s) trouvée(s) :`);
  langues.forEach(l => console.log(`   • ${l.nom} (${l.code})`));
  console.log('');

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const langue of langues) {
    const data = PHRASES_PAR_LANGUE[langue.code];
    if (!data) {
      console.log(`⚠️  Pas de phrases prédéfinies pour "${langue.nom}" (${langue.code}) — ignoré`);
      continue;
    }

    console.log(`\n🗣️  ${langue.nom} (${langue.code}) — status: ${data.status}`);

    for (const p of data.phrases) {
      // Vérifier si la phrase existe déjà
      const existing = await prisma.usefulPhrase.findFirst({
        where: { languageId: langue.id, traduction: p.traduction },
      });

      if (existing) {
        console.log(`   ↩  Déjà existante : "${p.traduction}"`);
        totalSkipped++;
        continue;
      }

      await prisma.usefulPhrase.create({
        data: {
          languageId: langue.id,
          phrase: p.phrase,
          transcription: p.transcription || null,
          traduction: p.traduction,
          categorie: p.categorie,
          contexte: p.contexte || null,
          status: data.status,
        },
      });

      const icon = data.status === 'PUBLISHED' ? '✅' : '📝';
      console.log(`   ${icon} "${p.traduction}" → "${p.phrase}"`);
      totalCreated++;
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`✅ ${totalCreated} phrase(s) créée(s)`);
  console.log(`↩  ${totalSkipped} phrase(s) déjà existante(s) (ignorées)`);
  console.log(`\n⚠️  Les phrases en status DRAFT doivent être validées`);
  console.log(`   par des locuteurs natifs avant publication.`);
  console.log(`   Utilisez le CMS → Phrases SOS pour les modifier et publier.`);
}

main()
  .catch(e => { console.error('💥 Erreur :', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
