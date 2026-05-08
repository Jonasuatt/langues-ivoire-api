import { create } from 'zustand';
import { syncLanguage } from '../services/syncService';
import {
  getDownloadedLanguages,
  getSyncMetadata,
  clearLanguageData,
} from '../services/offlineStorage';
import { clearAudioCache } from '../services/audioCache';

const useOfflineStore = create((set, get) => ({
  // Langues téléchargées avec leurs métadonnées
  downloadedLanguages: [],
  // Langue en cours de téléchargement
  syncingLangCode: null,
  // Progression du téléchargement en cours
  syncProgress: null, // { step, detail, percent }
  // Erreur éventuelle
  syncError: null,

  /**
   * Charger la liste des langues déjà téléchargées au démarrage
   */
  loadDownloadedLanguages: async () => {
    const codes = await getDownloadedLanguages();
    const withMeta = await Promise.all(
      codes.map(async (code) => {
        const meta = await getSyncMetadata(code);
        return { code, ...meta };
      })
    );
    set({ downloadedLanguages: withMeta });
  },

  /**
   * Télécharger une langue pour le mode hors-ligne
   */
  downloadLanguage: async (langCode) => {
    const { syncingLangCode } = get();
    if (syncingLangCode) return; // déjà en cours

    set({ syncingLangCode: langCode, syncProgress: null, syncError: null });

    try {
      const result = await syncLanguage(langCode, (progress) => {
        set({ syncProgress: progress });
      });

      // Recharger la liste
      await get().loadDownloadedLanguages();
      set({ syncingLangCode: null, syncProgress: null });
      return result;
    } catch (err) {
      set({
        syncingLangCode: null,
        syncProgress: null,
        syncError: err.message || 'Erreur de synchronisation',
      });
      throw err;
    }
  },

  /**
   * Supprimer les données hors-ligne d'une langue
   */
  removeLanguage: async (langCode) => {
    await clearLanguageData(langCode);
    await clearAudioCache(langCode);
    await get().loadDownloadedLanguages();
  },

  /**
   * Vérifie si une langue est disponible hors-ligne
   */
  isLanguageDownloaded: (langCode) => {
    return get().downloadedLanguages.some((l) => l.code === langCode);
  },

  clearSyncError: () => set({ syncError: null }),
}));

export default useOfflineStore;
