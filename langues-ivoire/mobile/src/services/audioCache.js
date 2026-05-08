import * as FileSystem from 'expo-file-system';

const CACHE_DIR = FileSystem.documentDirectory + 'audio_cache/';

function hashUrl(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0;
  }
  return 'audio_' + Math.abs(hash).toString(36);
}

function getExtension(url) {
  if (url.includes('.wav')) return '.wav';
  return '.mp3';
}

async function ensureCacheDir() {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

export async function getCachedAudioUri(url) {
  if (!url) return null;
  const filePath = CACHE_DIR + hashUrl(url) + getExtension(url);
  const info = await FileSystem.getInfoAsync(filePath);
  return info.exists ? filePath : null;
}

export async function cacheAudioFile(url) {
  if (!url) return null;
  await ensureCacheDir();

  const filePath = CACHE_DIR + hashUrl(url) + getExtension(url);
  const info = await FileSystem.getInfoAsync(filePath);
  if (info.exists) return filePath;

  try {
    const result = await FileSystem.downloadAsync(url, filePath);
    return result.uri;
  } catch {
    return null;
  }
}

export async function cacheAllAudioForLanguage(entries, onProgress) {
  await ensureCacheDir();
  const withAudio = entries.filter((e) => e.audioUrl);
  let done = 0;

  for (const entry of withAudio) {
    await cacheAudioFile(entry.audioUrl);
    done++;
    if (onProgress) onProgress({ current: done, total: withAudio.length });
  }
  return done;
}

export async function getCacheSize() {
  try {
    const info = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!info.exists) return 0;
    // expo-file-system doesn't provide directory size, estimate from file count
    const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
    return files.length;
  } catch {
    return 0;
  }
}

export async function clearAudioCache(langCode) {
  // For simplicity, clear all audio cache (files aren't tagged by language)
  try {
    const info = await FileSystem.getInfoAsync(CACHE_DIR);
    if (info.exists) {
      await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
    }
  } catch { /* ignore */ }
}
