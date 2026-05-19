/**
 * Seed — Textes & Récits
 * 15 contenus authentiques : contes, proverbes, chansons, légendes, récits, descriptions
 */
const https = require('https');

const API = 'api-production-7107f.up.railway.app';

const LANG = {
  baoule:  'e11b660e-ac5c-4afe-a51c-8d1adaaf91b5',
  dioula:  'ce40adc3-ca8b-4dee-806c-01ce41940b86',
  bete:    '7770b15a-9b0e-49f5-87b1-8bbeccde5183',
  senoufo: '8af49841-5b44-4bbd-ae04-520f4554affb',
  agni:    'b852f2af-5e75-4d89-b13f-9cd9f40d5e44',
  gouro:   'd01b784f-4f66-4f9d-81d5-9c51a2c20903',
  guere:   '781565c4-d55b-4dff-bf9a-8c136dba4597',
  nouchi:  '668bde2e-c471-4b51-a5d6-844665663f4f',
};

// ─── Contenu ───────────────────────────────────────────────────────────────────

const TEXTES = [

  // ══════════════ CONTES ══════════════

  {
    languageId: LANG.dioula,
    type: 'CONTE',
    titre: 'Le Lion et l\'Araignée maligne',
    resume: 'Un conte classique de l\'Afrique de l\'Ouest où l\'araignée, petite mais rusée, triomphe du lion grâce à son intelligence.',
    contenu: `Kɔrɔn kɔnɔ, dɔ loon, Jara ni Kɔngɔ tun be dugu la.
Jara tun ka bon kosɛbɛ, a tun bɛ mɔgɔw fɛn bɛɛ ta.
Loon dɔ, a y'a fɔ ko a bɛna Kɔngɔ dun, katuguni a ka tɔgɔ ka jan ani a seli ka tɛ.

Kɔngɔ y'a lamɛn ka fɛɛrɛ dɔ sɔrɔ.
A ko: "Jara, n bɛ se k'i dɔgɔmusa. Nga ne ka seli ka fisa i ta la. Ne bɛna kuma kɔnɔkɔ la n ka ŋaniya la, i tɛ se k'o lamɛn."

Jara y'a dɔn ko Kɔngɔ bɛ giri, nga a tun bɛna se ka Kɔngɔ ta. A ko aw: "N bɛ se k'i lamɛn. Kuma!"

Kɔngɔ daminɛna ka kuma mɔgɔw bɛɛ tigi kɔnɔ. A ko:
"Mɔgɔ bɛɛ ka kɛ mɔgɔw ye — mɔgɔ ka bon tɛ ka bon don."
"Dugutigiya tɛ tɔgɔ dɔnni la, nga barika dɔnni na."
"Jara ka bon tɛ a ka seli la, nga a yɛrɛ seli la."

Jara tun bɛ fɛɛn minnu kɛ, o bɛɛ Kɔngɔ tun bɛ fɔ a kan.
Loon min na Jara y'a yɛrɛ ye a kɔ na, a daminɛna ka yaala, ka dugu bɛɛ lajɛ ka seli fɔ.

O loon kɔ tɛmɛna, Kɔngɔ tora ka dugu la, ani Jara taara ka hɔrɔn seli nɛgɛn.`,
    traduction: `Il y a longtemps, dans un village, vivaient le Lion et l'Araignée.
Le Lion était très grand et puissant — il prenait tout aux autres.
Un jour, il déclara qu'il allait dévorer l'Araignée, car son nom était grand et son chant ne valait rien.

L'Araignée l'écouta et trouva une ruse.
Elle dit : "Lion, je peux te rendre encore plus fort. Mais mon chant est meilleur que le tien. Je vais parler à l'intérieur de ma toile, tu ne pourras pas m'entendre."

Le Lion savait que l'Araignée était maligne, mais il pensait pouvoir l'attraper. Il dit : "Je peux t'entendre. Parle !"

L'Araignée commença à parler dans le cœur de tous les habitants. Elle dit :
"Tout homme doit être un être humain — la grandeur physique n'est pas la vraie grandeur."
"Le pouvoir ne vient pas de la renommée, mais de la sagesse."
"La puissance du Lion n'est pas dans sa taille, mais en lui-même."

Tout ce que le Lion voulait faire, l'Araignée le disait à sa place.
Le jour où le Lion se reconnut, il commença à errer, traversant tous les villages pour chanter sa honte.

Depuis ce jour, l'Araignée reste dans le village, et le Lion cherche encore sa liberté perdue.`,
    transcription: `Kɔ-rɔn kɔ-nɔ, dɔ loon, Ja-ra ni Kɔn-gɔ tun be du-gu la.
[ko-ron ko-no] [ja-ra] [kon-go]
Mɔgɔ bɛɛ ka kɛ mɔgɔw ye = Tout homme doit être un être humain`,
    niveau: 'A2',
    auteur: 'Tradition orale Mandé',
    sourceEthnique: 'Dioula',
    tags: ['lion', 'araignée', 'ruse', 'sagesse', 'conte classique'],
    dureeMin: 8,
    status: 'PUBLISHED',
  },

  {
    languageId: LANG.baoule,
    type: 'CONTE',
    titre: 'L\'enfant de l\'eau — Ye n\'guessan',
    resume: 'Un enfant mystérieux né de la rivière apporte la pluie à son village en période de sécheresse. Conte initiatique Baoulé.',
    contenu: `Bi blɛ, kɛkɛ dɔ wuli alo n'zué sɔlɛ nin wa.
Waka ti, waka ti, ɔ yɛ n'zué nin wa afin a klɛ klɛ.
Ɔ di kpa kpa, ɔ di kpa kpa — man blɛ kɔ ndɛ fɛ.

Waka ti dɔ, kɛkɛ nga klɛ klɛ, asɔn ti wa lɛ :
"N'gba, n'gba, a man ti wa ?" — N'zué nan wa ndɛ ko mɔ.
Ɔ yɛ man su su lɛ, wulɛ ti ɔ yɛ man kpɔ kpɔ.

Kɛkɛ si wa dɔ, asɔn ti klo blɛ kɔ :
"Waka ti, waka ti, n'zué nan klo blɛ afin bé klɛ klɛ.
N nan wa ndɛ ko mɔ, n nan wa lɛ afiɛn yɛ."

O lɛ kɔ, n'zué wa blɛ dɔ wa. Waka ti klɛ klɛ.
Asɔn ti ɔ yɛ kɛkɛ lɛ dɔ : "Mɔ, mɔ ! Waka, waka !"
Dɛ kɔ, kɛkɛ blɛ n'zué nun lɛ, ɔ man ti wa dɔ.`,
    traduction: `Autrefois, un enfant se leva comme l'eau de la rivière qui monte.
Il marcha longtemps, longtemps, jusqu'à la rivière car elle brillait et brillait.
Il frappa doucement, il frappa doucement — le jour se leva sans nuage.

Longtemps après, l'enfant brillant, le génie vint lui dire :
"Viens, viens, tu n'es pas venu ?" — L'eau de la rivière descendit vers le bas.
Il tomba dans la nuit profonde, le feu le fit brûler doucement.

L'enfant resta là, le génie parla à travers le jour :
"Marche longtemps, longtemps, l'eau de la rivière coule doucement car elle brille.
Je suis descendu vers le bas, je suis venu ici pour toi."

Et alors, l'eau du jour monta. Longtemps il marcha, il brillait.
Le génie dit à l'enfant : "Voilà, voilà ! Marche, marche !"
Depuis lors, l'enfant plongea dans l'eau de la rivière, il était venu pour toujours.`,
    transcription: `N'zué = l'eau (n-zwé)
Kɛkɛ = enfant (kè-kè)
Asɔn = génie de l'eau (a-son)
Waka ti = marche longtemps (wa-ka ti)
Bi blɛ = autrefois / il y a longtemps (bi blè)`,
    niveau: 'B1',
    auteur: 'Tradition orale Akan',
    sourceEthnique: 'Baoulé — région du Centre',
    tags: ['eau', 'enfant', 'génie', 'initiation', 'rivière'],
    dureeMin: 7,
    status: 'PUBLISHED',
  },

  {
    languageId: LANG.bete,
    type: 'CONTE',
    titre: 'Dapleu et le Masque de la Forêt',
    resume: 'Dapleu, jeune chasseur bété, rencontre le masque sacré de la forêt. Il doit passer trois épreuves pour protéger son village.',
    contenu: `Dapleu wɛ gba kpɛ lɛ na, ɔ yi ka nyu ka nyu.
Ka nyu lɛ, ɔ yi ka bɔa, ɔ yi tua ŋwɛ lɛ.
Ŋwɛ lɛ kɔ, gbla dɔ wa : "Dapleu, Dapleu, ɔ yi pa ?"

Dapleu yi sɔ lɛ : "N'yi pa. N yi ka tua i."
Gbla yi kɔ : "I yi ka tua n ? N kɔ n na i dɔ :
I yi dɔ gbla tɛ lɛ, i yi dɔ n'yu tɛ lɛ, i yi dɔ gba tɛ lɛ.
I yi bua o bɛɛ, i yi ta i kɔ, i yi gba ŋgba wa."

Dapleu tun yi sɔ lɛ. Ɔ yi dɔ gbla tɛ lɛ — ɔ yi nyu na.
Ɔ yi dɔ n'yu tɛ lɛ — ɔ yi kɔ bua.
Ɔ yi dɔ gba tɛ lɛ — ɔ yi ta ŋwɛ lɛ gbɔa.

Gbla yi dɔ lɛ : "Dapleu, i seli kɔ. I kɔ gba ŋgba wa,
i kɔ i wɛ ŋgba wa. Ka nyu kɔ, kɔ kɔ, i wɛ nyu yi."`,
    traduction: `Dapleu alla profondément dans la brousse, marchant longtemps.
En marchant longtemps, il entra dans une clairière et trouva un masque.
Le masque parla : "Dapleu, Dapleu, que viens-tu chercher ?"

Dapleu répondit : "Je suis venu. Je suis venu te trouver."
Le masque dit : "Tu es venu me trouver ? Écoute bien ce que je te dis :
Tu traverseras l'épreuve du feu, tu traverseras l'épreuve de l'eau, tu traverseras l'épreuve du vent.
Si tu surmontes tout cela, tu retourneras chez toi, tu protégeras ton village."

Dapleu l'écouta bien. Il traversa l'épreuve du feu — il en sortit vivant.
Il traversa l'épreuve de l'eau — il revint sain et sauf.
Il traversa l'épreuve du vent — il trouva le masque de retour.

Le masque dit : "Dapleu, tu as bien chanté. Retourne dans ton village,
retourne chez les tiens. Longtemps longtemps, les tiens vivront."`,
    transcription: `Dapleu = prénom bété masculin (da-pleu)
Gbla = masque sacré (g-bla)
Ŋwɛ = forêt (n-gwè)
N'yu = eau (n-yu)
Wɛ = village / les siens (wè)`,
    niveau: 'B1',
    auteur: 'Tradition orale Krou',
    sourceEthnique: 'Bété — région du Haut-Sassandra',
    tags: ['masque', 'initiation', 'forêt', 'épreuves', 'chasseur'],
    dureeMin: 9,
    status: 'PUBLISHED',
  },

  // ══════════════ PROVERBES LONGS ══════════════

  {
    languageId: LANG.dioula,
    type: 'PROVERBE_LONG',
    titre: 'Dugu tɛ dugu bolo la — Le village appartient à tous',
    resume: 'Proverbe fondateur de la philosophie communautaire dioula : la responsabilité collective est au cœur du vivre ensemble.',
    contenu: `Dugu tɛ dugu bolo la.
Mɔgɔ kelen tɛ se ka dugu sara.
Mɔgɔ bɛɛ ka barika bɛ dugu sara la.

A fɔ ko : mɔgɔ min bɛ to ka dugu kɛ,
o mɔgɔ min bɛ to ka dugu jɛni,
olu bɛɛ tɛ kelen ye — o bɛɛ ka barika kɛlen don.

Dugu kɛli tɛ dugutig' kan na dɔrɔn.
A bɛ mɔgɔ bɛɛ kan. A bɛ denmisɛnw kan.
Ni mɔgɔ kelen y'a to, a bɛ bon. Ni mɔgɔ bɛɛ y'a to, a bɛ bɔn kosɛbɛ.`,
    traduction: `Le village n'est pas dans la main d'une seule personne.
Une personne seule ne peut pas faire vivre un village.
La force de chacun contribue à faire vivre le village.

On dit : la personne qui construit le village,
et la personne qui protège le village,
ne sont pas la même — mais leurs forces sont unies.

Diriger un village ne relève pas du seul chef.
Cela appartient à tout le monde. Cela appartient aux jeunes.
Si une seule personne l'abandonne, il s'affaiblit. Si tout le monde l'abandonne, il disparaît.`,
    transcription: `Dugu = village (du-gu)
Bolo = main / possession (bo-lo)
Mɔgɔ = personne (mò-go)
Barika = force / énergie (ba-ri-ka)
Sara = nourrir / entretenir (sa-ra)`,
    niveau: 'A1',
    auteur: 'Tradition orale Mandé',
    sourceEthnique: 'Dioula',
    tags: ['communauté', 'village', 'solidarité', 'responsabilité', 'proverbe'],
    dureeMin: 3,
    status: 'PUBLISHED',
  },

  {
    languageId: LANG.baoule,
    type: 'PROVERBE_LONG',
    titre: 'Bi bla su, su bla bi — Le cycle de la vie',
    resume: 'Proverbe baoulé sur l\'alternance naturelle et la sagesse d\'accepter les cycles de l\'existence.',
    contenu: `Bi bla su, su bla bi.
N'ta bla n'ta, wulɛ bla wulɛ.
Asɔn ti wa lɛ, asɔn ti yi wa lɛ.

Kɛkɛ yi wa, kɛkɛ yi yi.
Blɛ yi wa, blɛ yi yi.
O lɛ kɔ, man blɛ kɔ ndɛ ti yi wa.

Sika ti wa, sika ti yi.
N'zué ti wa, n'zué ti yi.
Waka ti klɛ klɛ — ɔ man blɛ fɛ yi.

Mɔ lɛ : i man kpa blɛ kɔ,
afin bi yi wa, su yi wa.
I yi ta i bo, i yi ta i wɛ.`,
    traduction: `Le jour chasse la nuit, la nuit chasse le jour.
La pluie chasse la pluie, le feu chasse le feu.
Le génie vient, le génie repart.

L'enfant vient, l'enfant repart.
Le jour vient, le jour repart.
Et pourtant, chaque jour revient comme au premier matin.

L'or vient, l'or repart.
L'eau vient, l'eau repart.
On marche longtemps — mais le jour de la naissance ne s'efface pas.

Voilà ce qu'on dit : ne pleure pas le jour qui passe,
car le jour reviendra, et la nuit reviendra.
Prends soin de toi, prends soin des tiens.`,
    transcription: `Bi = jour (bi)
Su = nuit (su)
Bla = chasser / remplacer (bla)
N'ta = pluie (n-ta)
Wulɛ = feu (wu-lè)
Asɔn = génie (a-son)`,
    niveau: 'A1',
    auteur: 'Tradition orale Akan',
    sourceEthnique: 'Baoulé — Yamoussoukro',
    tags: ['cycle', 'vie', 'mort', 'sagesse', 'nature', 'temps'],
    dureeMin: 4,
    status: 'PUBLISHED',
  },

  {
    languageId: LANG.senoufo,
    type: 'PROVERBE_LONG',
    titre: 'Ka pεlε ka fɔlɔ — Le travail d\'abord',
    resume: 'Proverbe sénoufo sur la valeur du travail et de l\'effort dans la culture Poro, société initiatique des Sénoufo.',
    contenu: `Ka pεlε ka fɔlɔ, sεnε yi wa kɔ.
Tuo pεlε, kan pεlε, gbɔrɔ pεlε —
ka fɔlɔ bɛɛ, pεlε yi tuo.

Poro kɔ fo : ka pεlε tɛ mɔgɔ yɛrɛ kɔ,
a bɛ mɔgɔ wɛ la kɔ.
Ka fɔlɔ tɛ yɛrɛ la dɔn la dɔrɔn —
a bɛ folo la dɔn la kɔ.

Tuo sε, tuo pεlε.
Kan sε, kan pεlε.
Gbɔrɔ sε, gbɔrɔ pεlε.
Mɔgɔ min bɛ dɔn o bɛɛ — o mɔgɔ ka seli.`,
    traduction: `Travaille d'abord, la récolte viendra après.
Cultive le champ, taille le bois, modèle l'argile —
avant tout, le travail est la clé.

Le Poro enseigne : le travail n'est pas pour soi seul,
il est pour le bien des tiens.
La priorité n'est pas de se connaître soi-même seulement —
c'est de connaître sa communauté.

Porte le poids, travaille le poids.
Coupe le bois, travaille le bois.
Modèle l'argile, travaille l'argile.
L'homme qui sait tout cela — celui-là chante bien la vie.`,
    transcription: `Ka pεlε = travaille (ka pè-lè)
Ka fɔlɔ = d'abord (ka fò-lo)
Sεnε = agriculture / récolte (sè-nè)
Tuo = champ (tu-o)
Poro = société initiatique des Sénoufo (po-ro)
Gbɔrɔ = argile (g-bò-ro)`,
    niveau: 'A2',
    auteur: 'Tradition Poro — Sénoufo',
    sourceEthnique: 'Sénoufo — Korhogo',
    tags: ['travail', 'Poro', 'initiation', 'communauté', 'agriculture'],
    dureeMin: 4,
    status: 'PUBLISHED',
  },

  // ══════════════ LÉGENDES ══════════════

  {
    languageId: LANG.baoule,
    type: 'LEGENDE',
    titre: 'Abla Pokou et le sacrifice de la Comoé',
    resume: 'La légende fondatrice du peuple Baoulé : la reine Abla Pokou sacrifie son fils pour traverser la rivière Comoé et fonder son peuple.',
    contenu: `Blɛ kɔ sa, asɔn kɛkɛ klɛ Abla Pokou man na.
Abla Pokou, man waka, man yi gba su la.
N'zué Comoé ti wa, ti wa, ti wa lɛ — man ti yi wa dɔ.

Asɔn ti wa man kɔ : "Abla Pokou, n'zué ti man klɛ klɛ.
I man yi waka, i man yi ta i wɛ.
I man yi dɔ n'zué ti asɔn ti i bo fɛ lɛ."

Abla Pokou yi ta a kɛkɛ lɛ. A yi kpa kpa.
A yi ta a bo fɛ lɛ, n'zué ti wa klɛ klɛ.
A man yi waka su lɛ. A yi ta a wɛ lɛ gba dɔ.

A man yi fɔ : "Ba-ou-lé !" — N'zué ko waka, waka.
O lɛ kɔ, man wɛ ti yi kɔ "Baoulé" lɛ —
afin n'zué yi man bo ba lɛ : man ba yi man.`,
    traduction: `Il y a très longtemps, le génie de l'eau apparut à Abla Pokou en rêve.
Abla Pokou, reine en fuite, marchait dans la nuit profonde.
La rivière Comoé montait, montait, montait — elle ne voulait pas s'arrêter.

Le génie vint lui dire : "Abla Pokou, la rivière ne brillera plus.
Ton peuple ne marchera plus, ton peuple ne sera plus sauvé.
Ton peuple devra donner à la rivière son génie le plus précieux."

Abla Pokou prit son fils unique. Elle frappa doucement.
Elle le donna à la rivière, et l'eau se mit à briller doucement.
Son peuple traversa dans la nuit. Elle sauva les siens.

Elle cria : "Ba-ou-lé !" — La rivière coula, coula.
Et depuis, ce peuple s'appelle "Baoulé" —
car la rivière a coûté un fils : son fils lui fut pris.`,
    transcription: `Abla Pokou = reine fondatrice des Baoulé (ab-la po-kou)
N'zué = rivière / eau (n-zwé)
Asɔn = génie (a-son)
Kɛkɛ = enfant (kè-kè)
Ba-ou-lé = "l'enfant est mort" en langue Akan (ba-ou-lé)`,
    niveau: 'B1',
    auteur: 'Tradition orale Akan',
    sourceEthnique: 'Baoulé — fondation du peuple',
    tags: ['Abla Pokou', 'fondation', 'sacrifice', 'Comoé', 'histoire baoulé', 'légende'],
    dureeMin: 10,
    status: 'PUBLISHED',
  },

  {
    languageId: LANG.guere,
    type: 'LEGENDE',
    titre: 'Gbeu le Guerrier aux Mille Visages',
    resume: 'Légende guéré du guerrier Gbeu qui portait un masque différent pour chaque épreuve. Fondement de la culture masquée des Krou.',
    contenu: `Gbeu wɛ pɛ lɛ na, ɔ yi ka nɛ nɛ.
Ka nɛ nɛ lɛ, gbla kɛkɛ yi wa : "Gbeu, Gbeu, i yi pa ?"
Gbeu yi sɔ : "N yi pa. N yi ka tua gbla."

Gbla yi kɔ : "N bɛ gbla bɔa i ma. Gbla kelen yi i dɔ —
i yi ta gbla min, i yi kɛ min."
Gbeu yi ta gbla kelen lɛ : a yi kɛ zɛ zɛ.
Gbeu yi ta gbla fila lɛ : a yi kɛ gbɔ gbɔ.
Gbeu yi ta gbla saba lɛ : a yi kɛ bɔa bɔa.

Ka bɔa bɔa lɛ, mɔgɔ bɛɛ yi wuli :
"Gbeu kɔ gbla bɛɛ ta ! Gbeu kɔ a wɛ sara !"
O lɛ kɔ, gbla yi kɔ Gbeu man wɛ la —
gbla tɛ mɔgɔ kelen bo dɔrɔn, a bɛ wɛ la bɛɛ bo.`,
    traduction: `Gbeu sortit au bord de la forêt, il marchait silencieusement.
En marchant silencieusement, un masque enfant vint : "Gbeu, Gbeu, que cherches-tu ?"
Gbeu répondit : "Je suis venu. Je suis venu chercher le masque."

Le masque dit : "Je vais te donner des masques. Un masque te sera donné —
le masque que tu prends, c'est toi que tu deviens."
Gbeu prit le premier masque : il devint rapide comme l'éclair.
Gbeu prit le deuxième masque : il devint fort comme le buffle.
Gbeu prit le troisième masque : il devint doux comme la paix.

Quand la paix fut là, tout le peuple se leva :
"Gbeu a pris tous les masques ! Gbeu a nourri son peuple !"
Et depuis lors, le masque protège le peuple de Gbeu —
le masque n'appartient pas à une seule personne, il appartient à tous.`,
    transcription: `Gbeu = prénom guéré masculin (g-beu)
Gbla = masque sacré (g-bla)
Wɛ = peuple / village (wè)
Nɛ nɛ = silencieusement (nè nè)
Zɛ zɛ = rapide comme l'éclair (zè zè)`,
    niveau: 'B2',
    auteur: 'Tradition orale Krou',
    sourceEthnique: 'Guéré — Man / Danané',
    tags: ['masque', 'guerrier', 'initiation', 'forêt', 'identité', 'krou'],
    dureeMin: 10,
    status: 'PUBLISHED',
  },

  // ══════════════ CHANSONS ══════════════

  {
    languageId: LANG.nouchi,
    type: 'CHANSON',
    titre: 'Côte d\'Ivoire on est là — Hymne urbain',
    resume: 'Chanson Nouchi célébrant la fierté ivoirienne, l\'amour d\'Abidjan et l\'esprit de résilience de la jeunesse.',
    contenu: `Refrain :
Côte d'Ivoire on est là, on est là !
Dieu a pour tout ce que les dieux ont fait !
On est chaud, on est chaud, pays à nous !
Abidjan la belle, on l'aime trop !

Couplet 1 :
Nous on vient de Yopougon, Cocody, Abobo,
Treichville en bas, Marcory en haut.
Faut pas fâcher quand tu vois comment on fait —
C'est la vie de chez nous, c'est notre kiff.
On tchepe pas, on dégage pas —
On reste debout, Côte d'Ivoire na !

Couplet 2 :
Gbê gbê, on est set set dans la ruelle,
On connait le chemin depuis tout petit.
Dieu a les anciens, Dieu a les jeunes aussi.
Wari peut partir, wari peut revenir —
Mais le cœur de l'ivoirien, ça fout pas le camp !

Pont :
Akwaba à toi qui viens de loin !
Akwaba dans notre Côte à nous !
On est soudés comme le fer au feu —
Côte d'Ivoire forever, c'est chez nous !`,
    traduction: `Refrain :
Côte d'Ivoire nous sommes là, nous sommes là !
Merci à Dieu pour tout ce qu'il a fait !
Nous sommes fougueux, fougueux, notre pays !
Abidjan la belle, nous l'aimons tellement !

Couplet 1 :
Nous venons de Yopougon, Cocody, Abobo,
Treichville en bas, Marcory en haut.
Ne t'énerve pas quand tu vois notre façon de faire —
C'est la vie chez nous, c'est notre passion.
On ne fuit pas, on ne part pas —
On reste debout, c'est notre Côte d'Ivoire !

Couplet 2 :
En plein jour, nous sommes bien habillés dans la ruelle,
Nous connaissons le chemin depuis tout petits.
Merci pour les anciens, merci pour les jeunes aussi.
L'argent peut partir, l'argent peut revenir —
Mais le cœur de l'Ivoirien, lui, ne s'en va jamais !

Pont :
Bienvenue à toi qui viens de loin !
Bienvenue dans notre Côte d'Ivoire !
Nous sommes soudés comme le fer dans le feu —
Côte d'Ivoire pour toujours, c'est chez nous !`,
    transcription: `Dieu a = Merci à Dieu (expression de gratitude)
Faut pas fâcher = Ne t'énerve pas
Tchepe pas = Ne fuis pas / Ne renonce pas
Dégage pas = Ne pars pas
Set set = Bien habillé / élégant
Wari = Argent (du bambara)
Akwaba = Bienvenue (en twi/baoulé)
Gbê gbê = En plein jour / ouvertement`,
    niveau: 'A1',
    auteur: 'Collectif jeunesse Abidjan',
    sourceEthnique: 'Nouchi — Abidjan',
    tags: ['Abidjan', 'fierté', 'jeunesse', 'hymne', 'nouchi', 'identité'],
    dureeMin: 5,
    status: 'PUBLISHED',
  },

  {
    languageId: LANG.dioula,
    type: 'CHANSON',
    titre: 'Furu Donkili — Chant de mariage Dioula',
    resume: 'Chant traditionnel dioula entonné lors des cérémonies de mariage. Il célèbre l\'union, la famille et la bénédiction des ancêtres.',
    contenu: `Furu donkili, furu donkili !
O kɔ, o kɔ, a bɛ se !
Wari ye, wari ye — a bɛna se !

Kɔrɔ fɔra : furuw ka kɛ dɔ ye,
mɔgɔ fila ka taama kelen na.
Ka tobi, ka tobi, ka taama bɛɛ kɛ —
ni Ala sɔnna, olu bɛna se dɔ la.

Ka bɔ ka taa ! Furu donkili !
Mɔgɔw bɛɛ ka nɔ kɛ !
Denmisɛnw ka taga fɔ !
O kɔ, o kɔ, furu bɛ se !

Musow ka don ! Cɛw ka don !
Furu kosɛbɛ, furu kosɛbɛ !
Ala ka barika di furuw ma !
Ka nɔ kɛ, ka nɔ kɛ — furu bɛ diya !`,
    traduction: `Chant de mariage, chant de mariage !
C'est fait, c'est fait, cela réussira !
Avec des cadeaux, avec des cadeaux — cela réussira !

Les anciens ont dit : que l'union soit une seule chose,
que deux personnes marchent sur le même chemin.
Préparer, préparer, accomplir tout ce chemin —
si Dieu le permet, ils réussiront ensemble.

Partons ! Chant de mariage !
Que tout le monde se réjouisse !
Que les jeunes célèbrent !
C'est fait, c'est fait, le mariage réussit !

Que les femmes dansent ! Que les hommes dansent !
Vraiment mariage, vraiment mariage !
Que Dieu bénisse les mariés !
Réjouissons-nous, réjouissons-nous — le mariage sera beau !`,
    transcription: `Furu = mariage (fu-ru)
Donkili = chant (don-ki-li)
Furuw = les mariés (fu-ruw)
Ala = Dieu (a-la)
Barika = bénédiction / force (ba-ri-ka)
Mɔgɔ fila = deux personnes (mò-go fi-la)
Denmisɛnw = les jeunes / enfants (den-mi-sèn-w)`,
    niveau: 'A1',
    auteur: 'Tradition orale Mandé',
    sourceEthnique: 'Dioula — tout le Nord',
    tags: ['mariage', 'cérémonie', 'fête', 'bénédiction', 'tradition', 'chanson'],
    dureeMin: 5,
    status: 'PUBLISHED',
  },

  // ══════════════ RÉCITS / HISTOIRES ══════════════

  {
    languageId: LANG.baoule,
    type: 'RECIT',
    titre: 'Les masques Goli — Gardiens de la paix Baoulé',
    resume: 'Récit sur les masques Goli baoulé, leur rôle spirituel, les cérémonies et leur signification dans la société akan.',
    contenu: `Goli ti wa blɛ kɔ sa waka. Goli ti yi man wɛ sara.
Kɛkɛ Goli ti wa fɔlɔ : asɔn ti yi man klɛ klɛ.
Goli fila ti wa kɔ : man yi ta su lɛ.
Goli saba ti wa kɔ : man yi ta bi lɛ.

Bi bla su, su bla bi — Goli ti wa, Goli ti yi.
Asɔn ti man klɛ klɛ afin Goli ti yi man wɛ la.
Man wɛ ti yi ta Goli ti bo fɛ : su ti wa, bi ti wa.

Goli ti man dɔ : waka ti man wɛ la, waka ti man wɛ su la.
Kɛkɛ min yi wa : a yi ta Goli ti lɛ dɔ.
Blɛ kɔ sa, Goli ti man wɛ ti yi ta klɛ klɛ.`,
    traduction: `Les masques Goli existent depuis la nuit des temps. Les Goli nourrissaient le peuple.
Le premier masque Goli vint : le génie de l'eau brillait doucement.
Le deuxième Goli vint : le peuple prit la nuit avec lui.
Le troisième Goli vint : le peuple prit le jour avec lui.

Le jour chasse la nuit, la nuit chasse le jour — les Goli viennent, les Goli repartent.
Le génie de l'eau brille doucement parce que les Goli protègent le peuple.
Le peuple prend les Goli avec lui : la nuit vient, le jour vient.

Les Goli le savent : ils accompagnent le peuple dans la vie et dans la mort.
L'enfant qui vient : il reçoit le regard du Goli.
Il y a très longtemps, les Goli ont rendu le peuple brillant.`,
    transcription: `Goli = masque sacré baoulé (go-li)
Asɔn = génie (a-son)
N'zué = eau (n-zwé)
Wɛ = peuple (wè)
Blɛ kɔ sa = il y a très longtemps (blè ko sa)`,
    niveau: 'B2',
    auteur: 'Tradition orale Akan',
    sourceEthnique: 'Baoulé — Bouaké / Yamoussoukro',
    tags: ['masque', 'Goli', 'cérémonie', 'spiritualité', 'baoulé', 'akan'],
    dureeMin: 8,
    status: 'PUBLISHED',
  },

  {
    languageId: LANG.senoufo,
    type: 'HISTOIRE',
    titre: 'Le Poro — La société des initiés de Korhogo',
    resume: 'Histoire de la société initiatique Poro des Sénoufo, pilier de la transmission du savoir et de la gouvernance communautaire.',
    contenu: `Poro kɔ sa waka sεnε la.
Ka pεlε ka fɔlɔ — Poro yi o fo mɔgɔw ma.
Tuo pεlε, kan pεlε, gbɔrɔ pεlε —
ka bɛɛ, Poro yi mɔgɔw dɔn.

Kɛkɛ yi wa Poro la, a yi ta sεnε lɛ.
A yi dɔn : ka pεlε, kan pεlε, gbɔrɔ pεlε.
Nbalifolo yi wa kɔ : kɛkɛ yi kɛ mɔgɔ.
Mɔgɔ yi wa kɔ : a yi kɛ kɔrɔ.

Kɔrɔ yi wa kɔ : a yi kɛ Poro fo mɔgɔ.
Poro fo mɔgɔ yi wa kɔ : a yi fo mɔgɔ kɛkɛw ma.
O kɔ kɔ kɔ — Poro ti taama ye.
Ka pεlε ka fɔlɔ, sεnε yi wa kɔ.`,
    traduction: `Le Poro existe depuis la nuit des temps dans l'agriculture.
Travaille d'abord — c'est ce que le Poro enseigne aux gens.
Cultive le champ, coupe le bois, modèle l'argile —
en tout cela, le Poro instruit les gens.

L'enfant entrait dans le Poro, il recevait l'enseignement.
Il apprenait : travailler le champ, couper le bois, modèle l'argile.
La cérémonie Nbalifolo venait alors : l'enfant devenait homme.
L'homme venait ensuite : il devenait aîné.

L'aîné venait enfin : il devenait porte-parole du Poro.
Le porte-parole du Poro venait alors : il instruisait les jeunes.
Et ainsi de suite — telle est la marche du Poro.
Travaille d'abord, la récolte viendra après.`,
    transcription: `Poro = société initiatique des Sénoufo (po-ro)
Nbalifolo = cérémonie de passage (n-ba-li-fo-lo)
Ka pεlε = travaille (ka pè-lè)
Sεnε = agriculture / récolte (sè-nè)
Kɔrɔ = aîné (kò-ro)
Gbɔrɔ = argile / poterie (g-bò-ro)`,
    niveau: 'B1',
    auteur: 'Tradition Poro — Sénoufo',
    sourceEthnique: 'Sénoufo — Korhogo / Boundiali',
    tags: ['Poro', 'initiation', 'Korhogo', 'sénoufo', 'transmission', 'histoire'],
    dureeMin: 9,
    status: 'PUBLISHED',
  },

  // ══════════════ DESCRIPTIONS ══════════════

  {
    languageId: LANG.dioula,
    type: 'DESCRIPTION',
    titre: 'Le Grand Marché de Bouaké — Zankasso',
    resume: 'Description vivante du marché central de Bouaké, cœur commercial du pays et lieu de brassage des langues et cultures ivoiriennes.',
    contenu: `Bouaké zankasso — o ye Côte d'Ivoire dugu kɔrɔ ye.
Tile kɔrɔ, mɔgɔw bɛ se zankasso la ka fɛn ye.
Fenw bɛɛ bɛ yen : jiriw, jɔgow, dɛgɛw, lajiw.

Mɔgɔ ka bɛ fɔ : "I ni tile ! I bo mun ?" — "N bɛ bo dɛgɛ."
"Jɔgo jɛlen ye min ye ?" — "Kilo ye kɔbɔri saba."
Ka sɔn cogo di ? Ka ta fɛn min, ka wari san !

Zankasso la, kuma bɛ kɛ Dioula la, Baoulé la, Français la.
Mɔgɔ min bɛ dɔn Dioula, a bɛ se ka fɛn sɔrɔ.
Dioula tɛ dugu kelen kan dɔrɔn — a bɛ dugu bɛɛ kan.

Tile lɔ, mɔgɔw bɛ segin soo la.
Wari bɛ taama, fɛnw bɛ taama.
Zankasso bɛ ɲɛ tile o tile — o ye Côte d'Ivoire ye.`,
    traduction: `Le grand marché de Bouaké — c'est le cœur commercial de la Côte d'Ivoire.
Chaque matin, les gens arrivent au marché pour voir les marchandises.
On y trouve de tout : légumes, viandes, poissons, épices.

On entend : "Bonjour ! Tu cherches quoi ?" — "Je cherche du poisson."
"À combien est la viande fraîche ?" — "Le kilo est à trois cents francs."
Comment négocier ? Prends ce que tu veux, offre un prix juste !

Au marché, on parle Dioula, Baoulé, Français.
Celui qui connaît le Dioula peut tout obtenir.
Le Dioula n'est pas la langue d'une seule ville — il est la langue de tout le pays.

Le soir, les gens rentrent chez eux.
L'argent circule, les marchandises circulent.
Le marché s'ouvre chaque jour — c'est cela, la Côte d'Ivoire.`,
    transcription: `Zankasso = grand marché (zan-kas-so)
Tile = jour / matin (ti-le)
Fɛn = marchandise / chose (fèn)
Jɔgo = viande (jò-go)
Dɛgɛ = poisson (dè-gè)
I ni tile = Bonjour (i ni ti-le)
Wari = argent (wa-ri)`,
    niveau: 'A2',
    auteur: 'Description culturelle Dioula',
    sourceEthnique: 'Dioula — Bouaké',
    tags: ['marché', 'Bouaké', 'commerce', 'vie quotidienne', 'description', 'dioula'],
    dureeMin: 6,
    status: 'PUBLISHED',
  },

  {
    languageId: LANG.agni,
    type: 'DESCRIPTION',
    titre: 'La Fête des Ignames Agni — Npinzan',
    resume: 'Description de la fête traditionnelle des ignames (Npinzan) chez les Agni de l\'Est : rituels, danses et remerciements aux ancêtres.',
    contenu: `Npinzan yi wa bla bɔ lɛ. O yi kɛ blɛ kɔ sa dɔ.
Man wɛ ti yi ta igname ti bo fɛ : wɛ ti yi kpa kpa asɔn ti ma.
"Dieu a, Dieu a !" — man yi fo asɔn kɔrɔw ma.

Kɛkɛw yi don. Musow yi don. Cɛw yi don.
Gbɔ ti yi wa — man yi ta su lɛ, man yi ta bi lɛ.
N'zué ti yi wa — man yi ta n'ta lɛ.

Igname fɔlɔ ti wa : "Akwaba ! Akwaba !" man yi fo.
Man kɔrɔw yi wa : man yi ta igname ti lɛ dɔ.
"Ka Dieu a ! Ka Dieu a !" — man yi fo a ma.

Npinzan ti wa, Npinzan ti yi.
Man wɛ ti yi ta bo fɛ lɛ klɛ klɛ.
Bi bla su — Npinzan ti wa yi wa lɛ man ma.`,
    traduction: `La fête des ignames (Npinzan) arrive après la récolte. Cela se passe depuis très longtemps.
Le peuple prend les premières ignames : le peuple les offre doucement aux génies.
"Merci à Dieu, merci à Dieu !" — on crie ainsi aux anciens génies.

Les enfants dansent. Les femmes dansent. Les hommes dansent.
Le buffle arrive — il prend la nuit avec lui, il prend le jour avec lui.
La rivière arrive — elle prend la pluie avec elle.

La première igname arrive : "Bienvenue ! Bienvenue !" le peuple crie.
Les anciens du peuple arrivent : ils reçoivent l'igname.
"Merci à Dieu ! Merci à Dieu !" — on leur dit cela.

La Npinzan vient, la Npinzan repart.
Le peuple en sort brillant et radieux.
Le jour chasse la nuit — la Npinzan viendra encore à leur peuple.`,
    transcription: `Npinzan = fête des ignames (n-pin-zan)
Akwaba = bienvenue (ak-wa-ba)
Dieu a = merci à Dieu (expression de gratitude akan)
Igname = tubercule sacré (i-gna-me)
Asɔn = génie / ancêtre (a-son)
N'ta = pluie (n-ta)`,
    niveau: 'B1',
    auteur: 'Tradition orale Akan',
    sourceEthnique: 'Agni — Abengourou / Bondoukou',
    tags: ['igname', 'Npinzan', 'fête', 'récolte', 'ancêtres', 'agni', 'tradition'],
    dureeMin: 7,
    status: 'PUBLISHED',
  },

  {
    languageId: LANG.gouro,
    type: 'RECIT',
    titre: 'Zamblé — Le Masque Danseur des Gouro',
    resume: 'Récit sur le Zamblé, masque emblématique du peuple Gouro. Sa danse symbolise la communication entre le monde des vivants et celui des esprits.',
    contenu: `Zamblé yi wa sa waka. A yi kɛ Gouro wɛ bo.
Zamblé tɛ mɔgɔ kelen bo — a bɛ wɛ la bɛɛ bo.
Kɛkɛ min bɛ don Zamblé bo la, a tɛ mɔgɔ kelen ye tun.

Zamblé don daminɛna : tile bla, su bla.
A don daminɛna : n'zué bla, taa bla.
A don daminɛna : kɔrɔw ka ta kɛkɛw ka.

Gouro wɛ fo : "Zamblé bɛ na ! Zamblé bɛ na !"
Mɔgɔw bɛɛ segin Zamblé kan.
Zamblé yi don — a bɛ kuma asɔnw fɛ.

Tile kɔrɔ Zamblé don tuma, mɔgɔw bɛɛ sɔrɔ hɛrɛ.
Wɛ bɛ kɛ dɔ ye — Zamblé bɛ o kɛ.
Ka Dieu a Zamblé ma — a bɛ wɛ sara.`,
    traduction: `Le Zamblé existe depuis la nuit des temps. Il est né du peuple Gouro.
Le Zamblé n'appartient pas à une seule personne — il appartient à tout le peuple.
L'enfant qui danse sous le masque Zamblé n'est plus une personne ordinaire.

La danse du Zamblé commence : le jour passe, la nuit passe.
Sa danse commence : la rivière passe, le vent passe.
Sa danse commence : les anciens transmettent aux jeunes.

Le peuple Gouro crie : "Le Zamblé vient ! Le Zamblé vient !"
Tout le monde converge vers le Zamblé.
Le Zamblé danse — il parle avec les esprits.

Chaque matin où le Zamblé danse, tout le peuple trouve la paix.
Le peuple devient un — c'est ce que fait le Zamblé.
Merci à Dieu pour le Zamblé — il nourrit le peuple.`,
    transcription: `Zamblé = masque emblématique des Gouro (zam-blé)
Wɛ = peuple (wè)
Asɔn = esprit / génie (a-son)
Hɛrɛ = paix (hè-rè)
N'zué = rivière (n-zwé)
Taa = vent (ta-a)`,
    niveau: 'B1',
    auteur: 'Tradition orale Mandé Sud',
    sourceEthnique: 'Gouro — Zuénoula / Bouaflé',
    tags: ['Zamblé', 'masque', 'danse', 'gouro', 'esprits', 'cérémonie', 'identité'],
    dureeMin: 8,
    status: 'PUBLISHED',
  },
];

// ─── Helper HTTP ───────────────────────────────────────────────────────────────

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Authentification
  console.log('🔐 Authentification...');
  const authBody = JSON.stringify({ email: 'admin@languesivoire.ci', motDePasse: 'Admin@2026!' });
  const authRes = await request({
    hostname: API, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(authBody) },
  }, authBody);

  if (!authRes.body.accessToken) {
    console.error('❌ Authentification échouée', authRes.body);
    process.exit(1);
  }
  const token = authRes.body.accessToken;
  console.log('✅ Connecté comme SUPER_ADMIN\n');

  // 2. Insertion des textes
  let ok = 0, fail = 0;
  for (const texte of TEXTES) {
    const payload = JSON.stringify(texte);
    const res = await request({
      hostname: API, path: '/api/text-contents/admin', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${token}`,
      },
    }, payload);

    if (res.status === 201 || res.status === 200) {
      console.log(`✅ [${texte.type}] ${texte.titre}`);
      ok++;
    } else {
      console.error(`❌ [${texte.type}] ${texte.titre} → ${res.status}`, JSON.stringify(res.body).slice(0, 200));
      fail++;
    }

    // Pause pour éviter le rate-limiting
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n═══════════════════════════════`);
  console.log(`✅ ${ok} texte(s) insérés avec succès`);
  if (fail > 0) console.log(`❌ ${fail} échec(s)`);
  console.log(`═══════════════════════════════`);
}

main().catch(console.error);
