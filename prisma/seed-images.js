const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================================
// IMAGES pour le dictionnaire
// URLs Unsplash (libres de droits, taille optimisée 400x300)
// Associées aux mots par traduction (FR) pour couvrir toutes les langues
// ============================================================

const IMAGES_BY_TRADUCTION = {
  // --- Animaux ---
  'Poulet / Coq':         'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop',
  'Mouton':               'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=400&h=300&fit=crop',
  'Chat':                 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
  'Chien':                'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
  'Serpent':              'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=300&fit=crop',
  'Éléphant':             'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&h=300&fit=crop',
  'Oiseau':               'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop',
  'Chèvre':               'https://images.unsplash.com/photo-1524024973431-3804a4a29f43?w=400&h=300&fit=crop',
  'Poisson':              'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
  'Lion':                 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=300&fit=crop',
  'Vache / Bœuf':         'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&h=300&fit=crop',
  'Singe':                'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=300&fit=crop',
  'Tortue':               'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=300&fit=crop',
  'Crocodile':            'https://images.unsplash.com/photo-1585095595205-e68428a9d907?w=400&h=300&fit=crop',
  'Papillon':             'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=300&fit=crop',
  'Araignée':             'https://images.unsplash.com/photo-1600951583498-5c6d02d26c2c?w=400&h=300&fit=crop',
  'Cheval':               'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop',
  'Âne':                  'https://images.unsplash.com/photo-1581368087049-7034ed0d1e6f?w=400&h=300&fit=crop',

  // --- Nourriture ---
  'Banane plantain':      'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?w=400&h=300&fit=crop',
  'Riz':                  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  'Maïs':                 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
  'Igname':               'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=300&fit=crop',
  'Manioc':               'https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=400&h=300&fit=crop',
  'Sel':                  'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&h=300&fit=crop',
  'Sucre':                'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop',
  'Eau':                  'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
  'Lait':                 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
  'Pain':                 'https://images.unsplash.com/photo-1549931319-a545753467c8?w=400&h=300&fit=crop',
  'Mangue':               'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
  'Orange':               'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
  'Banane':               'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
  'Tomate':               'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
  'Piment':               'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&h=300&fit=crop',
  'Oignon':               'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop',
  'Attiéké':              'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop',

  // --- Corps humain ---
  'Tête':                 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  'Oeil / Yeux':          'https://images.unsplash.com/photo-1494869042583-f6c911f04b4c?w=400&h=300&fit=crop',
  'Bouche':               'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=400&h=300&fit=crop',
  'Main':                 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=400&h=300&fit=crop',
  'Pied / Jambe':         'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
  'Cœur':                 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop',
  'Dent':                 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',

  // --- Nature ---
  'Soleil':               'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
  'Lune':                 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&h=300&fit=crop',
  'Pluie':                'https://images.unsplash.com/photo-1515694346937-94d85e39e29f?w=400&h=300&fit=crop',
  'Vent':                 'https://images.unsplash.com/photo-1527482937786-6c0c22bf5c0f?w=400&h=300&fit=crop',
  'Arbre':                'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&h=300&fit=crop',
  'Fleur':                'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=300&fit=crop',
  'Rivière / Fleuve':     'https://images.unsplash.com/photo-1432405972618-c6b0cfba8954?w=400&h=300&fit=crop',
  'Montagne':             'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
  'Mer / Océan':          'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&h=300&fit=crop',
  'Terre / Sol':          'https://images.unsplash.com/photo-1509803874385-db7c23652552?w=400&h=300&fit=crop',
  'Feu':                  'https://images.unsplash.com/photo-1475332432257-63eab65e5ca5?w=400&h=300&fit=crop',
  'Pierre / Caillou':     'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
  'Étoile':               'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
  'Nuage':                'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&h=300&fit=crop',

  // --- Famille ---
  'Père / Papa':          'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&h=300&fit=crop',
  'Mère / Maman':         'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=400&h=300&fit=crop',
  'Enfant / Bébé':        'https://images.unsplash.com/photo-1519689680058-324335c77efa?w=400&h=300&fit=crop',
  'Femme / Épouse':       'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop',
  'Homme / Mari':         'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop',
  'Grand-père':           'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=400&h=300&fit=crop',

  // --- Couleurs ---
  'Blanc':                'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=400&h=300&fit=crop',
  'Noir':                 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop',
  'Rouge':                'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop',

  // --- Habitat ---
  'Maison':               'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop',
  'Village':              'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=400&h=300&fit=crop',
  'Marché':               'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop',
  'Champ / Ferme':        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
  'Route / Chemin':       'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=400&h=300&fit=crop',
  'École':                'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop',
};

async function main() {
  console.log('🖼️  Ajout des images au dictionnaire...\n');

  let updated = 0;
  let skipped = 0;

  for (const [traduction, imageUrl] of Object.entries(IMAGES_BY_TRADUCTION)) {
    // Chercher tous les mots dont la traduction correspond (toutes langues)
    const entries = await prisma.dictionaryEntry.findMany({
      where: {
        traduction: { contains: traduction, mode: 'insensitive' },
        status: 'PUBLISHED',
        imageUrl: null, // seulement ceux sans image
      },
    });

    if (entries.length === 0) {
      // Essayer une correspondance exacte
      const exactEntries = await prisma.dictionaryEntry.findMany({
        where: {
          traduction: { equals: traduction, mode: 'insensitive' },
          status: 'PUBLISHED',
          imageUrl: null,
        },
      });

      if (exactEntries.length > 0) {
        for (const entry of exactEntries) {
          await prisma.dictionaryEntry.update({
            where: { id: entry.id },
            data: { imageUrl },
          });
          updated++;
        }
      } else {
        skipped++;
      }
      continue;
    }

    for (const entry of entries) {
      await prisma.dictionaryEntry.update({
        where: { id: entry.id },
        data: { imageUrl },
      });
      updated++;
    }
  }

  console.log(`✅ Terminé !`);
  console.log(`   🖼️  ${updated} mots illustrés`);
  console.log(`   ⏩ ${skipped} images sans correspondance`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
