/**
 * seed-galleries.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Peuple la table image_galleries à partir des données existantes :
 *
 *   SOURCE 1 — Dictionnaire
 *     Parcourt toutes les dictionaryEntry ayant une imageUrl.
 *     Crée une galerie par (langue × catégorie).
 *     Ex : "Baoulé — Animaux", "Dioula — Nourriture"
 *
 *   SOURCE 2 — Musée des Trésors
 *     Parcourt tous les culturalItem de type TRESOR ayant une imageUrl.
 *     Crée une galerie "Musée des Trésors — [Langue]" par langue.
 *
 * Usage :
 *   node scripts/seed-galleries.js
 *   node scripts/seed-galleries.js --dry-run     (simulation sans écriture)
 *   node scripts/seed-galleries.js --reset       (supprime d'abord les galeries auto)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DRY_RUN = process.argv.includes('--dry-run');
const RESET   = process.argv.includes('--reset');

// Libellés FR des catégories dictionnaire
const CAT_LABELS = {
  salutations:    'Salutations',
  famille:        'Famille',
  nourriture:     'Nourriture',
  nature:         'Nature',
  habitat:        'Habitat',
  transport:      'Transport',
  vie_quotidienne:'Vie quotidienne',
  expressions:    'Expressions',
  verbes:         'Verbes',
  spiritualite:   'Spiritualité',
  vie_sociale:    'Vie sociale',
  chiffres:       'Chiffres',
  couleurs:       'Couleurs',
  corps:          'Corps humain',
  animaux:        'Animaux',
  marche:         'Marché',
  commerce:       'Commerce',
  temps:          'Temps',
};

const catLabel = (cat) => CAT_LABELS[cat] || (cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Divers');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(msg)  { console.log(`  ${msg}`); }
function info(msg) { console.log(`\n📌 ${msg}`); }
function ok(msg)   { console.log(`  ✅ ${msg}`); }
function skip(msg) { console.log(`  ⏭️  ${msg}`); }

async function createGallery({ languageId, rubrique, titre, description, coverUrl, ordre, status }) {
  if (DRY_RUN) {
    log(`[DRY] Galerie : "${titre}" (rubrique: ${rubrique})`);
    return { id: 'dry-run-id' };
  }
  return prisma.imageGallery.create({
    data: { languageId, rubrique, titre, description, coverUrl, ordre, status },
  });
}

async function createImage({ galleryId, imageUrl, legende, transcription, traduction, ordre }) {
  if (DRY_RUN) {
    log(`       [DRY] Image : ${legende || imageUrl.split('/').pop()}`);
    return;
  }
  await prisma.galleryImage.create({
    data: { galleryId, imageUrl, legende, transcription, traduction, ordre },
  });
}

// ─── SOURCE 1 : Dictionnaire ──────────────────────────────────────────────────

async function seedFromDictionary() {
  info('SOURCE 1 — Dictionnaire (entrées avec imageUrl)');

  const entries = await prisma.dictionaryEntry.findMany({
    where: { imageUrl: { not: '' }, status: 'PUBLISHED' },
    include: { language: { select: { id: true, nom: true, code: true } } },
    orderBy: [{ languageId: 'asc' }, { categorie: 'asc' }, { mot: 'asc' }],
  });

  log(`${entries.length} entrées avec image trouvées.`);
  if (!entries.length) { skip('Aucune entrée avec image dans le dictionnaire.'); return; }

  // Grouper par (languageId, categorie)
  const groups = {};
  for (const e of entries) {
    const langId  = e.languageId || '__universal__';
    const cat     = e.categorie  || 'divers';
    const key     = `${langId}::${cat}`;
    if (!groups[key]) groups[key] = { lang: e.language, cat, entries: [] };
    groups[key].entries.push(e);
  }

  log(`${Object.keys(groups).length} galeries à créer (1 par langue × catégorie).`);

  let galCount = 0, imgCount = 0;

  for (const [, group] of Object.entries(groups)) {
    const langNom = group.lang?.nom || 'Toutes langues';
    const titre   = `${langNom} — ${catLabel(group.cat)}`;

    // Éviter les doublons si déjà importé
    const existing = await prisma.imageGallery.findFirst({
      where: { titre, rubrique: 'dictionnaire' },
    });
    if (existing) { skip(`"${titre}" existe déjà (id ${existing.id})`); continue; }

    // Cover = première image du groupe
    const coverUrl = group.entries[0]?.imageUrl || null;

    const gallery = await createGallery({
      languageId:  group.lang?.id || null,
      rubrique:    'dictionnaire',
      titre,
      description: `Images du vocabulaire ${langNom} — catégorie ${catLabel(group.cat)}`,
      coverUrl,
      ordre:       galCount,
      status:      'PUBLISHED',
    });

    galCount++;

    for (let i = 0; i < group.entries.length; i++) {
      const e = group.entries[i];
      await createImage({
        galleryId:    gallery.id,
        imageUrl:     e.imageUrl,
        legende:      e.mot || e.phrase || '',
        transcription: e.transcription || null,
        traduction:   e.traduction || null,
        ordre:        i + 1,
      });
      imgCount++;
    }

    ok(`"${titre}" — ${group.entries.length} image(s)`);
  }

  log(`\n→ ${galCount} galerie(s) créée(s), ${imgCount} image(s) ajoutée(s) depuis le dictionnaire.`);
}

// ─── SOURCE 2 : Musée des Trésors ─────────────────────────────────────────────

async function seedFromMusee() {
  info('SOURCE 2 — Musée des Trésors (culturalItem type=TRESOR avec imageUrl)');

  const tresors = await prisma.culturalItem.findMany({
    where: { type: 'TRESOR', imageUrl: { not: '' }, isActive: true },
    include: { language: { select: { id: true, nom: true, code: true } } },
    orderBy: [{ languageId: 'asc' }, { datePublication: 'desc' }],
  });

  log(`${tresors.length} trésors avec image trouvés.`);
  if (!tresors.length) { skip('Aucun trésor avec image.'); return; }

  // Grouper par languageId
  const groups = {};
  for (const t of tresors) {
    const langId = t.languageId || '__universal__';
    if (!groups[langId]) groups[langId] = { lang: t.language, items: [] };
    groups[langId].items.push(t);
  }

  log(`${Object.keys(groups).length} galerie(s) Musée à créer.`);

  let galCount = 0, imgCount = 0;

  for (const [, group] of Object.entries(groups)) {
    const langNom = group.lang?.nom || 'Universel';
    const titre   = `Musée des Trésors — ${langNom}`;

    const existing = await prisma.imageGallery.findFirst({
      where: { titre, rubrique: 'musee' },
    });
    if (existing) { skip(`"${titre}" existe déjà (id ${existing.id})`); continue; }

    const coverUrl = group.items[0]?.imageUrl || null;

    const gallery = await createGallery({
      languageId:  group.lang?.id || null,
      rubrique:    'musee',
      titre,
      description: `Objets et trésors culturels de la tradition ${langNom}`,
      coverUrl,
      ordre:       galCount + 100,
      status:      'PUBLISHED',
    });

    galCount++;

    for (let i = 0; i < group.items.length; i++) {
      const t = group.items[i];
      await createImage({
        galleryId:  gallery.id,
        imageUrl:   t.imageUrl,
        legende:    t.titre || t.contenu?.slice(0, 80) || '',
        traduction: t.traduction || null,
        ordre:      i + 1,
      });
      imgCount++;
    }

    ok(`"${titre}" — ${group.items.length} image(s)`);
  }

  log(`\n→ ${galCount} galerie(s) créée(s), ${imgCount} image(s) ajoutée(s) depuis le Musée.`);
}

// ─── Reset optionnel ──────────────────────────────────────────────────────────

async function resetAutoGalleries() {
  info('RESET — Suppression des galeries auto (rubrique: dictionnaire | musee)');
  if (DRY_RUN) { skip('[DRY] Reset ignoré en mode simulation'); return; }
  const { count } = await prisma.imageGallery.deleteMany({
    where: { rubrique: { in: ['dictionnaire', 'musee'] } },
  });
  ok(`${count} galerie(s) supprimée(s).`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🖼️  Seed Galeries d\'Images');
  console.log('━'.repeat(55));
  if (DRY_RUN) console.log('  ⚠️  MODE SIMULATION — aucune écriture en base\n');
  if (RESET)   await resetAutoGalleries();

  await seedFromDictionary();
  await seedFromMusee();

  console.log('\n' + '━'.repeat(55));
  console.log('✅ Seed terminé.\n');
}

main()
  .catch(err => { console.error('\n❌ Erreur :', err.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
