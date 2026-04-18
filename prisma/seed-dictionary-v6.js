const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DICTIONARY_V6 = {
  gouro: [
    { mot: 'Sèè', transcription: 'sèè', traduction: 'Bonsoir', categorie: 'salutations' },
    { mot: 'Gbahon', transcription: 'gbahon', traduction: 'Bonjour', categorie: 'salutations' },
    { mot: 'Nyu kaan', transcription: 'nyu kaan', traduction: 'Bébé', categorie: 'famille' },
    { mot: 'Kɔtrɔ', transcription: 'kɔtrɔ', traduction: 'Couteau', categorie: 'habitat' },
    { mot: 'Sua', transcription: 'sua', traduction: 'Chambre / Pièce', categorie: 'habitat' },
    { mot: 'Klanzin', transcription: 'klanzin', traduction: 'Lampe / Lumière', categorie: 'habitat' },
    { mot: 'Tui', transcription: 'tui', traduction: 'Éléphant', categorie: 'animaux' },
    { mot: 'Zlan', transcription: 'zlan', traduction: 'Panthère', categorie: 'animaux' },
    { mot: 'Nnua', transcription: 'nnua', traduction: 'Arbre', categorie: 'nature' },
  ],
  guere: [
    { mot: 'Sèè', transcription: 'sèè', traduction: 'Bonsoir', categorie: 'salutations' },
    { mot: 'Nyu kaan', transcription: 'nyu kaan', traduction: 'Bébé', categorie: 'famille' },
    { mot: 'Sua', transcription: 'sua', traduction: 'Chambre / Pièce', categorie: 'habitat' },
    { mot: 'Klanzin', transcription: 'klanzin', traduction: 'Lampe / Lumière', categorie: 'habitat' },
    { mot: 'Kɔtrɔ', transcription: 'kɔtrɔ', traduction: 'Couteau', categorie: 'habitat' },
    { mot: 'Gblo nyo', transcription: 'gblo nyo', traduction: 'Merci beaucoup', categorie: 'salutations' },
    { mot: 'Dɔ', transcription: 'dɔ', traduction: 'Donner', categorie: 'verbes' },
    { mot: 'Baga', transcription: 'baga', traduction: 'Manioc', categorie: 'nourriture' },
  ],
  nouchi: [
    { mot: 'Babi-là', transcription: 'babi-là', traduction: 'Abidjan (surnom affectif)', categorie: 'lieux', exemplePhrase: 'Babi-là est chaud', exempleTraduction: 'Abidjan est animé' },
    { mot: 'Abidjanais', transcription: 'abidjanè', traduction: 'Habitant d\'Abidjan', categorie: 'vie_sociale' },
    { mot: 'Première dame', transcription: 'première dame', traduction: 'Première épouse / Femme principale', categorie: 'vie_sociale' },
    { mot: 'Djandjou', transcription: 'djandjou', traduction: 'Fête / Célébration / Bamboche', categorie: 'expressions', exemplePhrase: 'On va au djandjou', exempleTraduction: 'On va à la fête' },
    { mot: 'Dosser', transcription: 'dossé', traduction: 'Trahir / Donner des informations sur quelqu\'un', categorie: 'verbes' },
    { mot: 'Zibou', transcription: 'zibou', traduction: 'Endroit / Lieu / Coin', categorie: 'lieux' },
    { mot: 'Tchôkô', transcription: 'tchôkô', traduction: 'Argent / Pourboire / Corruption', categorie: 'vie_quotidienne' },
    { mot: 'Yèrè', transcription: 'yèrè', traduction: 'Soi-même (affirmation de soi)', categorie: 'expressions' },
    { mot: 'Waridjé', transcription: 'waridjé', traduction: 'Galère financière / Être fauché', categorie: 'vie_quotidienne' },
    { mot: 'Krika', transcription: 'krika', traduction: 'Très petit / Minuscule', categorie: 'expressions' },
    { mot: 'Chicoter', transcription: 'chicoté', traduction: 'Frapper / Battre', categorie: 'verbes' },
    { mot: 'Djiguê', transcription: 'djiguê', traduction: 'Honneur / Dignité / Fierté', categorie: 'expressions', exemplePhrase: 'Il a le djiguê', exempleTraduction: 'Il a de la dignité' },
    { mot: 'Koutoukou bar', transcription: 'koutoukou bar', traduction: 'Bar populaire servant du koutoukou', categorie: 'lieux' },
    { mot: 'Tantie-bagage', transcription: 'tanti-bagaj', traduction: 'Vendeuse ambulante avec marchandises sur la tête', categorie: 'vie_sociale' },
    { mot: 'Foncé', transcription: 'foncé', traduction: 'Aller / Foncer / Agir avec détermination', categorie: 'verbes', exemplePhrase: 'Fonce mon gars !', exempleTraduction: 'Vas-y fonce !' },
    { mot: 'Toutou', transcription: 'toutou', traduction: 'Voiture / Véhicule', categorie: 'transport' },
    { mot: 'Glou', transcription: 'glou', traduction: 'Eau (argot)', categorie: 'nourriture' },
    { mot: 'Mouiller', transcription: 'mouillé', traduction: 'Travailler dur / S\'investir', categorie: 'verbes' },
    { mot: 'Pétard', transcription: 'pétard', traduction: 'Scandale / Événement choquant', categorie: 'expressions' },
    { mot: 'Frapper côté', transcription: 'frapé coté', traduction: 'Changer de direction / Se reconvertir', categorie: 'expressions' },
    { mot: 'Vrai-vrai', transcription: 'vré-vré', traduction: 'Vraiment / Sincèrement', categorie: 'expressions' },
    { mot: 'On est ensemble', transcription: 'on è ensembl', traduction: 'On est solidaires / On se soutient', categorie: 'expressions', exemplePhrase: 'On est ensemble mon frère', exempleTraduction: 'On est solidaires mon ami' },
  ],
};

async function main() {
  console.log('🌍 Finalisation V6 — 200+ mots pour Gouro, Guéré, Nouchi...\n');
  const languages = await prisma.language.findMany();
  const langMap = {};
  for (const l of languages) langMap[l.code] = l.id;

  let totalWords = 0, skipped = 0;
  for (const [langCode, words] of Object.entries(DICTIONARY_V6)) {
    const languageId = langMap[langCode];
    if (!languageId) continue;
    console.log(`📖 ${langCode.toUpperCase()} — ${words.length} mots...`);
    for (const word of words) {
      const existing = await prisma.dictionaryEntry.findFirst({ where: { languageId, mot: word.mot } });
      if (existing) { skipped++; continue; }
      await prisma.dictionaryEntry.create({
        data: { languageId, mot: word.mot, transcription: word.transcription, traduction: word.traduction, categorie: word.categorie, exemplePhrase: word.exemplePhrase || null, exempleTraduction: word.exempleTraduction || null, status: 'PUBLISHED', statutSRS: 0 },
      });
      totalWords++;
    }
  }
  console.log(`\n✅ Terminé ! ${totalWords} mots ajoutés, ${skipped} doublons ignorés`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
