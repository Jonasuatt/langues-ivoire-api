/**
 * fix-gallery-images.js
 * Remplace les URLs Wikipedia Commons (bloquées) par des URLs Picsum fiables
 * puis re-peuple les images avec des URLs Unsplash Source stables.
 *
 * Usage : node scripts/fix-gallery-images.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Picsum Photos — images stables par seed mot-clé (toujours la même image)
const P = (seed, w = 640, h = 430) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const GALLERY_UPDATES = [
  {
    rubrique: 'animaux',
    titre: "Faune d'Afrique de l'Ouest",
    coverUrl: P('elephant-africa', 640, 400),
    images: [
      { legende: 'Éléphant de savane',    traduction: 'African bush elephant',  imageUrl: P('elephant', 640, 430) },
      { legende: "Lion d'Afrique",         traduction: 'African lion',           imageUrl: P('lion-africa', 640, 430) },
      { legende: 'Chimpanzé commun',       traduction: 'Common chimpanzee',      imageUrl: P('chimpanzee', 640, 430) },
      { legende: 'Hippopotame',            traduction: 'Hippopotamus',           imageUrl: P('hippo', 640, 430) },
      { legende: 'Crocodile du Nil',       traduction: 'Nile crocodile',         imageUrl: P('crocodile', 640, 430) },
      { legende: 'Perroquet gris',         traduction: 'African grey parrot',    imageUrl: P('parrot', 640, 430) },
      { legende: 'Zèbre',                  traduction: "Zebra",                  imageUrl: P('zebra', 640, 430) },
      { legende: 'Gorille',                traduction: 'Gorilla',                imageUrl: P('gorilla', 640, 430) },
      { legende: 'Girafe',                 traduction: 'Giraffe',                imageUrl: P('giraffe', 640, 430) },
    ],
  },
  {
    rubrique: 'artisanat',
    titre: "Artisanat et Masques d'Afrique",
    coverUrl: P('african-mask', 640, 400),
    images: [
      { legende: 'Masque africain',        traduction: 'African mask',           imageUrl: P('african-mask', 640, 430) },
      { legende: 'Tissu traditionnel',     traduction: 'Traditional fabric',     imageUrl: P('fabric-pattern', 640, 430) },
      { legende: 'Sculpture en bois',      traduction: 'Wood sculpture',         imageUrl: P('wood-sculpture', 640, 430) },
      { legende: 'Poterie en argile',      traduction: 'Clay pottery',           imageUrl: P('pottery', 640, 430) },
      { legende: 'Bijou traditionnel',     traduction: 'Traditional jewellery',  imageUrl: P('jewellery-gold', 640, 430) },
    ],
  },
  {
    rubrique: 'gastronomie',
    titre: 'Gastronomie ivoirienne',
    coverUrl: P('african-food', 640, 400),
    images: [
      { legende: 'Igname pilée',           traduction: 'Pounded yam',            imageUrl: P('yam-food', 640, 430) },
      { legende: 'Banane plantain',        traduction: 'Plantain banana',        imageUrl: P('plantain', 640, 430) },
      { legende: 'Noix de coco',           traduction: 'Coconut',                imageUrl: P('coconut', 640, 430) },
      { legende: 'Noix de cajou',          traduction: 'Cashew nuts',            imageUrl: P('cashew', 640, 430) },
      { legende: 'Fève de cacao',          traduction: 'Cocoa pod',              imageUrl: P('cacao', 640, 430) },
    ],
  },
];

async function main() {
  console.log('\n🖼️  Mise à jour des URLs d\'images (Picsum)');
  console.log('━'.repeat(50));

  for (const gal of GALLERY_UPDATES) {
    const gallery = await prisma.imageGallery.findFirst({
      where: { rubrique: gal.rubrique, titre: gal.titre },
      include: { images: { orderBy: { ordre: 'asc' } } },
    });

    if (!gallery) {
      console.log(`  ⏭️  Galerie "${gal.titre}" introuvable — skip`);
      continue;
    }

    // Mettre à jour la cover
    await prisma.imageGallery.update({
      where: { id: gallery.id },
      data: { coverUrl: gal.coverUrl },
    });

    // Supprimer et re-créer les images
    await prisma.galleryImage.deleteMany({ where: { galleryId: gallery.id } });
    for (const [i, img] of gal.images.entries()) {
      await prisma.galleryImage.create({
        data: {
          galleryId:  gallery.id,
          imageUrl:   img.imageUrl,
          legende:    img.legende,
          traduction: img.traduction,
          ordre:      i + 1,
        },
      });
    }
    console.log(`  ✅ "${gal.titre}" — cover + ${gal.images.length} images mises à jour`);
  }

  console.log('\n━'.repeat(50));
  console.log('✅ Terminé — recharge l\'app mobile.\n');
}

main()
  .catch(err => { console.error('❌', err.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
