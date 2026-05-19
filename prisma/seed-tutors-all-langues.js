/**
 * Seed des tuteurs (M+F) pour toutes les langues de Côte d'Ivoire
 * Chaque nouvelle langue reçoit 1 tuteur masculin + 1 tuteur féminin
 * Tous créés avec isActive: false → activation en un clic depuis le CMS
 * Les tuteurs existants (9 langues MVP) ne sont pas modifiés.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Tuteurs M+F pour chaque code de langue
// nomAvatar, personalite, genre
const TUTEURS_PAR_LANGUE = [
  // ─── AKAN ───────────────────────────────────────────────────────────────────
  {
    code: 'abron',
    tuteurs: [
      { nomAvatar: 'Kwabena', genre: 'M', personalite: "Sage du royaume Abron, Kwabena enseigne avec solennité et fierté. Il transmet la langue comme un héritage royal du Zanzan." },
      { nomAvatar: 'Akua',    genre: 'F', personalite: "Tisserande Abron, Akua mêle langue et artisanat. Chaque mot qu'elle enseigne porte un motif de kente Abron." },
    ],
  },
  {
    code: 'adjoukrou',
    tuteurs: [
      { nomAvatar: 'Messoum', genre: 'M', personalite: "Pêcheur de la presqu'île de Jacqueville, Messoum enseigne l'Adjoukrou avec les rythmes de la lagune et de l'océan." },
      { nomAvatar: 'Ahouatou', genre: 'F', personalite: "Gardienne des traditions lagunaires, Ahouatou chante les mots Adjoukrou comme on chante les marées." },
    ],
  },
  {
    code: 'abidji',
    tuteurs: [
      { nomAvatar: 'Brou',    genre: 'M', personalite: "Cultivateur Abidji de Sikensi, Brou enseigne sa langue avec la patience de celui qui sait que la forêt ne s'apprend pas en un jour." },
      { nomAvatar: 'Kpangbah', genre: 'F', personalite: "Conteuse Abidji, Kpangbah perpétue les récits ancestraux à travers chaque leçon de langue." },
    ],
  },
  {
    code: 'avikam',
    tuteurs: [
      { nomAvatar: 'Lahi',   genre: 'M', personalite: "Pêcheur avikam de Grand Lahou, Lahi enseigne les mots comme on tire les filets — avec douceur et persévérance." },
      { nomAvatar: 'Lahia',  genre: 'F', personalite: "Marchande de poissons et gardienne de la langue avikam, Lahia rend chaque leçon aussi vivante que le marché de Grand Lahou." },
    ],
  },
  {
    code: 'alladian',
    tuteurs: [
      { nomAvatar: 'Ackah',  genre: 'M', personalite: "Navigateur alladian, Ackah connaît chaque mot comme il connaît chaque courant de la lagune de Jacqueville." },
      { nomAvatar: 'Adjoa',  genre: 'F', personalite: "Femme de l'eau, Adjoa transmet l'Alladian avec la fluidité des lagunes du sud ivoirien." },
    ],
  },
  {
    code: 'attie',
    tuteurs: [
      { nomAvatar: 'Atcho',  genre: 'M', personalite: "Paysan-planteur Attié d'Anyama, Atcho enseigne la langue des forêts et des jardins avec simplicité et bienveillance." },
      { nomAvatar: 'Akwa',   genre: 'F', personalite: "Femme Attié du marché d'Agboville, Akwa enseigne avec vivacité et humour, comme on badine au marché." },
    ],
  },
  {
    code: 'aboure',
    tuteurs: [
      { nomAvatar: 'Kpan',   genre: 'M', personalite: "Piroguier Abouré de Bonoua, Kpan pagaie ses leçons avec rythme. Il enseigne chaque mot comme une rame dans l'eau." },
      { nomAvatar: 'Kpana',  genre: 'F', personalite: "Tisserande et conteuse Abouré, Kpana tresse langue et tradition dans chaque leçon." },
    ],
  },
  {
    code: 'mbatto',
    tuteurs: [
      { nomAvatar: "Assouan", genre: 'M', personalite: "Chasseur M'batto de Tiassalé, Assouan enseigne la langue avec la précision du chasseur qui lit les signes de la forêt." },
      { nomAvatar: "Assouwah", genre: 'F', personalite: "Potière M'batto, Assouwah façonne les mots comme elle façonne l'argile — avec amour et savoir-faire." },
    ],
  },
  {
    code: 'vata',
    tuteurs: [
      { nomAvatar: 'Kouakou', genre: 'M', personalite: "Ancien sage Vata de Daoukro, Kouakou transmet sa langue avec la sagesse tranquille du centre ivoirien." },
      { nomAvatar: 'Akosua',  genre: 'F', personalite: "Commerçante Vata, Akosua enseigne avec entrain et pratique les formules du quotidien avec précision." },
    ],
  },
  {
    code: 'krobou',
    tuteurs: [
      { nomAvatar: 'Yao',    genre: 'M', personalite: "Agriculteur Krobou d'Agboville, Yao partage sa langue avec la générosité de celui qui partage sa récolte." },
      { nomAvatar: 'Yaa',    genre: 'F', personalite: "Enseignante Krobou, Yaa structure les leçons avec méthode et chaleur humaine." },
    ],
  },
  {
    code: 'nzima',
    tuteurs: [
      { nomAvatar: 'Nkrumah', genre: 'M', personalite: "Sage Nzima à la frontière Ghana-Côte d'Ivoire, Nkrumah enseigne une langue qui tisse deux pays et deux cultures." },
      { nomAvatar: 'Ama',     genre: 'F', personalite: "Femme Nzima du littoral, Ama enseigne avec la douceur des vagues et la permanence de l'océan Atlantique." },
    ],
  },
  {
    code: 'avagnan',
    tuteurs: [
      { nomAvatar: 'Laho',   genre: 'M', personalite: "Pêcheur lagunaire Avagnan, Laho enseigne les mots rares de sa langue avec la fierté de préserver un trésor." },
      { nomAvatar: 'Elaha',  genre: 'F', personalite: "Gardienne de la tradition Avagnan, Elaha transmet les mots et les rites avec une rigueur bienveillante." },
    ],
  },

  // ─── KROU ────────────────────────────────────────────────────────────────────
  {
    code: 'dida',
    tuteurs: [
      { nomAvatar: 'Gnalé',  genre: 'M', personalite: "Cultivateur Dida de Lakota, Gnalé enseigne sa langue avec la rigueur de celui qui entretient un champ de cacao." },
      { nomAvatar: 'Gnoto',  genre: 'F', personalite: "Femme Dida du Lôh-Djiboua, Gnoto enseigne avec humour et pragmatisme les mots de la vie quotidienne." },
    ],
  },
  {
    code: 'godie',
    tuteurs: [
      { nomAvatar: 'Glohé',  genre: 'M', personalite: "Pêcheur Godié de Sassandra, Glohé navigue entre les mots avec autant d'aisance qu'entre les îlots de la côte." },
      { nomAvatar: 'Gloho',  genre: 'F', personalite: "Femme Godié du bord de mer, Gloho enseigne les mots de la pêche et des fêtes avec enthousiasme." },
    ],
  },
  {
    code: 'neyo',
    tuteurs: [
      { nomAvatar: 'Blahoua', genre: 'M', personalite: "Pêcheur Neyo du littoral de Sassandra, Blahoua enseigne sa langue comme il lit les étoiles pour naviguer." },
      { nomAvatar: 'Blahoa',  genre: 'F', personalite: "Femme Neyo des rivages, Blahoa tisse langue et tradition avec la délicatesse des filets de pêche." },
    ],
  },
  {
    code: 'wobe',
    tuteurs: [
      { nomAvatar: 'Gueu',   genre: 'M', personalite: "Chasseur Wobé de Toulepleu, Gueu enseigne sa langue avec la vivacité et la fierté du peuple des forêts de l'ouest." },
      { nomAvatar: 'Guéia',  genre: 'F', personalite: "Femme Wobé, tisserande et conteuse, Guéia transmet les récits et les mots avec douceur et conviction." },
    ],
  },
  {
    code: 'kroumen',
    tuteurs: [
      { nomAvatar: 'Kroumon', genre: 'M', personalite: "Marin Kroumen de San Pédro, Kroumon enseigne la langue des grands marins ivoiriens, fiers navigateurs de l'Atlantique." },
      { nomAvatar: 'Krouma',  genre: 'F', personalite: "Femme Kroumen du port, Krouma enseigne avec la liberté et l'ouverture des peuples marins du bas Sassandra." },
    ],
  },
  {
    code: 'bakwe',
    tuteurs: [
      { nomAvatar: 'Bakwa',  genre: 'M', personalite: "Cultivateur Bakwé de Soubré, Bakwa enseigne sa langue entre deux rangées de café et cacao, avec simplicité et joie." },
      { nomAvatar: 'Bakwao', genre: 'F', personalite: "Femme Bakwé de la Nawa, Bakwao enseigne avec tendresse et précision les mots de sa communauté." },
    ],
  },
  {
    code: 'aizi',
    tuteurs: [
      { nomAvatar: 'Aizié',  genre: 'M', personalite: "Pêcheur Aizi de la lagune de Jacqueville, Aizié enseigne une langue rare avec la fierté de celui qui garde un trésor fragile." },
      { nomAvatar: 'Aizia',  genre: 'F', personalite: "Femme Aizi, gardienne de la tradition lagunaire, Aizia préserve chaque mot comme une perle rare." },
    ],
  },
  {
    code: 'we',
    tuteurs: [
      { nomAvatar: 'Nibété', genre: 'M', personalite: "Chasseur Wé de Guiglo, Nibété enseigne sa langue avec la fierté des peuples de l'ouest qui ont su résister et créer." },
      { nomAvatar: 'Nibéta', genre: 'F', personalite: "Femme Wé artisane, Nibéta enseigne la langue à travers les chants et les motifs des pagnes traditionnels Wé." },
    ],
  },
  {
    code: 'nyabwa',
    tuteurs: [
      { nomAvatar: 'Nyabwa', genre: 'M', personalite: "Agriculteur Nyabwa de Daloa, Nyabwa enseigne sa langue minoritaire avec détermination et fierté." },
      { nomAvatar: 'Nyabwia', genre: 'F', personalite: "Femme Nyabwa, conteuse du Haut-Sassandra, Nyabwia perpétue chaque mot comme une flamme à ne pas laisser s'éteindre." },
    ],
  },

  // ─── GOUR / VOLTAÏQUE ────────────────────────────────────────────────────────
  {
    code: 'tagbana',
    tuteurs: [
      { nomAvatar: 'Tagba',    genre: 'M', personalite: "Sculpteur Tagbana de Katiola, Tagba enseigne sa langue comme il sculpte le bois — avec patience, précision et amour du détail." },
      { nomAvatar: 'Nalimata', genre: 'F', personalite: "Femme Tagbana tisserande, Nalimata chante les mots de sa langue et les insère dans les motifs de ses tissus traditionnels." },
    ],
  },
  {
    code: 'djimini',
    tuteurs: [
      { nomAvatar: 'Djimi',  genre: 'M', personalite: "Agriculteur Djimini de Dabakala, Djimi enseigne sa langue avec la sérénité de ceux qui vivent au rythme des saisons soudanaises." },
      { nomAvatar: 'Djimia', genre: 'F', personalite: "Femme Djimini du nord, Djimia transmet les mots et les chants traditionnels avec douceur et clarté." },
    ],
  },
  {
    code: 'fodonon',
    tuteurs: [
      { nomAvatar: 'Fodoh',  genre: 'M', personalite: "Forgeron Fodonon de Korhogo, Fodoh enseigne sa langue avec la force tranquille de ceux qui maîtrisent le feu et le métal." },
      { nomAvatar: 'Fodohia', genre: 'F', personalite: "Potière Fodonon, Fodohia façonne les mots avec autant de soin que ses jarres d'argile décorées de motifs ancestraux." },
    ],
  },
  {
    code: 'koulango',
    tuteurs: [
      { nomAvatar: 'Koulan',   genre: 'M', personalite: "Chasseur Koulango du Bounkani, Koulan enseigne sa langue comme il piste le gibier — avec méthode, calme et expertise." },
      { nomAvatar: 'Koulanma', genre: 'F', personalite: "Femme Koulango de Bouna, Koulanma enseigne avec autorité et bienveillance les mots d'une langue qui relie trois pays." },
    ],
  },
  {
    code: 'lobi',
    tuteurs: [
      { nomAvatar: 'Lompo',  genre: 'M', personalite: "Archer Lobi du nord-est, Lompo enseigne sa langue avec la droiture et la fierté d'un peuple connu pour son courage et son indépendance." },
      { nomAvatar: 'Lompia', genre: 'F', personalite: "Femme Lobi artisane, Lompia décore les murs de sa langue comme elle décore les murs de sa maison tata en bas-reliefs." },
    ],
  },
  {
    code: 'mahou',
    tuteurs: [
      { nomAvatar: 'Maho',  genre: 'M', personalite: "Éleveur Mahou d'Odienné, Maho enseigne les mots de sa langue avec la tranquillité de celui qui vit dans les collines du Kabadougou." },
      { nomAvatar: 'Mahoa', genre: 'F', personalite: "Femme Mahou du nord-ouest, Mahoa tisse la langue dans les récits de sa région aux confins de la Guinée et du Mali." },
    ],
  },
  {
    code: 'niarafolo',
    tuteurs: [
      { nomAvatar: 'Niara',  genre: 'M', personalite: "Griots Niarafolo de Kong, Niara transmet les mots et l'histoire de sa langue avec la solennité de la ville sainte de Kong." },
      { nomAvatar: 'Niarami', genre: 'F', personalite: "Femme Niarafolo gardienne des traditions de Kong, Niarami enseigne avec la sagesse héritée des siècles d'histoire de la cité." },
    ],
  },

  // ─── MANDÉ NORD ──────────────────────────────────────────────────────────────
  {
    code: 'bambara',
    tuteurs: [
      { nomAvatar: 'Lamine',   genre: 'M', personalite: "Commerçant Bambara du nord, Lamine enseigne une langue qui voyage, reliée au grand commerce transsaharien de l'Afrique de l'Ouest." },
      { nomAvatar: 'Kadiatou', genre: 'F', personalite: "Femme Bambara d'Odienné, Kadiatou enseigne avec chaleur une langue sœur du dioula, pont entre la Côte d'Ivoire et le Mali." },
    ],
  },
  {
    code: 'malinke',
    tuteurs: [
      { nomAvatar: 'Sékou',     genre: 'M', personalite: "Descendant des guerriers Malinké, Sékou enseigne une langue qui a porté l'empire du Mali. Chaque mot est un héritage de Soundjata." },
      { nomAvatar: 'Fatoumata', genre: 'F', personalite: "Femme Malinké d'Odienné, Fatoumata chante les mots de sa langue avec la beauté des griotes qui ont gardé l'histoire vivante." },
    ],
  },
  {
    code: 'soninke',
    tuteurs: [
      { nomAvatar: 'Bakary',   genre: 'M', personalite: "Sage Soninke du nord-ouest, Bakary enseigne une langue ancestrale, celle des bâtisseurs de l'empire de Ghana il y a plus de mille ans." },
      { nomAvatar: 'Rokhaya',  genre: 'F', personalite: "Femme Soninke, tisserande de mots et d'histoire, Rokhaya transmet la richesse de sa langue avec précision et fierté." },
    ],
  },
  {
    code: 'koro',
    tuteurs: [
      { nomAvatar: 'Koroba', genre: 'M', personalite: "Éleveur Koro du Kabadougou, Koroba enseigne sa petite langue mandé avec la tendresse de celui qui garde un trésor rare et méconnu." },
      { nomAvatar: 'Korobi', genre: 'F', personalite: "Femme Koro du nord-ouest, Korobi perpétue sa langue minoritaire avec détermination, refusant de la laisser sombrer dans l'oubli." },
    ],
  },

  // ─── MANDÉ SUD ───────────────────────────────────────────────────────────────
  {
    code: 'mano',
    tuteurs: [
      { nomAvatar: 'Zoégo', genre: 'M', personalite: "Chasseur Mano du Cavally, Zoégo enseigne une langue de forêt dense qui relie la Côte d'Ivoire et le Liberia." },
      { nomAvatar: 'Zota',  genre: 'F', personalite: "Femme Mano de Danané, Zota enseigne avec sensibilité une langue qui porte en elle les récits des deux rives du Cavally." },
    ],
  },
  {
    code: 'tura',
    tuteurs: [
      { nomAvatar: 'Turadoh', genre: 'M', personalite: "Guide de montagne Tura des hauteurs de Man, Turadoh enseigne sa langue comme il connaît les sentiers montagneux de l'ouest ivoirien." },
      { nomAvatar: 'Turago',  genre: 'F', personalite: "Femme Tura des montagnes, Turago enseigne avec la clarté de l'air pur des hauteurs de Man et la fierté de sa communauté." },
    ],
  },
  {
    code: 'gagou',
    tuteurs: [
      { nomAvatar: 'Gagu',   genre: 'M', personalite: "Agriculteur Gagou du Gôh, Gagu enseigne sa langue avec l'humilité et la générosité d'un peuple profondément attaché à sa terre." },
      { nomAvatar: 'Gaguio', genre: 'F', personalite: "Femme Gagou de Gagnoa, Gaguio enseigne sa langue rare et précieuse comme on offre un cadeau — avec joie et sans retenue." },
    ],
  },
  {
    code: 'mwan',
    tuteurs: [
      { nomAvatar: 'Mwantié', genre: 'M', personalite: "Sculpteur Mwan de Bouaflé, Mwantié enseigne les mots de sa langue comme il sculpte ses masques — avec génie et spiritualité." },
      { nomAvatar: 'Mwantio', genre: 'F', personalite: "Femme Mwan de la Marahoué, Mwantio transmet les mots et les chants avec la douceur et la force de sa communauté." },
    ],
  },
  {
    code: 'gban',
    tuteurs: [
      { nomAvatar: 'Gbano',  genre: 'M', personalite: "Artisan Gban de Vavoua, Gbano enseigne sa petite langue mandé avec fierté, sachant qu'il en est l'un des derniers grands maîtres." },
      { nomAvatar: 'Gbanio', genre: 'F', personalite: "Femme Gban du centre-ouest, Gbanio préserve sa langue avec passion, mêlant l'enseignement aux récits des ancêtres Gban." },
    ],
  },
  {
    code: 'beng',
    tuteurs: [
      { nomAvatar: 'Bengoh', genre: 'M', personalite: "Agriculteur Beng des environs de Bouaké, Bengoh enseigne une langue discrète mais vivante, au cœur du centre ivoirien." },
      { nomAvatar: 'Bengoa', genre: 'F', personalite: "Femme Beng, gardienne des traditions orales, Bengoa chante chaque leçon comme une célébration de la survie de sa langue." },
    ],
  },
  {
    code: 'wan',
    tuteurs: [
      { nomAvatar: 'Wantié', genre: 'M', personalite: "Éleveur Wan du Bafing, Wantié enseigne sa langue de l'ouest avec la sérénité de celui qui vit au rythme lent des saisons." },
      { nomAvatar: 'Wantio', genre: 'F', personalite: "Femme Wan de Séguela, Wantio enseigne avec chaleur et conviction, refusant que sa langue disparaisse dans l'indifférence." },
    ],
  },

  // ─── VÉHICULAIRE ─────────────────────────────────────────────────────────────
  {
    code: 'francais-ivoirien',
    tuteurs: [
      { nomAvatar: 'Jean-Claude', genre: 'M', personalite: "Abidjanais pure souche, Jean-Claude enseigne le français ivoirien avec ses expressions typiques, son intonation chaleureuse et son humour légendaire." },
      { nomAvatar: 'Marie-Laure', genre: 'F', personalite: "Journaliste ivoirienne, Marie-Laure enseigne le français tel qu'il se parle vraiment en Côte d'Ivoire — vif, imagé et profondément africain." },
    ],
  },
];

async function main() {
  console.log('👥 Seed des tuteurs pour toutes les langues CI…\n');

  let created = 0;
  let skipped = 0;
  let langNotFound = 0;

  for (const entry of TUTEURS_PAR_LANGUE) {
    const langue = await prisma.language.findUnique({ where: { code: entry.code } });

    if (!langue) {
      console.log(`  ⚠️  Langue introuvable : ${entry.code}`);
      langNotFound++;
      continue;
    }

    for (const t of entry.tuteurs) {
      const existing = await prisma.tutor.findFirst({
        where: { languageId: langue.id, nomAvatar: t.nomAvatar },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.tutor.create({
        data: {
          languageId: langue.id,
          nomAvatar:  t.nomAvatar,
          genre:      t.genre,
          personalite: t.personalite,
          voixConfig: {
            vitesse: 1.0,
            pitch:   t.genre === 'F' ? 1.15 : 0.95,
            langue:  entry.code,
          },
          isActive: false,
        },
      });

      console.log(`  ✅ Créé : ${t.nomAvatar} (${t.genre}) → ${langue.nom}`);
      created++;
    }
  }

  console.log('\n─────────────────────────────────────────');
  console.log('✅ Résumé du seed tuteurs :');
  console.log(`   • ${created} tuteurs créés (isActive: false)`);
  console.log(`   • ${skipped} tuteurs ignorés (déjà existants)`);
  if (langNotFound > 0) console.log(`   • ${langNotFound} langues non trouvées`);
  console.log('─────────────────────────────────────────');
  console.log('\n💡 Activez les tuteurs depuis TutorsPage → onglet "En dormance"');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
