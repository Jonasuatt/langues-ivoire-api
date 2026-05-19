/**
 * seed-all-langues-ci.js
 *
 * Pre-seeds all Côte d'Ivoire languages with isActive: false.
 * The 9 existing languages (baoule, dioula, bete, senoufo, agni, gouro, guere, nouchi, yacouba)
 * are safely ignored via upsert with update: {} — they will NOT be modified.
 *
 * Usage:
 *   node prisma/seed-all-langues-ci.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const NEW_LANGUAGES = [
  // ─── Akan ───
  { code: 'abron',     nom: 'Abron',     famille: 'Akan',      region: 'Est (Bondoukou)',          locuteurs: 250000,  lat: 8.04, lng: -2.79, couleur: '#B5820D', emoji: '🏺',  description: 'Langue akan du peuple Abron dans la région du Zanzan, frontalière du Ghana.' },
  { code: 'adjoukrou', nom: 'Adjoukrou', famille: 'Akan',      region: 'Sud (Jacqueville)',        locuteurs: 50000,   lat: 5.37, lng: -4.87, couleur: '#A4700C', emoji: '🌊',  description: 'Langue lagounaire parlée sur la presqu\'île de Jacqueville et ses environs.' },
  { code: 'abidji',   nom: 'Abidji',    famille: 'Akan',      region: 'Sud (Sikensi)',            locuteurs: 40000,   lat: 5.67, lng: -4.57, couleur: '#936F12', emoji: '🌸',  description: 'Langue du peuple Abidji dans la région des Grands Ponts.' },
  { code: 'avikam',   nom: 'Avikam',    famille: 'Akan',      region: 'Sud (Grand Lahou)',        locuteurs: 20000,   lat: 5.18, lng: -5.01, couleur: '#826011', emoji: '🐚',  description: 'Langue lagounaire du peuple Avikam à Grand Lahou, sur la côte atlantique.' },
  { code: 'alladian', nom: 'Alladian',  famille: 'Akan',      region: 'Sud (Jacqueville)',        locuteurs: 10000,   lat: 5.30, lng: -4.82, couleur: '#715010', emoji: '🏖️', description: 'Langue lagounaire des pêcheurs Alladian du littoral ivoirien.' },
  { code: 'attie',    nom: 'Attié',     famille: 'Akan',      region: 'Sud (Anyama, Agboville)',  locuteurs: 500000,  lat: 5.56, lng: -4.21, couleur: '#D4A017', emoji: '🌱',  description: 'Langue akan du peuple Attié au sud d\'Abidjan, entre la ville et la forêt.' },
  { code: 'aboure',   nom: 'Abouré',    famille: 'Akan',      region: 'Sud-Est (Bonoua)',        locuteurs: 60000,   lat: 5.27, lng: -3.60, couleur: '#D4A017', emoji: '🌺',  description: 'Langue akan des Abouré dans la région du Sud-Comoé.' },
  { code: 'mbatto',   nom: "M'batto",   famille: 'Akan',      region: 'Sud (Tiassalé)',           locuteurs: 30000,   lat: 5.89, lng: -4.85, couleur: '#D4A017', emoji: '🌻',  description: "Langue akan du peuple M'batto dans la région de la Mé." },
  { code: 'vata',     nom: 'Vata',      famille: 'Akan',      region: 'Centre (Daoukro)',         locuteurs: 20000,   lat: 7.06, lng: -3.97, couleur: '#D4A017', emoji: '🪴',  description: 'Petite langue akan parlée à Daoukro dans le centre ivoirien.' },
  { code: 'krobou',   nom: 'Krobou',    famille: 'Akan',      region: 'Sud (Agboville)',          locuteurs: 15000,   lat: 5.50, lng: -4.20, couleur: '#D4A017', emoji: '🌾',  description: "Langue akan du peuple Krobou dans la région de l'Agnéby-Tiassa." },
  { code: 'nzima',    nom: 'Nzima',     famille: 'Akan',      region: 'Ouest (Sassandra)',        locuteurs: 30000,   lat: 4.95, lng: -6.08, couleur: '#D4A017', emoji: '🌿',  description: 'Langue akan du peuple Nzima dans le sud-ouest, proche de la frontière ghanéenne.' },
  { code: 'avagnan',  nom: 'Avagnan',   famille: 'Akan',      region: 'Sud (Grand Lahou)',        locuteurs: 10000,   lat: 5.10, lng: -5.10, couleur: '#D4A017', emoji: '🌊',  description: 'Petite langue lagounaire des Avagnan dans le Bas-Sassandra.' },
  // ─── Krou ───
  { code: 'dida',     nom: 'Dida',      famille: 'Krou',      region: 'Centre-Ouest (Lakota)',    locuteurs: 200000,  lat: 5.85, lng: -5.68, couleur: '#257328', emoji: '🌿',  description: 'Langue Krou du peuple Dida dans la région du Lôh-Djiboua.' },
  { code: 'godie',    nom: 'Godié',     famille: 'Krou',      region: 'Ouest (Sassandra)',        locuteurs: 50000,   lat: 4.95, lng: -6.08, couleur: '#1C681E', emoji: '🌴',  description: 'Langue Krou parlée par le peuple Godié sur la côte de Sassandra.' },
  { code: 'neyo',     nom: 'Neyo',      famille: 'Krou',      region: 'Ouest (Sassandra)',        locuteurs: 30000,   lat: 4.85, lng: -6.20, couleur: '#135D14', emoji: '🐠',  description: 'Langue Krou du peuple Neyo, pêcheurs du littoral de Sassandra.' },
  { code: 'wobe',     nom: 'Wobé',      famille: 'Krou',      region: 'Ouest (Toulepleu)',        locuteurs: 100000,  lat: 6.57, lng: -8.41, couleur: '#2E7D32', emoji: '🏔️', description: 'Langue Krou du peuple Wobé dans la région du Guémon.' },
  { code: 'kroumen',  nom: 'Kroumen',   famille: 'Krou',      region: 'Ouest (San Pédro)',        locuteurs: 60000,   lat: 4.75, lng: -6.64, couleur: '#2E7D32', emoji: '⚓',  description: 'Langue Krou du peuple Kroumen dans la région du San-Pédro.' },
  { code: 'bakwe',    nom: 'Bakwé',     famille: 'Krou',      region: 'Ouest (Soubré)',           locuteurs: 20000,   lat: 5.78, lng: -6.60, couleur: '#2E7D32', emoji: '🌲',  description: 'Langue Krou des Bakwé dans la région de la Nawa.' },
  { code: 'aizi',     nom: 'Aizi',      famille: 'Krou',      region: 'Sud (Jacqueville)',        locuteurs: 10000,   lat: 5.20, lng: -4.90, couleur: '#2E7D32', emoji: '🐚',  description: 'Petite langue Krou du peuple Aizi sur la côte lagunaire.' },
  { code: 'we',       nom: 'Wé',        famille: 'Krou',      region: 'Ouest (Guiglo)',           locuteurs: 250000,  lat: 6.54, lng: -7.20, couleur: '#2E7D32', emoji: '🌿',  description: "Groupe de langues Krou du peuple Wé dans l'ouest ivoirien." },
  { code: 'nyabwa',   nom: 'Nyabwa',    famille: 'Krou',      region: 'Ouest (Daloa)',            locuteurs: 20000,   lat: 6.89, lng: -6.45, couleur: '#2E7D32', emoji: '🌾',  description: 'Langue Krou du peuple Nyabwa dans la région du Haut-Sassandra.' },
  // ─── Gour / Voltaïque ───
  { code: 'tagbana',  nom: 'Tagbana',   famille: 'Gour',      region: 'Centre-Nord (Katiola)',    locuteurs: 100000,  lat: 8.13, lng: -5.10, couleur: '#D44C00', emoji: '🌵',  description: 'Dialecte Sénoufo du peuple Tagbana dans la région du Hambol.' },
  { code: 'djimini',  nom: 'Djimini',   famille: 'Gour',      region: 'Nord (Dabakala)',          locuteurs: 100000,  lat: 8.38, lng: -4.44, couleur: '#C34700', emoji: '🏜️', description: 'Dialecte Sénoufo du peuple Djimini dans la région du Hambol.' },
  { code: 'fodonon',  nom: 'Fodonon',   famille: 'Gour',      region: 'Nord (Korhogo)',           locuteurs: 50000,   lat: 9.30, lng: -5.70, couleur: '#B24200', emoji: '🌾',  description: 'Dialecte Sénoufo du peuple Fodonon dans la région du Poro.' },
  { code: 'koulango', nom: 'Koulango',  famille: 'Gour',      region: 'Nord-Est (Bouna)',         locuteurs: 80000,   lat: 9.27, lng: -3.00, couleur: '#A13D00', emoji: '🐘',  description: 'Langue gour du peuple Koulango dans la région du Bounkani.' },
  { code: 'lobi',     nom: 'Lobi',      famille: 'Gour',      region: 'Nord-Est (Bouna)',         locuteurs: 60000,   lat: 9.10, lng: -3.20, couleur: '#903800', emoji: '🦓',  description: 'Langue gour du peuple Lobi dans la région du Bounkani, frontalière du Burkina Faso.' },
  { code: 'mahou',    nom: 'Mahou',     famille: 'Gour',      region: 'Nord-Ouest (Odienné)',     locuteurs: 30000,   lat: 9.51, lng: -7.57, couleur: '#E65100', emoji: '🌄',  description: 'Langue gour du peuple Mahou dans la région du Kabadougou.' },
  { code: 'niarafolo',nom: 'Niarafolo', famille: 'Gour',      region: 'Nord-Est (Kong)',          locuteurs: 30000,   lat: 8.50, lng: -4.80, couleur: '#E65100', emoji: '🌞',  description: 'Dialecte Sénoufo du peuple Niarafolo près de Kong.' },
  // ─── Mandé Nord ───
  { code: 'bambara',  nom: 'Bambara',   famille: 'Mandé Nord',region: 'Nord (Odienné)',           locuteurs: 100000,  lat: 9.50, lng: -7.50, couleur: '#1254A8', emoji: '🎺',  description: 'Langue mandé apparentée au dioula, parlée dans le nord ivoirien.' },
  { code: 'malinke',  nom: 'Malinké',   famille: 'Mandé Nord',region: 'Nord-Ouest (Odienné)',     locuteurs: 200000,  lat: 9.00, lng: -7.00, couleur: '#0F4390', emoji: '🦁',  description: 'Langue mandé du peuple Malinké dans la région du Kabadougou.' },
  { code: 'soninke',  nom: 'Soninke',   famille: 'Mandé Nord',region: 'Nord (Odienné)',           locuteurs: 30000,   lat: 9.50, lng: -7.20, couleur: '#0C3278', emoji: '🏛️', description: 'Langue mandé du peuple Soninke dans le nord-ouest ivoirien.' },
  { code: 'koro',     nom: 'Koro',      famille: 'Mandé Nord',region: 'Nord (Odienné)',           locuteurs: 20000,   lat: 9.30, lng: -7.20, couleur: '#1565C0', emoji: '🌙',  description: 'Petite langue mandé du peuple Koro dans la région du Kabadougou.' },
  // ─── Mandé Sud ───
  { code: 'mano',     nom: 'Mano',      famille: 'Mandé Sud', region: 'Ouest (Danané)',           locuteurs: 50000,   lat: 7.00, lng: -7.80, couleur: '#52157A', emoji: '🌿',  description: 'Langue mandé du peuple Mano dans la région du Cavally.' },
  { code: 'tura',     nom: 'Tura',      famille: 'Mandé Sud', region: 'Ouest (Man)',              locuteurs: 20000,   lat: 7.40, lng: -7.70, couleur: '#46126A', emoji: '⛰️', description: "Langue mandé du peuple Tura dans les montagnes de l'ouest." },
  { code: 'gagou',    nom: 'Gagou',     famille: 'Mandé Sud', region: 'Centre (Gagnoa)',          locuteurs: 30000,   lat: 6.10, lng: -5.90, couleur: '#6A1B9A', emoji: '🌱',  description: 'Langue mandé du peuple Gagou (Gagu) dans la région du Gôh.' },
  { code: 'mwan',     nom: 'Mwan',      famille: 'Mandé Sud', region: 'Ouest (Bouaflé)',          locuteurs: 20000,   lat: 7.00, lng: -7.00, couleur: '#6A1B9A', emoji: '🌾',  description: 'Langue mandé du peuple Mwan dans la région de la Marahoué.' },
  { code: 'gban',     nom: 'Gban',      famille: 'Mandé Sud', region: 'Ouest (Vavoua)',           locuteurs: 15000,   lat: 7.20, lng: -7.10, couleur: '#6A1B9A', emoji: '🌲',  description: 'Petite langue mandé du peuple Gban dans le centre-ouest ivoirien.' },
  { code: 'beng',     nom: 'Beng',      famille: 'Mandé Sud', region: 'Centre (Bouaké)',          locuteurs: 15000,   lat: 7.20, lng: -5.60, couleur: '#6A1B9A', emoji: '🌻',  description: 'Petite langue mandé du peuple Beng (Ngen) près de Bouaké.' },
  { code: 'wan',      nom: 'Wan',       famille: 'Mandé Sud', region: 'Ouest (Séguela)',          locuteurs: 20000,   lat: 7.96, lng: -6.67, couleur: '#6A1B9A', emoji: '🌿',  description: 'Langue mandé du peuple Wan dans la région du Bafing.' },
  // ─── Véhiculaire ───
  { code: 'francais-ivoirien', nom: 'Français ivoirien', famille: 'Véhiculaire', region: 'Nationale', locuteurs: null, lat: 7.00, lng: -5.50, couleur: '#B71C1C', emoji: '🇨🇮', description: "Variante ivoirienne du français, lingua franca nationale avec des particularités lexicales propres à la Côte d'Ivoire." },
];

async function main() {
  console.log('🌍 Seed des langues de Côte d\'Ivoire (activation en un clic)…\n');

  let created = 0;
  let skipped = 0;

  for (const lang of NEW_LANGUAGES) {
    const result = await prisma.language.upsert({
      where: { code: lang.code },
      update: {}, // Ne jamais toucher les langues existantes
      create: {
        ...lang,
        isActive: false,
        isInMvp: false,
        ordreAffichage: 100,
      },
    });

    // Prisma upsert ne renvoie pas si c'était un create ou update,
    // on détecte via la comparaison de createdAt ≈ updatedAt
    const wasCreated = result.createdAt && result.updatedAt &&
      Math.abs(result.createdAt - result.updatedAt) < 1000;

    if (wasCreated) {
      console.log(`  ✅ Créée : ${lang.nom} (${lang.code}) — ${lang.famille}`);
      created++;
    } else {
      console.log(`  ⏭️  Ignorée (déjà en DB) : ${lang.nom} (${lang.code})`);
      skipped++;
    }
  }

  console.log('\n─────────────────────────────────────────');
  console.log(`✅ Résumé du seed :`);
  console.log(`   • ${created} langues créées (isActive: false)`);
  console.log(`   • ${skipped} langues ignorées (déjà existantes, non modifiées)`);
  console.log(`   • ${NEW_LANGUAGES.length} langues traitées au total`);
  console.log('─────────────────────────────────────────');
  console.log('\n💡 Pour activer une langue : cliquez "Activer" dans le CMS → onglet "Catalogue CI"');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
