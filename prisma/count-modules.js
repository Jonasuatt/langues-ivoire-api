// État des lieux : nombre de contenus par module (audit données d'exemple)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const counts = {
    dictionnaire:   await prisma.dictionaryEntry.count(),
    phrasesUtiles:  await prisma.usefulPhrase.count(),
    lecons:         await prisma.lesson.count(),
    culture:        await prisma.culturalItem.count(),
    textes:         await prisma.textContent.count(),
    videos:         await prisma.video.count(),
    premierSecours: await prisma.premierSecoursPhrase.count(),
    civisme:        await prisma.civicContent.count(),
    sensMots:       await prisma.sensMot.count(),
    math:           await prisma.mathContenu.count(),
    monnaie:        await prisma.monnaieContenu.count(),
    marche:         await prisma.marcheDialogue.count(),
    galeries:       await prisma.imageGallery.count(),
    tuteurs:        await prisma.tutor.count(),
    badges:         await prisma.badge.count(),
    fiches:         await prisma.fichePedagogique.count(),
    partenaires:    await prisma.partenaire.count(),
    repetitorMots:  await prisma.repetitorMot.count(),
  };
  console.log(JSON.stringify(counts, null, 1));
}
main().catch(console.error).finally(() => prisma.$disconnect());
