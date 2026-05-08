/**
 * avatarPrompts.js — Prompts de génération pour les 16 avatars × 3 états
 *
 * Usage Midjourney  : /imagine [prompt] --ar 1:1 --style raw --v 6
 * Usage DALL-E 3    : coller le prompt dans l'interface OpenAI
 * Usage Stable Diff : use prompt as positive, add negative: "text, watermark, cartoon, 3d render, ugly"
 *
 * Les 3 états par avatar :
 *   NEUTRE  → apprentissage quotidien, accueil, leçons normales
 *   JOYEUX  → félicitations, badge débloqué, score parfait, XP gagné
 *   SERIEUX → module S.O.S., urgence, exercice difficile
 *
 * Noms définitifs validés (tableau v5 — avril 2026) :
 *   Koffi, Aya | Amara, Djénéba | Yoro, Ozoua | Dolourou, Tialagnon
 *   Kadio, Tehia | Zan Bi, Tra Lou | Oulahi, Bleka | Pololo, Nache
 */

// ── Modificateurs d'état (injectés à la place de [ÉTAT]) ────────────────────
export const ETATS = {
  neutre: `with a calm and welcoming facial expression, a very slight warm smile, \
standing in a neutral position, facing forward, arms relaxed at his/her sides, showing hands`,

  joyeux: `with a very joyful and broad smile, eyes sparkling with happiness, \
giving a friendly thumbs up with one hand while the other remains at the side, \
radiating warmth and encouragement`,

  serieux: `with a very serious, focused, and reassuring facial expression, \
looking directly at the camera with concern and readiness, \
posture is firm and confident, arms relaxed at sides`,
};

// ── Suffixe technique commun ─────────────────────────────────────────────────
const SUFFIX = `pure white background, modern African digital illustration style, \
clean precise lines, full body visible from head to toe, \
high quality, 2D flat illustration, no text, no watermark`;

// ── Générateur de prompt ─────────────────────────────────────────────────────
function p(base, etat) {
  return `${base.replace('[ÉTAT]', ETATS[etat])}, ${SUFFIX}`;
}

// ── Les 16 avatars ────────────────────────────────────────────────────────────
const BASE_PROMPTS = {

  // ═══════════════════════════════════════════════════════════════
  // 1. BAOULÉ — Aire Akan · Centre · Vallée du Bandama
  // ═══════════════════════════════════════════════════════════════
  koffi: {
    id: 'koffi',
    nom: 'Koffi',
    genre: 'M',
    langue: 'Baoulé',
    description: 'Sage tisseur de 55 ans, village de Bouaflé',
    base: `Full-body digital illustration of Koffi, a noble and serene Baoulé man \
around 55 years old, wearing a colorful orange and gold Kita kente cloth draped \
over one shoulder, grey temples, kind eyes, traditional leather sandals, [ÉTAT]`,
  },

  aya: {
    id: 'aya',
    nom: 'Aya',
    genre: 'F',
    langue: 'Baoulé',
    description: 'Tisserande noble de 42 ans, Sakassou',
    base: `Full-body digital illustration of Aya, a graceful Baoulé woman around 42 years old, \
wearing a prestigious orange and gold Kita woven cloth elegantly wrapped around her chest, \
a gold headband and fine Akan jewelry, confident posture, [ÉTAT]`,
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. DIOULA — Aire Mandé · Nord & National · Kong, Bouaké
  // ═══════════════════════════════════════════════════════════════
  amara: {
    id: 'amara',
    nom: 'Amara',
    genre: 'M',
    langue: 'Dioula',
    description: 'Commerçant de tissus dynamique, 38 ans, Bouaké',
    base: `Full-body digital illustration of Amara, a dynamic and friendly Dioula man \
around 38 years old, wearing a grand white and royal blue embroidered boubou \
with elaborate chest embroidery and a matching chéchia cap, warm smile energy, [ÉTAT]`,
  },

  djeneba: {
    id: 'djeneba',
    nom: 'Djénéba',
    genre: 'F',
    langue: 'Dioula',
    description: 'Commerçante de pagnes, 32 ans, Bouaké',
    base: `Full-body digital illustration of Djénéba, an elegant and lively Dioula woman \
around 32 years old, wearing a vibrant multicolor embroidered boubou with a stylishly \
tied matching headscarf (gele), carrying a small wax-print bag, [ÉTAT]`,
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. BÉTÉ — Aire Krou · Ouest · Gagnoa, Soubré
  // ═══════════════════════════════════════════════════════════════
  yoro: {
    id: 'yoro',
    nom: 'Yoro',
    genre: 'M',
    langue: 'Bété',
    description: 'Conteur traditionnel fier, 45 ans, Gagnoa',
    base: `Full-body digital illustration of Yoro, a proud and expressive Bété man \
around 45 years old, wearing a traditional brown and terracotta geometric Tapa \
bark cloth draped like a toga over one shoulder, carved wooden bead necklace, \
strong build, [ÉTAT]`,
  },

  ozoua: {
    id: 'ozoua',
    nom: 'Ozoua',
    genre: 'F',
    langue: 'Bété',
    description: 'Herboriste et guérisseuse, 38 ans, Gagnoa',
    base: `Full-body digital illustration of Ozoua, a gentle and wise Bété woman \
around 38 years old, wearing a heavy hand-woven traditional pagne with bold \
Krou geometric patterns, a basket of healing herbs on one arm, \
natural leaf-and-seed jewelry, [ÉTAT]`,
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. SÉNOUFO — Aire Voltaïque · Nord · Korhogo, Ferkessédougou
  // ═══════════════════════════════════════════════════════════════
  dolourou: {
    id: 'dolourou',
    nom: 'Dolourou',
    genre: 'M',
    langue: 'Sénoufo',
    description: 'Maître sculpteur Poro, 58 ans, Korhogo',
    base: `Full-body digital illustration of Dolourou, a wise and dignified Sénoufo \
elder man around 58 years old, wearing a handwoven cream Korhogo cloth tunic \
with intricate black animal and geometric motifs, holding a carved wooden staff, \
a straw farmer hat on his head, deeply etched face with wisdom, [ÉTAT]`,
  },

  tialagnon: {
    id: 'tialagnon',
    nom: 'Tialagnon',
    genre: 'F',
    langue: 'Sénoufo',
    description: 'Femme-pythone Sandogo, 50 ans, Korhogo',
    base: `Full-body digital illustration of Tialagnon, a powerful and serene Sénoufo \
woman around 50 years old, wearing a beautiful Korhogo cloth ensemble with \
traditional hand-painted black animal motifs on white fabric, \
a string of sacred cowries around her neck, aura of spiritual authority, [ÉTAT]`,
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. AGNI — Aire Akan · Est · Abengourou, Agnibilékrou
  // ═══════════════════════════════════════════════════════════════
  kadio: {
    id: 'kadio',
    nom: 'Kadio',
    genre: 'M',
    langue: 'Agni',
    description: 'Noble conseiller du roi, 45 ans, Abengourou',
    base: `Full-body digital illustration of Kadio, a distinguished Agni noble man \
around 45 years old, wearing a rich deep red and gold Akan kente cloth draped \
over his shoulder, multiple gold ring ornaments, regal upright posture, \
an air of courtly diplomacy, [ÉTAT]`,
  },

  tehia: {
    id: 'tehia',
    nom: 'Tehia',
    genre: 'F',
    langue: 'Agni',
    description: 'Tisserande de la cour royale, 35 ans, Abengourou',
    base: `Full-body digital illustration of Tehia, a refined and elegant Agni noblewoman \
around 35 years old, wearing a luxurious traditional pagne with elaborate \
Akan gold jewelry including heavy necklace and arm cuffs, \
a delicately wrapped headtie, graceful and aristocratic bearing, [ÉTAT]`,
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. GOURO — Aire Mandé Sud · Centre-Ouest · Zuénoula, Daloa
  // ═══════════════════════════════════════════════════════════════
  zan_bi: {
    id: 'zan_bi',
    nom: 'Zan Bi',
    genre: 'M',
    langue: 'Gouro',
    description: 'Agriculteur et danseur Zaouli, 40 ans, Zuénoula',
    base: `Full-body digital illustration of Zan Bi, a vibrant and humble Gouro man \
around 40 years old, wearing bright traditional attire with geometric patterns \
inspired by the Zaouli mask dance, a small hand drum at his side, \
barefoot and grounded, [ÉTAT]`,
  },

  tra_lou: {
    id: 'tra_lou',
    nom: 'Tra Lou',
    genre: 'F',
    langue: 'Gouro',
    description: 'Gardienne du masque Zaouli, 30 ans, Zuénoula',
    base: `Full-body digital illustration of Tra Lou, a graceful and dynamic Gouro woman \
around 30 years old, wearing a colorful handmade pagne with Zaouli-inspired \
floral and geometric patterns, multicolored handcrafted beads, \
dancer's lightness in her posture, [ÉTAT]`,
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. GUÉRÉ — Aire Krou · Ouest · Forêt de Taï, Man
  // ═══════════════════════════════════════════════════════════════
  oulahi: {
    id: 'oulahi',
    nom: 'Oulahi',
    genre: 'M',
    langue: 'Guéré',
    description: 'Chasseur courageux de la forêt de Taï, 42 ans',
    base: `Full-body digital illustration of Oulahi, a strong and courageous Guéré man \
around 42 years old, wearing traditional Krou warrior-style attire with \
animal skin details and bold chest markings, a hunter's woven bag across \
his chest, powerful and direct gaze, [ÉTAT]`,
  },

  bleka: {
    id: 'bleka',
    nom: 'Bleka',
    genre: 'F',
    langue: 'Guéré',
    description: 'Herboriste de la forêt de Taï, 36 ans',
    base: `Full-body digital illustration of Bleka, a serene and knowledgeable Guéré woman \
around 36 years old, wearing traditional Krou woven cloth parures with \
forest-seed jewelry and leaf ornaments in her hair, \
a small bundle of medicinal plants in one hand, calm forest spirit energy, [ÉTAT]`,
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. NOUCHI — Culture urbaine · Abidjan · Yopougon, Cocody
  // ═══════════════════════════════════════════════════════════════
  pololo: {
    id: 'pololo',
    nom: 'Pololo',
    genre: 'M',
    langue: 'Nouchi',
    description: 'DJ de maquis, 26 ans, Cocody',
    base: `Full-body digital illustration of Pololo, a trendy and confident young Ivorian \
man from Abidjan around 26 years old, wearing modern urban streetwear: \
an African wax-print bomber jacket, fitted jeans, fresh white sneakers, \
DJ headphones around his neck, backwards cap, [ÉTAT]`,
  },

  nache: {
    id: 'nache',
    nom: 'Nache',
    genre: 'F',
    langue: 'Nouchi',
    description: 'Influenceuse-coiffeuse, 25 ans, Yopougon',
    base: `Full-body digital illustration of Nache, a confident and stylish young Ivorian \
woman from Abidjan around 25 years old, wearing a trendy mix of denim \
and vibrant wax-print fabric crop top, hoop earrings, modern braided hairstyle \
with gold accessories, platform sneakers, [ÉTAT]`,
  },
};

// ── Export des 48 prompts complets ────────────────────────────────────────────
/**
 * Retourne les 3 prompts complets pour un avatar donné.
 * @param {string} avatarId  — clé de BASE_PROMPTS
 * @returns {{ neutre: string, joyeux: string, serieux: string }}
 */
export function getPromptsForAvatar(avatarId) {
  const avatar = BASE_PROMPTS[avatarId];
  if (!avatar) throw new Error(`Avatar "${avatarId}" introuvable.`);
  return {
    neutre:  p(avatar.base, 'neutre'),
    joyeux:  p(avatar.base, 'joyeux'),
    serieux: p(avatar.base, 'serieux'),
  };
}

/**
 * Retourne tous les avatars avec leurs 3 prompts.
 */
export function getAllPrompts() {
  return Object.entries(BASE_PROMPTS).map(([id, avatar]) => ({
    id,
    nom:         avatar.nom,
    genre:       avatar.genre,
    langue:      avatar.langue,
    description: avatar.description,
    prompts: {
      neutre:  p(avatar.base, 'neutre'),
      joyeux:  p(avatar.base, 'joyeux'),
      serieux: p(avatar.base, 'serieux'),
    },
  }));
}

export { BASE_PROMPTS };
export default BASE_PROMPTS;
