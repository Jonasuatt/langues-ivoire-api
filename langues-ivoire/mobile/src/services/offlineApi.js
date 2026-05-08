import useNetworkStore from '../store/networkStore';
import { languagesAPI, dictionaryAPI, lessonsAPI, culturalAPI } from './api';
import { getLanguagesList, getLanguageData, getDownloadedLanguages } from './offlineStorage';

function isOnline() {
  const { isConnected, isInternetReachable } = useNetworkStore.getState();
  // Sur Android, isInternetReachable peut être null tant que non déterminé.
  // On considère en ligne si pas explicitement hors-ligne (null = indéterminé = en ligne).
  return isConnected !== false && isInternetReachable !== false;
}

/**
 * Essaye l'appel réseau, fallback sur le cache en cas d'erreur ou hors-ligne.
 */
async function withFallback(onlineFn, offlineFn) {
  if (!isOnline()) {
    return offlineFn();
  }
  try {
    return await onlineFn();
  } catch {
    return offlineFn();
  }
}

// ─── Langues ───

export const offlineLanguagesAPI = {
  getAll: (params) =>
    withFallback(
      () => languagesAPI.getAll(params),
      async () => {
        const languages = await getLanguagesList();
        return { data: languages || [] };
      }
    ),

  getOne: (id) =>
    withFallback(
      () => languagesAPI.getOne(id),
      async () => {
        const languages = await getLanguagesList();
        const lang = (languages || []).find((l) => l.id === id || l.code === id);
        return { data: lang || null };
      }
    ),
};

// ─── Dictionnaire ───

export const offlineDictionaryAPI = {
  get: (langue, params) =>
    withFallback(
      () => dictionaryAPI.get(langue, params),
      async () => {
        const { dictEntries } = await getLanguageData(langue);
        let filtered = dictEntries;

        // Filtrer par catégorie
        if (params?.categorie) {
          filtered = filtered.filter((e) => e.categorie === params.categorie);
        }

        // Recherche textuelle
        if (params?.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (e) =>
              e.mot?.toLowerCase().includes(q) ||
              e.traduction?.toLowerCase().includes(q)
          );
        }

        // Pagination
        const page = params?.page || 1;
        const limit = params?.limit || 50;
        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return {
          data: {
            entries: paginated,
            total: filtered.length,
            page,
            totalPages: Math.ceil(filtered.length / limit),
          },
        };
      }
    ),

  search: (params) =>
    withFallback(
      () => dictionaryAPI.search(params),
      async () => {
        // Recherche dans toutes les langues téléchargées si pas de langue spécifiée
        const langue = params?.langue;
        if (!langue) return { data: [] };

        const { dictEntries } = await getLanguageData(langue);
        const q = (params?.q || '').toLowerCase();
        if (!q) return { data: dictEntries.slice(0, 20) };

        const results = dictEntries.filter(
          (e) =>
            e.mot?.toLowerCase().includes(q) ||
            e.traduction?.toLowerCase().includes(q) ||
            e.transcription?.toLowerCase().includes(q)
        );
        return { data: results.slice(0, 50) };
      }
    ),

  getEntry: (id) =>
    withFallback(
      () => dictionaryAPI.getEntry(id),
      async () => {
        // Pas de moyen efficace de chercher par ID offline sans langue
        // On retourne null, l'écran devra gérer
        return { data: null };
      }
    ),

  // Les contributions nécessitent obligatoirement le réseau
  contributeWord: (data) => dictionaryAPI.contributeWord(data),
  contributePhrase: (data) => dictionaryAPI.contributePhrase(data),
};

// ─── Leçons ───

export const offlineLessonsAPI = {
  getByLanguage: (langue, params) =>
    withFallback(
      () => lessonsAPI.getByLanguage(langue, params),
      async () => {
        const { lessons } = await getLanguageData(langue);

        // Filtrer par niveau si demandé
        let filtered = lessons;
        if (params?.level) {
          filtered = filtered.filter((l) => l.level === params.level);
        }

        return { data: filtered };
      }
    ),

  getLesson: (id) =>
    withFallback(
      () => lessonsAPI.getLesson(id),
      async () => {
        // Chercher la leçon par ID dans toutes les langues téléchargées
        const downloaded = await getDownloadedLanguages();
        for (const code of downloaded) {
          const { lessons } = await getLanguageData(code);
          const found = lessons.find(l => l.id === id);
          if (found) return { data: found };
        }
        return { data: null };
      }
    ),

  // Soumission d'exercice nécessite le réseau
  submitExercise: (id, data) => lessonsAPI.submitExercise(id, data),
};

// ─── Culturel ───

export const offlineCulturalAPI = {
  getToday: () =>
    withFallback(
      () => culturalAPI.getToday(),
      async () => {
        // Prendre le plus récent des items culturels cachés
        // On cherche dans toutes les langues téléchargées
        const languages = (await getLanguagesList()) || [];
        for (const lang of languages) {
          const { culturalItems } = await getLanguageData(lang.code);
          if (culturalItems.length > 0) {
            return { data: culturalItems[0] };
          }
        }
        return { data: null };
      }
    ),

  getAll: (params) =>
    withFallback(
      () => culturalAPI.getAll(params),
      async () => {
        const languages = (await getLanguagesList()) || [];
        let allItems = [];
        for (const lang of languages) {
          const { culturalItems } = await getLanguageData(lang.code);
          allItems = allItems.concat(culturalItems);
        }

        // Pagination
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        const start = (page - 1) * limit;

        return {
          data: {
            items: allItems.slice(start, start + limit),
            total: allItems.length,
          },
        };
      }
    ),
};
