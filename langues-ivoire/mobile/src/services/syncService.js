import { syncAPI } from './api';
import {
  saveLanguagesList,
  saveLanguageData,
  saveSyncMetadata,
  addDownloadedLanguage,
} from './offlineStorage';
import { cacheAllAudioForLanguage } from './audioCache';

/**
 * Synchronise toutes les données d'une langue pour le mode hors-ligne.
 * @param {string} langCode - Code de la langue (ex: 'baoule')
 * @param {function} onProgress - Callback({ step, detail, percent })
 * @returns {object} { success, dictCount, phraseCount, lessonCount, culturalCount, audioCount }
 */
export async function syncLanguage(langCode, onProgress) {
  const report = (step, detail, percent) => {
    if (onProgress) onProgress({ step, detail, percent });
  };

  // 1. Télécharger les données depuis l'API
  report('download', 'Téléchargement des données...', 10);
  const { data } = await syncAPI.fullSync(langCode);

  // 2. Sauvegarder la liste des langues
  report('save', 'Sauvegarde des langues...', 20);
  if (data.languages?.length) {
    await saveLanguagesList(data.languages);
  }

  // 3. Sauvegarder les données de la langue
  report('save', 'Sauvegarde du dictionnaire et des leçons...', 30);
  await saveLanguageData(langCode, {
    dictEntries: data.dictEntries || [],
    phrases: data.phrases || [],
    lessons: data.lessons || [],
    culturalItems: data.culturalItems || [],
  });

  // 4. Marquer comme téléchargée
  await addDownloadedLanguage(langCode);

  // 5. Mettre à jour les métadonnées de sync
  await saveSyncMetadata(langCode, {
    version: data.version,
    dictCount: data.dictEntries?.length || 0,
    phraseCount: data.phrases?.length || 0,
    lessonCount: data.lessons?.length || 0,
    culturalCount: data.culturalItems?.length || 0,
  });

  // 6. Cache audio des mots du dictionnaire
  report('audio', 'Téléchargement des fichiers audio...', 50);
  const audioEntries = [
    ...(data.dictEntries || []).filter((e) => e.audioUrl),
    ...(data.phrases || []).filter((e) => e.audioUrl),
  ];

  let audioCount = 0;
  if (audioEntries.length > 0) {
    audioCount = await cacheAllAudioForLanguage(audioEntries, ({ current, total }) => {
      const audioPercent = 50 + Math.round((current / total) * 45);
      report('audio', `Audio ${current}/${total}`, audioPercent);
    });
  }

  report('done', 'Synchronisation terminée', 100);

  return {
    success: true,
    dictCount: data.dictEntries?.length || 0,
    phraseCount: data.phrases?.length || 0,
    lessonCount: data.lessons?.length || 0,
    culturalCount: data.culturalItems?.length || 0,
    audioCount,
  };
}
