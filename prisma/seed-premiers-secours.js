/**
 * Seed des phrases de premiers secours pour les 9 langues MVP
 * Situations : etouffement, arret_cardiaque, fracture, brulure,
 *              mise_en_securite, appel_secours, noyade, saignement,
 *              malaise, evaluation
 * isActive: true par défaut — visible immédiatement dans l'app
 * Sécurisé : ne crée pas de doublons (situation + languageId)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Situations avec leur priorité (2=vital, 1=important, 0=info)
const SITUATIONS_META = {
  evaluation:        { priorite: 1, label: 'Évaluation' },
  appel_secours:     { priorite: 2, label: 'Appel des secours' },
  arret_cardiaque:   { priorite: 2, label: 'Arrêt cardiaque' },
  etouffement:       { priorite: 2, label: 'Étouffement' },
  noyade:            { priorite: 2, label: 'Noyade' },
  saignement:        { priorite: 2, label: 'Saignement' },
  malaise:           { priorite: 1, label: 'Malaise' },
  fracture:          { priorite: 1, label: 'Fracture' },
  brulure:           { priorite: 1, label: 'Brûlure' },
  mise_en_securite:  { priorite: 1, label: 'Mise en sécurité' },
};

// ─── Données par langue ──────────────────────────────────────────────────────

const PREMIERS_SECOURS = {

  // ╔══════════════════════════════╗
  // ║  DIOULA  (langue véhiculaire ║
  // ║  — traductions les + usées)  ║
  // ╚══════════════════════════════╝
  dioula: [
    { situation: 'evaluation',       consigne: 'I ye kɛnɛ wa ? I flɛ n ma !', traduction: 'Tu vas bien ? Regarde-moi !', transcription: 'i-yé-kè-nè-wa-i-fleh-n-ma' },
    { situation: 'appel_secours',    consigne: 'Dɔgɔtɔrɔ wele ! Halipuliisi wele !', traduction: 'Appelle un médecin ! Appelez la police !', transcription: 'do-go-to-ro-wé-lé-ha-li-pu-li-si-wé-lé' },
    { situation: 'arret_cardiaque',  consigne: 'O ma sɔnɔ ! N bɛ a dɛmɛ ka kɔrɔ bɔ !', traduction: 'Il ne respire plus ! Je vais faire le massage cardiaque !', transcription: 'o-ma-sɔ-nɔ-n-bè-a-dè-mè-ka-kɔ-rɔ-bɔ' },
    { situation: 'etouffement',      consigne: 'I bɛ kumakan kɛ wa ? N bɛ i ɲini fɔrɔ kɔnɔ !', traduction: 'Tu peux parler ? Je vais appuyer sur ton ventre !', transcription: 'i-bè-ku-ma-kan-kè-wa' },
    { situation: 'noyade',           consigne: 'A bɔ ji la ! A ma sɔnɔ !', traduction: 'Sors-le de l\'eau ! Il ne respire plus !', transcription: 'a-bɔ-ji-la-a-ma-sɔ-nɔ' },
    { situation: 'saignement',       consigne: 'Juru na a kan ! Dɔn a kan kosɔbɛ !', traduction: 'Serre fort ! Appuie dessus fortement !', transcription: 'ju-ru-na-a-kan-dɔn-a-kan-ko-sɔ-bè' },
    { situation: 'malaise',          consigne: 'Sigi ! I kɔ bila ɲɛ ma ! I suma bɛ se wa ?', traduction: 'Assieds-toi ! Allonge-toi ! Tu peux respirer ?', transcription: 'si-gi-i-kɔ-bi-la-nyè-ma' },
    { situation: 'fracture',         consigne: 'Kana jɔ ! A bolila ! N bɛ a sɔrɔfɛ !', traduction: 'Ne bouge pas ! C\'est cassé ! Je vais l\'immobiliser !', transcription: 'ka-na-jɔ-a-bo-li-la' },
    { situation: 'brulure',          consigne: 'Joli ji fara a kan ! Kana fenw dɔn a kan !', traduction: 'Verse de l\'eau froide dessus ! Ne mets rien dessus !', transcription: 'jo-li-ji-fa-ra-a-kan' },
    { situation: 'mise_en_securite', consigne: 'Bɔ yan ! Taa dɔ wɛrɛ la !', traduction: 'Quitte cet endroit ! Va ailleurs !', transcription: 'bɔ-yan-taa-dɔ-wè-rè-la' },
  ],

  // ╔══════════════════════════════╗
  // ║  BAOULÉ                      ║
  // ╚══════════════════════════════╝
  baoule: [
    { situation: 'evaluation',       consigne: 'Wié i kié ? N flɛ !', traduction: 'Comment tu vas ? Regarde-moi !', transcription: 'wié-i-kié-n-fleh' },
    { situation: 'appel_secours',    consigne: 'Kpofue wɛ ! Sran wɛ !', traduction: 'Appelle un médecin ! Appelle quelqu\'un !', transcription: 'kpo-fwé-weh-sran-weh' },
    { situation: 'arret_cardiaque',  consigne: 'O sɔnɔ sua ! N bɛ bo kpan !', traduction: 'Il ne respire plus ! Je vais appuyer sur sa poitrine !', transcription: 'o-sɔ-nɔ-sua-n-beh-bo-kpan' },
    { situation: 'etouffement',      consigne: 'I klɔ bo ? N bɛ i kpan lɛ !', traduction: 'Tu peux parler ? Je vais appuyer dans ton dos !', transcription: 'i-klɔ-bo-n-beh-i-kpan-leh' },
    { situation: 'noyade',           consigne: 'Blo o mian su ! O sɔnɔ sua !', traduction: 'Sors-le de l\'eau ! Il ne respire plus !', transcription: 'blo-o-mian-su' },
    { situation: 'saignement',       consigne: 'Tɛtɛ kpan ! Kpan tra !', traduction: 'Serre fort ! Appuie !', transcription: 'teh-teh-kpan-kpan-tra' },
    { situation: 'malaise',          consigne: 'Guiɛ ! Fɔ su tra ! I sɔnɔ kié ?', traduction: 'Assieds-toi ! Allonge-toi ! Tu peux respirer ?', transcription: 'guieh-fɔ-su-tra' },
    { situation: 'fracture',         consigne: 'Kana fla ! Kpan tra !', traduction: 'Ne bouge pas ! Je vais l\'immobiliser !', transcription: 'ka-na-fla-kpan-tra' },
    { situation: 'brulure',          consigne: 'Mian ɔ su ! Kana wɛ ngue !', traduction: 'Verse de l\'eau dessus ! Ne mets rien dessus !', transcription: 'mian-ɔ-su-ka-na-weh-ngueh' },
    { situation: 'mise_en_securite', consigne: 'Bo yan ! Kɔ sɛ !', traduction: 'Pars d\'ici ! Va plus loin !', transcription: 'bo-yan-kɔ-seh' },
  ],

  // ╔══════════════════════════════╗
  // ║  AGNI                        ║
  // ╚══════════════════════════════╝
  agni: [
    { situation: 'evaluation',       consigne: 'Mɔrɔ wa ? N hu !', traduction: 'Comment tu vas ? Regarde-moi !', transcription: 'mɔ-rɔ-wa-n-hu' },
    { situation: 'appel_secours',    consigne: 'Dɔktɛ frɛ ! Ɔsrɛ !', traduction: 'Appelle un médecin ! Au secours !', transcription: 'dɔk-teh-freh-ɔ-sreh' },
    { situation: 'arret_cardiaque',  consigne: 'O mma hunu ! N bɛ bo a kpan !', traduction: 'Il ne respire plus ! Je vais masser sa poitrine !', transcription: 'o-mma-hu-nu' },
    { situation: 'etouffement',      consigne: 'I bɛ kasa wa ? N bɛ i boa !', traduction: 'Tu peux parler ? Je vais t\'aider !', transcription: 'i-bè-ka-sa-wa' },
    { situation: 'noyade',           consigne: 'Blo o nsuo su ! O mma hunu !', traduction: 'Sors-le de l\'eau ! Il ne respire plus !', transcription: 'blo-o-nsuo-su' },
    { situation: 'saignement',       consigne: 'Tɛ kpan ! Dɔn kpan !', traduction: 'Serre fort ! Appuie fort !', transcription: 'teh-kpan-dɔn-kpan' },
    { situation: 'malaise',          consigne: 'Tena ! Fa da fɔ su !', traduction: 'Assieds-toi ! Allonge-toi !', transcription: 'te-na-fa-da-fɔ-su' },
    { situation: 'fracture',         consigne: 'Kana sisi ! A bolila !', traduction: 'Ne bouge pas ! C\'est cassé !', transcription: 'ka-na-si-si-a-bo-li-la' },
    { situation: 'brulure',          consigne: 'Nsuo ɔ su ! Kana wɛ ngue !', traduction: 'Verse de l\'eau dessus ! Ne mets rien !', transcription: 'nsuo-ɔ-su' },
    { situation: 'mise_en_securite', consigne: 'Bo yan ! Taa sɛ !', traduction: 'Pars ! Va plus loin !', transcription: 'bo-yan-taa-seh' },
  ],

  // ╔══════════════════════════════╗
  // ║  BÉTÉ                        ║
  // ╚══════════════════════════════╝
  bete: [
    { situation: 'evaluation',       consigne: 'I kôh ? M\'flɛ !', traduction: 'Comment tu vas ? Regarde-moi !', transcription: 'i-koh-m-fleh' },
    { situation: 'appel_secours',    consigne: 'Bi wɔ ! Dɔktɛ wɛ !', traduction: 'Au secours ! Appelle un médecin !', transcription: 'bi-wɔ-dɔk-teh-weh' },
    { situation: 'arret_cardiaque',  consigne: 'O bé sɔnɔ wɛ ! N bɛ bo kpan !', traduction: 'Il ne respire plus ! Je vais masser !', transcription: 'o-bé-sɔ-nɔ-weh' },
    { situation: 'etouffement',      consigne: 'I kasa wa ? N bɛ i kpan !', traduction: 'Tu peux parler ? Je vais appuyer !', transcription: 'i-ka-sa-wa' },
    { situation: 'noyade',           consigne: 'Blo o tio su ! O sɔnɔ wɛ !', traduction: 'Sors-le de l\'eau ! Il ne respire plus !', transcription: 'blo-o-tio-su' },
    { situation: 'saignement',       consigne: 'Dɔn kpan ! Kpan !', traduction: 'Appuie fort ! Serre !', transcription: 'dɔn-kpan-kpan' },
    { situation: 'malaise',          consigne: 'Guiɛ ! Fɔ sua !', traduction: 'Assieds-toi ! Allonge-toi !', transcription: 'guieh-fɔ-sua' },
    { situation: 'fracture',         consigne: 'Kana fla ! A dolo !', traduction: 'Ne bouge pas ! C\'est cassé !', transcription: 'ka-na-fla-a-do-lo' },
    { situation: 'brulure',          consigne: 'Tio ɔ su ! Kana wɛ ngue !', traduction: 'Mets de l\'eau dessus ! Ne mets rien !', transcription: 'tio-ɔ-su' },
    { situation: 'mise_en_securite', consigne: 'Bo dɔ ! Taa sɛ !', traduction: 'Quitte cet endroit ! Va loin !', transcription: 'bo-dɔ-taa-seh' },
  ],

  // ╔══════════════════════════════╗
  // ║  SÉNOUFO                     ║
  // ╚══════════════════════════════╝
  senoufo: [
    { situation: 'evaluation',       consigne: 'I tara ? N flɛ !', traduction: 'Tu vas bien ? Regarde-moi !', transcription: 'i-ta-ra-n-fleh' },
    { situation: 'appel_secours',    consigne: 'Dɛmɛ ! Dɔktɛ we !', traduction: 'Au secours ! Appelle un médecin !', transcription: 'dè-mè-dɔk-teh-we' },
    { situation: 'arret_cardiaque',  consigne: 'O sɔnɔ faa ! N bɛ bo kpan !', traduction: 'Il ne respire plus ! Je masse !', transcription: 'o-sɔ-nɔ-faa' },
    { situation: 'etouffement',      consigne: 'I kasa bɛ ? N bɛ i fɔrɔ kpan !', traduction: 'Tu peux parler ? Je vais appuyer !', transcription: 'i-ka-sa-beh' },
    { situation: 'noyade',           consigne: 'A bɔ ji la ! A sɔnɔ faa !', traduction: 'Sors-le de l\'eau ! Il ne respire plus !', transcription: 'a-bɔ-ji-la' },
    { situation: 'saignement',       consigne: 'Kpan kpan ! Juru na !', traduction: 'Appuie fort ! Serre !', transcription: 'kpan-kpan-ju-ru-na' },
    { situation: 'malaise',          consigne: 'Sigi ! Da fɔ sua !', traduction: 'Assieds-toi ! Allonge-toi !', transcription: 'si-gi-da-fɔ-sua' },
    { situation: 'fracture',         consigne: 'Kana jɔ ! A bolila !', traduction: 'Ne bouge pas ! C\'est cassé !', transcription: 'ka-na-jɔ-a-bo-li-la' },
    { situation: 'brulure',          consigne: 'Ji ɔ su ! Kana fara a kan !', traduction: 'Mets de l\'eau ! Ne touche pas !', transcription: 'ji-ɔ-su' },
    { situation: 'mise_en_securite', consigne: 'Bo yan ! Taa wɛrɛ !', traduction: 'Pars ! Va ailleurs !', transcription: 'bo-yan-taa-wè-rè' },
  ],

  // ╔══════════════════════════════╗
  // ║  GOURO                       ║
  // ╚══════════════════════════════╝
  gouro: [
    { situation: 'evaluation',       consigne: 'I yi nɔ ? N flɛ !', traduction: 'Tu vas bien ? Regarde-moi !', transcription: 'i-yi-nɔ-n-fleh' },
    { situation: 'appel_secours',    consigne: "N'kpli ! Dɔktɛ wɛ !", traduction: 'Au secours ! Appelle un médecin !', transcription: 'n-kpli-dɔk-teh-weh' },
    { situation: 'arret_cardiaque',  consigne: 'O sɔnɔ sua ! N bɛ bo kpan !', traduction: 'Il ne respire plus ! Je masse sa poitrine !', transcription: 'o-sɔ-nɔ-sua' },
    { situation: 'etouffement',      consigne: 'I kli bɛ ? N bɛ i kpan !', traduction: 'Tu peux parler ? Je vais appuyer !', transcription: 'i-kli-beh' },
    { situation: 'noyade',           consigne: 'Blo o nyi su ! O sɔnɔ sua !', traduction: 'Sors-le de l\'eau ! Il ne respire plus !', transcription: 'blo-o-nyi-su' },
    { situation: 'saignement',       consigne: 'Kpan ! Kpan kpan !', traduction: 'Appuie ! Appuie fort !', transcription: 'kpan-kpan-kpan' },
    { situation: 'malaise',          consigne: 'Guiɛ ! Fɔ sua !', traduction: 'Assieds-toi ! Allonge-toi !', transcription: 'guieh-fɔ-sua' },
    { situation: 'fracture',         consigne: 'Kana jɔ ! A bolila !', traduction: 'Ne bouge pas ! C\'est cassé !', transcription: 'ka-na-jɔ' },
    { situation: 'brulure',          consigne: 'Nyi ɔ su ! Kana fara !', traduction: 'Mets de l\'eau ! Ne touche pas !', transcription: 'nyi-ɔ-su' },
    { situation: 'mise_en_securite', consigne: 'Bo yan ! Taa sɛ !', traduction: 'Pars ! Va plus loin !', transcription: 'bo-yan-taa-seh' },
  ],

  // ╔══════════════════════════════╗
  // ║  GUÉRÉ                       ║
  // ╚══════════════════════════════╝
  guere: [
    { situation: 'evaluation',       consigne: 'I pɔ ? N flɛ !', traduction: 'Tu vas bien ? Regarde-moi !', transcription: 'i-pɔ-n-fleh' },
    { situation: 'appel_secours',    consigne: 'Dɛmɛ ! Dɔktɛ wɛ !', traduction: 'Au secours ! Appelle un médecin !', transcription: 'dè-mè-dɔk-teh-weh' },
    { situation: 'arret_cardiaque',  consigne: 'O sɔnɔ faa ! N bɛ bo kpan !', traduction: 'Il ne respire plus ! Je masse !', transcription: 'o-sɔ-nɔ-faa' },
    { situation: 'etouffement',      consigne: 'I kli wa ? N kpan i !', traduction: 'Tu peux parler ? Je vais appuyer !', transcription: 'i-kli-wa' },
    { situation: 'noyade',           consigne: 'Blo o yi su ! O sɔnɔ faa !', traduction: 'Sors-le de l\'eau ! Il ne respire plus !', transcription: 'blo-o-yi-su' },
    { situation: 'saignement',       consigne: 'Kpan ! Juru kpan !', traduction: 'Appuie ! Serre fort !', transcription: 'kpan-ju-ru-kpan' },
    { situation: 'malaise',          consigne: 'Guiɛ ! Da su !', traduction: 'Assieds-toi ! Allonge-toi !', transcription: 'guieh-da-su' },
    { situation: 'fracture',         consigne: 'Kana jɔ ! A gblo !', traduction: 'Ne bouge pas ! C\'est cassé !', transcription: 'ka-na-jɔ-a-gblo' },
    { situation: 'brulure',          consigne: 'Yi ɔ su ! Kana wɛ !', traduction: 'Mets de l\'eau ! Ne touche pas !', transcription: 'yi-ɔ-su' },
    { situation: 'mise_en_securite', consigne: 'Bo yan ! Taa wɛrɛ !', traduction: 'Pars ! Va ailleurs !', transcription: 'bo-yan-taa-wè-rè' },
  ],

  // ╔══════════════════════════════╗
  // ║  NOUCHI                      ║
  // ╚══════════════════════════════╝
  nouchi: [
    { situation: 'evaluation',       consigne: 'Frérot, tu djo ? Regarde-moi !', traduction: 'Mon ami, tu vas bien ? Regarde-moi !', transcription: 'fré-rot-tu-djo' },
    { situation: 'appel_secours',    consigne: 'Dieu-là ! Au secours ! Amène le doc vite !', traduction: 'Mon Dieu ! Au secours ! Amène le médecin vite !', transcription: 'dieu-là-se-cour' },
    { situation: 'arret_cardiaque',  consigne: 'Il respire plus ! Je pompe sa poitrine !', traduction: 'Il ne respire plus ! Je vais faire le massage cardiaque !', transcription: 'il-res-pire-plus' },
    { situation: 'etouffement',      consigne: 'Tu peux causer ? Je presse ton ventre !', traduction: 'Tu peux parler ? Je vais appuyer sur ton ventre !', transcription: 'tu-peux-cau-ser' },
    { situation: 'noyade',           consigne: 'Sors-le de là ! Il respire plus man !', traduction: 'Sors-le de l\'eau ! Il ne respire plus !', transcription: 'sors-le-de-là' },
    { situation: 'saignement',       consigne: 'Appuie fort là ! Serre kpan !', traduction: 'Appuie très fort ! Serre bien !', transcription: 'ap-puie-fort-là-ser-re-kpan' },
    { situation: 'malaise',          consigne: 'Assieds-toi là ! Couche-toi !', traduction: 'Assieds-toi ! Allonge-toi !', transcription: 'as-sieds-toi-là' },
    { situation: 'fracture',         consigne: 'Bouge pas ! Ça a pété !', traduction: 'Ne bouge pas ! C\'est cassé !', transcription: 'bou-ge-pas-ça-a-pé-té' },
    { situation: 'brulure',          consigne: 'Verse de l\'eau froide ! Touche pas !', traduction: 'Verse de l\'eau froide ! Ne touche pas !', transcription: 'ver-se-eau-froide' },
    { situation: 'mise_en_securite', consigne: 'Dégagez là ! Partez loin !', traduction: 'Quittez cet endroit ! Partez loin !', transcription: 'dé-ga-gez-là' },
  ],

  // ╔══════════════════════════════╗
  // ║  YACOUBA (DAN)               ║
  // ╚══════════════════════════════╝
  yacouba: [
    { situation: 'evaluation',       consigne: 'Zo kié ? N flɛ !', traduction: 'Tu vas bien ? Regarde-moi !', transcription: 'zo-kié-n-fleh' },
    { situation: 'appel_secours',    consigne: 'Dɛmɛ ! Dɔktɛ wɛ !', traduction: 'Au secours ! Appelle un médecin !', transcription: 'dè-mè-dɔk-teh-weh' },
    { situation: 'arret_cardiaque',  consigne: 'O sɔnɔ faa ! N bɛ bo kpan !', traduction: 'Il ne respire plus ! Je masse !', transcription: 'o-sɔ-nɔ-faa' },
    { situation: 'etouffement',      consigne: 'I kasa wa ? N bɛ i kpan !', traduction: 'Tu peux parler ? Je vais appuyer !', transcription: 'i-ka-sa-wa' },
    { situation: 'noyade',           consigne: 'Blo o yi su ! O sɔnɔ faa !', traduction: 'Sors-le de l\'eau ! Il ne respire plus !', transcription: 'blo-o-yi-su' },
    { situation: 'saignement',       consigne: 'Kpan kpan ! Juru na !', traduction: 'Appuie fort ! Serre !', transcription: 'kpan-kpan-ju-ru-na' },
    { situation: 'malaise',          consigne: 'Sigi ! Da sua !', traduction: 'Assieds-toi ! Allonge-toi !', transcription: 'si-gi-da-sua' },
    { situation: 'fracture',         consigne: 'Kana jɔ ! A bolila !', traduction: 'Ne bouge pas ! C\'est cassé !', transcription: 'ka-na-jɔ' },
    { situation: 'brulure',          consigne: 'Yi ɔ su ! Kana fara !', traduction: 'Mets de l\'eau ! Ne touche pas !', transcription: 'yi-ɔ-su' },
    { situation: 'mise_en_securite', consigne: 'Bo yan ! Taa sɛɛ !', traduction: 'Pars ! Va plus loin !', transcription: 'bo-yan-taa-sèè' },
  ],
};

// ─── Seed principal ──────────────────────────────────────────────────────────

async function main() {
  console.log('🏥 Seed des phrases de premiers secours pour les 9 langues MVP...\n');

  let created = 0;
  let skipped = 0;

  for (const [code, phrases] of Object.entries(PREMIERS_SECOURS)) {
    const lang = await prisma.language.findUnique({ where: { code } });
    if (!lang) {
      console.log(`  ⚠️  Langue introuvable : ${code}`);
      continue;
    }

    console.log(`  🏥 ${lang.nom} (${phrases.length} situations)...`);

    for (const p of phrases) {
      // Éviter les doublons
      const existing = await prisma.premierSecoursPhrase.findFirst({
        where: { languageId: lang.id, situation: p.situation },
      });

      if (existing) {
        skipped++;
        continue;
      }

      const meta = SITUATIONS_META[p.situation] || { priorite: 0 };

      await prisma.premierSecoursPhrase.create({
        data: {
          languageId:   lang.id,
          situation:    p.situation,
          consigne:     p.consigne,
          traduction:   p.traduction,
          transcription: p.transcription || null,
          priorite:     meta.priorite,
          isActive:     true,
        },
      });
      created++;
    }

    console.log(`     ✅ ${lang.nom} — phrases premiers secours configurées`);
  }

  console.log('\n─────────────────────────────────────────────────────────');
  console.log('✅ Résumé premiers secours :');
  console.log(`   • ${created} phrases créées`);
  console.log(`   • ${skipped} phrases déjà existantes (non modifiées)`);
  console.log('─────────────────────────────────────────────────────────');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
