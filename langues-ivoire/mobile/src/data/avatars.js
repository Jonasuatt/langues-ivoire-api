// ─── Avatars locaux — 16 tuteurs × 4 états ────────────────────────────────
// portrait = buste (head+shoulders) → cartes de liste TutorsScreen
// neutre / joyeux / sérieux = plein-corps → TutorChatScreen, NouchiScreen

export const AVATARS = {
  koffi: {
    portrait: require('../../assets/avatars/koffi_portrait.png'),
    neutre:   require('../../assets/avatars/koffi_neutre.png'),
    joyeux:   require('../../assets/avatars/koffi_joyeux.png'),
    serieux:  require('../../assets/avatars/koffi_serieux.png'),
  },
  aya: {
    portrait: require('../../assets/avatars/aya_portrait.png'),
    neutre:   require('../../assets/avatars/aya_neutre.png'),
    joyeux:   require('../../assets/avatars/aya_joyeux.png'),
    serieux:  require('../../assets/avatars/aya_serieux.png'),
  },
  amara: {
    portrait: require('../../assets/avatars/amara_portrait.png'),
    neutre:   require('../../assets/avatars/amara_neutre.png'),
    joyeux:   require('../../assets/avatars/amara_joyeux.png'),
    serieux:  require('../../assets/avatars/amara_serieux.png'),
  },
  djeneba: {
    portrait: require('../../assets/avatars/djeneba_portrait.png'),
    neutre:   require('../../assets/avatars/djeneba_neutre.png'),
    joyeux:   require('../../assets/avatars/djeneba_joyeux.png'),
    serieux:  require('../../assets/avatars/djeneba_serieux.png'),
  },
  yoro: {
    portrait: require('../../assets/avatars/yoro_portrait.png'),
    neutre:   require('../../assets/avatars/yoro_neutre.png'),
    joyeux:   require('../../assets/avatars/yoro_joyeux.png'),
    serieux:  require('../../assets/avatars/yoro_serieux.png'),
  },
  ozoua: {
    portrait: require('../../assets/avatars/ozoua_portrait.png'),
    neutre:   require('../../assets/avatars/ozoua_neutre.png'),
    joyeux:   require('../../assets/avatars/ozoua_joyeux.png'),
    serieux:  require('../../assets/avatars/ozoua_serieux.png'),
  },
  dolourou: {
    portrait: require('../../assets/avatars/dolourou_portrait.png'),
    neutre:   require('../../assets/avatars/dolourou_neutre.png'),
    joyeux:   require('../../assets/avatars/dolourou_joyeux.png'),
    serieux:  require('../../assets/avatars/dolourou_serieux.png'),
  },
  tialagnon: {
    portrait: require('../../assets/avatars/tialagnon_portrait.png'),
    neutre:   require('../../assets/avatars/tialagnon_neutre.png'),
    joyeux:   require('../../assets/avatars/tialagnon_joyeux.png'),
    serieux:  require('../../assets/avatars/tialagnon_serieux.png'),
  },
  kadio: {
    portrait: require('../../assets/avatars/kadio_portrait.png'),
    neutre:   require('../../assets/avatars/kadio_neutre.png'),
    joyeux:   require('../../assets/avatars/kadio_joyeux.png'),
    serieux:  require('../../assets/avatars/kadio_serieux.png'),
  },
  tehia: {
    portrait: require('../../assets/avatars/tehia_portrait.png'),
    neutre:   require('../../assets/avatars/tehia_neutre.png'),
    joyeux:   require('../../assets/avatars/tehia_joyeux.png'),
    serieux:  require('../../assets/avatars/tehia_serieux.png'),
  },
  zan_bi: {
    portrait: require('../../assets/avatars/zan_bi_portrait.png'),
    neutre:   require('../../assets/avatars/zan_bi_neutre.png'),
    joyeux:   require('../../assets/avatars/zan_bi_joyeux.png'),
    serieux:  require('../../assets/avatars/zan_bi_serieux.png'),
  },
  tra_lou: {
    portrait: require('../../assets/avatars/tra_lou_portrait.png'),
    neutre:   require('../../assets/avatars/tra_lou_neutre.png'),
    joyeux:   require('../../assets/avatars/tra_lou_joyeux.png'),
    serieux:  require('../../assets/avatars/tra_lou_serieux.png'),
  },
  oulahi: {
    portrait: require('../../assets/avatars/oulahi_portrait.png'),
    neutre:   require('../../assets/avatars/oulahi_neutre.png'),
    joyeux:   require('../../assets/avatars/oulahi_joyeux.png'),
    serieux:  require('../../assets/avatars/oulahi_serieux.png'),
  },
  bleka: {
    portrait: require('../../assets/avatars/bleka_portrait.png'),
    neutre:   require('../../assets/avatars/bleka_neutre.png'),
    joyeux:   require('../../assets/avatars/bleka_joyeux.png'),
    serieux:  require('../../assets/avatars/bleka_serieux.png'),
  },
  pololo: {
    portrait: require('../../assets/avatars/pololo_portrait.png'),
    neutre:   require('../../assets/avatars/pololo_neutre.png'),
    joyeux:   require('../../assets/avatars/pololo_joyeux.png'),
    serieux:  require('../../assets/avatars/pololo_serieux.png'),
  },
  nache: {
    portrait: require('../../assets/avatars/nache_portrait.png'),
    neutre:   require('../../assets/avatars/nache_neutre.png'),
    joyeux:   require('../../assets/avatars/nache_joyeux.png'),
    serieux:  require('../../assets/avatars/nache_serieux.png'),
  },
};

/**
 * Retourne la source d'image pour un tuteur et un état donné.
 * @param {string} nomAvatar - Nom du tuteur (ex: "Zan Bi", "Tra Lou", "Koffi")
 * @param {'portrait'|'neutre'|'joyeux'|'serieux'} etat - État expressif
 * @returns {object|null} - require() source ou null si introuvable
 */
export function getAvatar(nomAvatar, etat = 'neutre') {
  const key = nomAvatar
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_');
  return AVATARS[key]?.[etat] ?? AVATARS[key]?.['neutre'] ?? null;
}
