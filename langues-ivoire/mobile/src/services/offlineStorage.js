import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  languages: 'offline_languages',
  dict: (code) => `offline_dict_${code}`,
  phrases: (code) => `offline_phrases_${code}`,
  lessons: (code) => `offline_lessons_${code}`,
  cultural: (code) => `offline_cultural_${code}`,
  meta: (code) => `offline_meta_${code}`,
  downloaded: 'offline_downloaded_langs',
};

// --- Languages list ---

export async function saveLanguagesList(languages) {
  await AsyncStorage.setItem(KEYS.languages, JSON.stringify(languages));
}

export async function getLanguagesList() {
  const data = await AsyncStorage.getItem(KEYS.languages);
  return data ? JSON.parse(data) : null;
}

// --- Per-language data (split to avoid 6MB limit) ---

export async function saveLanguageData(langCode, { dictEntries, phrases, lessons, culturalItems }) {
  await Promise.all([
    AsyncStorage.setItem(KEYS.dict(langCode), JSON.stringify(dictEntries || [])),
    AsyncStorage.setItem(KEYS.phrases(langCode), JSON.stringify(phrases || [])),
    AsyncStorage.setItem(KEYS.lessons(langCode), JSON.stringify(lessons || [])),
    AsyncStorage.setItem(KEYS.cultural(langCode), JSON.stringify(culturalItems || [])),
  ]);
}

export async function getLanguageData(langCode) {
  const [dictRaw, phrasesRaw, lessonsRaw, culturalRaw] = await Promise.all([
    AsyncStorage.getItem(KEYS.dict(langCode)),
    AsyncStorage.getItem(KEYS.phrases(langCode)),
    AsyncStorage.getItem(KEYS.lessons(langCode)),
    AsyncStorage.getItem(KEYS.cultural(langCode)),
  ]);
  return {
    dictEntries: dictRaw ? JSON.parse(dictRaw) : [],
    phrases: phrasesRaw ? JSON.parse(phrasesRaw) : [],
    lessons: lessonsRaw ? JSON.parse(lessonsRaw) : [],
    culturalItems: culturalRaw ? JSON.parse(culturalRaw) : [],
  };
}

// --- Sync metadata ---

export async function saveSyncMetadata(langCode, meta) {
  await AsyncStorage.setItem(KEYS.meta(langCode), JSON.stringify({
    ...meta,
    syncedAt: new Date().toISOString(),
  }));
}

export async function getSyncMetadata(langCode) {
  const data = await AsyncStorage.getItem(KEYS.meta(langCode));
  return data ? JSON.parse(data) : null;
}

// --- Downloaded languages tracking ---

export async function getDownloadedLanguages() {
  const data = await AsyncStorage.getItem(KEYS.downloaded);
  return data ? JSON.parse(data) : [];
}

export async function addDownloadedLanguage(langCode) {
  const langs = await getDownloadedLanguages();
  if (!langs.includes(langCode)) {
    langs.push(langCode);
    await AsyncStorage.setItem(KEYS.downloaded, JSON.stringify(langs));
  }
}

export async function removeDownloadedLanguage(langCode) {
  const langs = await getDownloadedLanguages();
  const filtered = langs.filter((l) => l !== langCode);
  await AsyncStorage.setItem(KEYS.downloaded, JSON.stringify(filtered));
}

// --- Cleanup ---

export async function clearLanguageData(langCode) {
  await Promise.all([
    AsyncStorage.removeItem(KEYS.dict(langCode)),
    AsyncStorage.removeItem(KEYS.phrases(langCode)),
    AsyncStorage.removeItem(KEYS.lessons(langCode)),
    AsyncStorage.removeItem(KEYS.cultural(langCode)),
    AsyncStorage.removeItem(KEYS.meta(langCode)),
  ]);
  await removeDownloadedLanguage(langCode);
}

export async function clearAllOfflineData() {
  const langs = await getDownloadedLanguages();
  await Promise.all(langs.map((code) => clearLanguageData(code)));
  await AsyncStorage.removeItem(KEYS.languages);
  await AsyncStorage.removeItem(KEYS.downloaded);
}
