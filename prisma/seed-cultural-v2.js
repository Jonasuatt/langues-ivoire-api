const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Contenu culturel enrichi : proverbes, contes, expressions idiomatiques, traditions, musique, danse
const CULTURAL_CONTENT = [
  // ===== BAOULÉ =====
  // Proverbes
  { code: 'baoule', type: 'PROVERB', contenu: "Sran kun sa juman i wun", traduction: "L'homme seul ne peut pas se laver le dos", sourceEthnique: 'Baoulé' },
  { code: 'baoule', type: 'PROVERB', contenu: "Boli fɛ la ti nun", traduction: "La beauté du mouton est dans sa tête", sourceEthnique: 'Baoulé' },
  { code: 'baoule', type: 'PROVERB', contenu: "Awlɛ su ba bɔ man", traduction: "Les disputes familiales ne sortent pas de la cour", sourceEthnique: 'Baoulé' },
  { code: 'baoule', type: 'PROVERB', contenu: "Kanga b'a sɛ i wun a yi kɛ i min sa", traduction: "L'esclave qui se libère agit comme son ancien maître", sourceEthnique: 'Baoulé' },
  { code: 'baoule', type: 'PROVERB', contenu: "Sɛ a wu klɔ wa, klɔ di a nnɛn", traduction: "Si tu meurs au village, le village mangera tes biens", sourceEthnique: 'Baoulé' },
  // Traditions
  { code: 'baoule', type: 'TRADITION', titre: "La fête de l'igname (Djê)", contenu: "Le Djê est la fête de l'igname chez les Baoulé. Elle marque la fin de la récolte et le début d'un nouveau cycle agricole. Pendant cette cérémonie, la première igname est offerte aux ancêtres avant que la communauté ne puisse en consommer.", sourceEthnique: 'Baoulé' },
  { code: 'baoule', type: 'TRADITION', titre: "Le trône Baoulé", contenu: "Chez les Baoulé, le trône royal (bia) est un siège sacré sculpté dans du bois précieux. Il symbolise le pouvoir et la sagesse du chef. Nul ne peut s'y asseoir sans y être autorisé par le conseil des anciens.", sourceEthnique: 'Baoulé' },
  // Contes
  { code: 'baoule', type: 'TALE', titre: "L'araignée et la sagesse", contenu: "Anansi l'araignée voulait posséder toute la sagesse du monde. Il la rassembla dans une calebasse et tenta de la cacher en haut d'un arbre. Mais la calebasse tomba et se brisa, dispersant la sagesse partout. C'est pourquoi personne ne possède toute la sagesse.", sourceEthnique: 'Baoulé' },
  // Anecdotes
  { code: 'baoule', type: 'ANECDOTE', contenu: "Le nom 'Baoulé' signifie 'l'enfant est mort'. Selon la légende, la reine Abla Pokou dut sacrifier son enfant unique pour permettre à son peuple de traverser le fleuve Comoé lors de leur migration.", sourceEthnique: 'Baoulé' },
  // Danse
  { code: 'baoule', type: 'DANCE', titre: "Le Goli", contenu: "Le Goli est une danse traditionnelle Baoulé exécutée lors de funérailles et de fêtes importantes. Les danseurs portent des masques représentant différents esprits de la nature. La danse alterne entre mouvements lents et rapides, accompagnée de tambours et de chants.", sourceEthnique: 'Baoulé' },

  // ===== DIOULA =====
  { code: 'dioula', type: 'PROVERB', contenu: "Mɔgɔ tɛ kɛlɛ kɛ ka kɛlɛ sɔrɔ", traduction: "On ne fait pas la guerre pour avoir la guerre", sourceEthnique: 'Dioula' },
  { code: 'dioula', type: 'PROVERB', contenu: "Sɛbɛn jugu ka fisa ni miiri ɲuman ye", traduction: "Un mauvais écrit vaut mieux qu'une bonne mémoire", sourceEthnique: 'Dioula' },
  { code: 'dioula', type: 'PROVERB', contenu: "Ko dɔ bɛ, ko kɔrɔ tɛ", traduction: "Il y a des choses, il n'y a pas de choses anciennes (tout change)", sourceEthnique: 'Dioula' },
  { code: 'dioula', type: 'PROVERB', contenu: "Bɔɲɔgɔn ma ɲɛ fɔ ɲɔgɔn na", traduction: "Les faux amis ne se démasquent qu'entre eux", sourceEthnique: 'Dioula' },
  { code: 'dioula', type: 'PROVERB', contenu: "Sinɛ ni kunu tɛ kelen ye", traduction: "Demain et hier ne sont pas pareils", sourceEthnique: 'Dioula' },
  { code: 'dioula', type: 'TRADITION', titre: "Le Balafon sacré", contenu: "Le balafon est un instrument sacré chez les Dioula. Le Sosso Bala, considéré comme le plus ancien balafon d'Afrique de l'Ouest, est gardé par la famille Kouyaté à Niagassola. Son apprentissage suit un rituel initiatique précis transmis de maître à élève.", sourceEthnique: 'Dioula' },
  { code: 'dioula', type: 'TRADITION', titre: "Le mariage Dioula", contenu: "Le mariage Dioula se déroule en plusieurs étapes : le kola (demande officielle avec des noix de cola), le denbaya signalement (rencontre des familles), la dot, et enfin la cérémonie religieuse. Les griots jouent un rôle central dans chaque étape.", sourceEthnique: 'Dioula' },
  { code: 'dioula', type: 'TALE', titre: "Soundiata et le buffle", contenu: "Soundiata Keïta, fondateur de l'empire du Mali, ne pouvait pas marcher enfant. Un jour, grâce à une barre de fer et sa volonté, il se leva et déracina un baobab entier pour offrir les feuilles à sa mère. Ce conte enseigne que la patience et la détermination triomphent toujours.", sourceEthnique: 'Dioula' },
  { code: 'dioula', type: 'MUSIC', titre: "Le Djembé", contenu: "Le djembé est l'instrument emblématique des Dioula et des Malinké. Taillé dans un tronc d'arbre et recouvert d'une peau de chèvre, il produit trois sons fondamentaux : le basse (ton grave), le tonique (ton médium) et le claqué (ton aigu). Chaque rythme accompagne un événement spécifique.", sourceEthnique: 'Dioula' },
  { code: 'dioula', type: 'ANECDOTE', contenu: "Le Dioula est la langue véhiculaire de toute l'Afrique de l'Ouest. Un locuteur Dioula peut se faire comprendre du Sénégal jusqu'au Burkina Faso, car le Dioula, le Bambara et le Malinké forment un continuum linguistique quasi identique.", sourceEthnique: 'Dioula' },

  // ===== BÉTÉ =====
  { code: 'bete', type: 'PROVERB', contenu: "Gba kpɛ gba a nyrun", traduction: "La pluie qui tombe ne regarde pas le visage", sourceEthnique: 'Bété' },
  { code: 'bete', type: 'PROVERB', contenu: "Gbê laa wɛ pô dji", traduction: "Le poisson ne combat pas l'eau dans laquelle il vit", sourceEthnique: 'Bété' },
  { code: 'bete', type: 'PROVERB', contenu: "Zrê kouhé gba ta klo", traduction: "L'oiseau qui chante ignore que la pluie menace", sourceEthnique: 'Bété' },
  { code: 'bete', type: 'PROVERB', contenu: "Tokpa dji sê wè nan", traduction: "Le marigot ne refuse pas l'eau de pluie", sourceEthnique: 'Bété' },
  { code: 'bete', type: 'TRADITION', titre: "Le masque Gla", contenu: "Le masque Gla est le masque de justice chez les Bété. Il intervient pour régler les conflits et rendre justice. Seuls les initiés peuvent le porter. Sa sortie est accompagnée de danses et de chants rituels qui invoquent les esprits ancestraux.", sourceEthnique: 'Bété' },
  { code: 'bete', type: 'TALE', titre: "Le lièvre et l'éléphant", contenu: "Un jour, le lièvre défia l'éléphant à un concours de force. Il attacha une liane à l'éléphant d'un côté et à l'hippopotame de l'autre. Chacun tirait sans savoir que l'autre tirait aussi. Le lièvre prouva que l'intelligence surpasse la force brute.", sourceEthnique: 'Bété' },
  { code: 'bete', type: 'DANCE', titre: "Le Zagrobi", contenu: "Le Zagrobi est une danse traditionnelle Bété caractérisée par des mouvements saccadés et des sauts acrobatiques. Elle est exécutée lors des fêtes de récolte et des cérémonies d'initiation, accompagnée de tambours et de grelots.", sourceEthnique: 'Bété' },

  // ===== SÉNOUFO =====
  { code: 'senoufo', type: 'PROVERB', contenu: "Kpɛnɛ ya wɔ na fɔlɔ", traduction: "Le vieux a vu le matin avant le jeune", sourceEthnique: 'Sénoufo' },
  { code: 'senoufo', type: 'PROVERB', contenu: "Sikɛ tara ye na kɛ", traduction: "Le secret du fleuve, c'est sa source", sourceEthnique: 'Sénoufo' },
  { code: 'senoufo', type: 'PROVERB', contenu: "Nama kɔlɔ na ta gbe", traduction: "Le caméléon ne se presse jamais mais arrive toujours", sourceEthnique: 'Sénoufo' },
  { code: 'senoufo', type: 'PROVERB', contenu: "Wara ba tye poro kan", traduction: "Le lion ne rugit pas sans raison", sourceEthnique: 'Sénoufo' },
  { code: 'senoufo', type: 'TRADITION', titre: "Le Poro", contenu: "Le Poro est l'institution initiatique sacrée des Sénoufo. L'initiation dure 7 ans et se divise en trois cycles. Les initiés apprennent les savoirs ancestraux, la pharmacopée, l'histoire du clan et les secrets de la forge. Le bois sacré est l'espace où se déroulent les rituels.", sourceEthnique: 'Sénoufo' },
  { code: 'senoufo', type: 'TRADITION', titre: "Les tisserands Sénoufo", contenu: "Le tissage est un art sacré chez les Sénoufo. Les pagnes tissés (korhogo) portent des motifs géométriques et des symboles qui racontent des histoires ou transmettent des messages. Chaque motif a une signification précise liée à la cosmologie Sénoufo.", sourceEthnique: 'Sénoufo' },
  { code: 'senoufo', type: 'TALE', titre: "Le caméléon messager", contenu: "Dieu envoya le caméléon porter le message de la vie éternelle aux hommes. Mais le caméléon, marchant lentement, fut devancé par le lézard qui apporta le message de la mort. C'est pourquoi les hommes sont mortels, et les Sénoufo respectent le caméléon.", sourceEthnique: 'Sénoufo' },
  { code: 'senoufo', type: 'DANCE', titre: "Le Boloye", contenu: "Le Boloye est la danse du léopard chez les Sénoufo. Les danseurs portent un costume intégral recouvert de fibres et de plumes. Cette danse nocturne, accompagnée de musique de balafons, célèbre le passage des jeunes à l'âge adulte lors du Poro.", sourceEthnique: 'Sénoufo' },

  // ===== AGNI =====
  { code: 'agni', type: 'PROVERB', contenu: "Abisua sran kun fa man", traduction: "Un seul doigt ne peut pas ramasser un caillou", sourceEthnique: 'Agni' },
  { code: 'agni', type: 'PROVERB', contenu: "Nzuɛ fita fɛ la wla wu", traduction: "L'eau qui coule doucement creuse la pierre", sourceEthnique: 'Agni' },
  { code: 'agni', type: 'PROVERB', contenu: "Awie kusu i wun, i man nyi", traduction: "Le rat qui se lave ne deviendra jamais blanc", sourceEthnique: 'Agni' },
  { code: 'agni', type: 'TRADITION', titre: "La fête de Pâques à Abengourou", contenu: "La fête de Pâques est un événement majeur chez les Agni. Le roi Agni organise une grande cérémonie où les chefs de village rendent hommage. C'est l'occasion de purification, de réconciliation et de réaffirmation des liens communautaires.", sourceEthnique: 'Agni' },
  { code: 'agni', type: 'TALE', titre: "Ananzé le rusé", contenu: "Ananzé l'araignée promit à chaque animal d'être son meilleur ami. Mais quand vint le moment de partager la nourriture, Ananzé voulut tout garder. Les animaux découvrirent sa ruse et l'araignée dut se cacher. C'est pourquoi l'araignée vit dans les coins sombres.", sourceEthnique: 'Agni' },
  { code: 'agni', type: 'MUSIC', titre: "L'Adowa", contenu: "L'Adowa est une musique traditionnelle des Akan, incluant les Agni. Jouée avec des fontomfrom (grands tambours), elle accompagne les cérémonies royales. Les rythmes codés permettent de transmettre des messages complexes entre villages.", sourceEthnique: 'Agni' },

  // ===== GOURO =====
  { code: 'gouro', type: 'PROVERB', contenu: "Gla nɔn da ta kla", traduction: "La nuit porte conseil", sourceEthnique: 'Gouro' },
  { code: 'gouro', type: 'PROVERB', contenu: "Wlɔ kpa nan kɔ bla", traduction: "Quand le serpent passe, la route ne s'oublie pas", sourceEthnique: 'Gouro' },
  { code: 'gouro', type: 'PROVERB', contenu: "Bɛtɛ klan na dji wan", traduction: "La poule qui gratte la terre trouvera toujours des vers", sourceEthnique: 'Gouro' },
  { code: 'gouro', type: 'TRADITION', titre: "Les masques Zaouli", contenu: "Le Zaouli est un masque de danse gouro représentant la beauté féminine idéale. Le danseur exécute des mouvements de pieds d'une rapidité extraordinaire tandis que le haut du corps reste parfaitement immobile. Le Zaouli est inscrit au patrimoine culturel immatériel de l'UNESCO.", sourceEthnique: 'Gouro' },
  { code: 'gouro', type: 'TALE', titre: "Le chasseur et le génie de la forêt", contenu: "Un chasseur Gouro s'aventura trop profondément dans la forêt sacrée. Il rencontra un génie qui lui proposa un marché : la connaissance des plantes médicinales contre la promesse de ne jamais révéler leur emplacement. Le chasseur devint le plus grand guérisseur du village.", sourceEthnique: 'Gouro' },
  { code: 'gouro', type: 'DANCE', titre: "Le Zaouli", contenu: "Le Zaouli est considéré comme la danse la plus rapide d'Afrique. Le danseur, portant un masque coloré aux traits féminins, exécute des pas d'une complexité et d'une vitesse incroyables. Les pieds frappent le sol avec une précision rythmique qui fascine les spectateurs.", sourceEthnique: 'Gouro' },

  // ===== GUÉRÉ =====
  { code: 'guere', type: 'PROVERB', contenu: "Gban wê naan kpa gblê", traduction: "Le palmier ne pousse pas en un jour", sourceEthnique: 'Guéré' },
  { code: 'guere', type: 'PROVERB', contenu: "Zô kpa ta gba wɛ", traduction: "L'éléphant ne peut pas cacher sa trace", sourceEthnique: 'Guéré' },
  { code: 'guere', type: 'PROVERB', contenu: "Gbê dji waan na maan", traduction: "Le fleuve qui coule ne revient pas en arrière", sourceEthnique: 'Guéré' },
  { code: 'guere', type: 'TRADITION', titre: "Les masques Guéré", contenu: "Les masques Guéré sont parmi les plus expressifs d'Afrique. Avec leurs yeux tubulaires et leurs joues gonflées, ils incarnent les esprits de la forêt. Chaque masque a une fonction : justice, guerre, réjouissance ou initiation.", sourceEthnique: 'Guéré' },
  { code: 'guere', type: 'TALE', titre: "La tortue et le singe", contenu: "La tortue défia le singe à une course. Le singe riait de la lenteur de la tortue. Mais la tortue, grâce à ses amies tortues postées le long du chemin, arriva toujours en tête. Le conte enseigne la valeur de la solidarité face à l'arrogance.", sourceEthnique: 'Guéré' },
  { code: 'guere', type: 'MUSIC', titre: "Le tambour parleur", contenu: "Chez les Guéré, le tambour parleur (gbelé) est un instrument de communication. En reproduisant les tons de la langue, le joueur peut transmettre des messages sur de longues distances. Chaque famille a ses propres rythmes d'appel.", sourceEthnique: 'Guéré' },

  // ===== NOUCHI =====
  { code: 'nouchi', type: 'PROVERB', contenu: "Qui va lentement va sûrement, qui va sûrement va longtemps", traduction: "La patience mène au succès", sourceEthnique: 'Nouchi / Abidjan' },
  { code: 'nouchi', type: 'PROVERB', contenu: "C'est pas parce que le garba coûte pas cher que c'est pas bon", traduction: "Ne jugez pas la qualité par le prix", sourceEthnique: 'Nouchi / Abidjan' },
  { code: 'nouchi', type: 'ANECDOTE', titre: "Les origines du Nouchi", contenu: "Le Nouchi est né dans les années 1970-80 dans les ghettos d'Abidjan. C'est un argot urbain mêlant français, dioula, baoulé, bété et anglais. D'abord langue des jeunes des rues, il est devenu la langue populaire de toute la Côte d'Ivoire, utilisée dans le zouglou et le coupé-décalé.", sourceEthnique: 'Nouchi / Abidjan' },
  { code: 'nouchi', type: 'ANECDOTE', titre: "Expressions Nouchi célèbres", contenu: "Le Nouchi regorge d'expressions colorées : 'On dit quoi ?' (comment ça va ?), 'C'est comment ?' (quoi de neuf ?), 'Y'a fohi' (pas de problème), 'Dja' (attention/prends garde), 'Gbê' (la vie). Ces expressions sont aujourd'hui utilisées dans toute l'Afrique francophone.", sourceEthnique: 'Nouchi / Abidjan' },
  { code: 'nouchi', type: 'MUSIC', titre: "Le Zouglou", contenu: "Le Zouglou est un genre musical ivoirien né à l'université d'Abidjan dans les années 1990. Chanté en Nouchi et en français, il mélange rythmes traditionnels et influences modernes. Les textes abordent les réalités sociales avec humour et philosophie.", sourceEthnique: 'Nouchi / Abidjan' },
];

async function seedCulturalV2() {
  console.log('🎭 Seeding contenu culturel enrichi...\n');

  // Charger les langues
  const languages = await prisma.language.findMany();
  const langMap = {};
  languages.forEach(l => { langMap[l.code] = l.id; });

  let created = 0;
  let skipped = 0;

  for (const item of CULTURAL_CONTENT) {
    const languageId = langMap[item.code];
    if (!languageId) {
      console.log(`  ⚠️ Langue "${item.code}" non trouvée, skip`);
      skipped++;
      continue;
    }

    // Vérifier si le contenu existe déjà (par contenu + type + languageId)
    const existing = await prisma.culturalItem.findFirst({
      where: { contenu: item.contenu, type: item.type, languageId },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.culturalItem.create({
      data: {
        languageId,
        type: item.type,
        titre: item.titre || null,
        contenu: item.contenu,
        traduction: item.traduction || null,
        sourceEthnique: item.sourceEthnique || null,
        isActive: true,
      },
    });
    created++;
  }

  console.log(`  ✅ ${created} éléments culturels créés`);
  if (skipped > 0) console.log(`  ⏭️  ${skipped} déjà existants ou langues manquantes`);
}

seedCulturalV2()
  .then(() => { console.log('\n✅ Seed culturel v2 terminé !'); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
