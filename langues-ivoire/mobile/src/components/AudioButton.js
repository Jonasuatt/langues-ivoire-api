import React, { useState, useCallback } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Speech from 'expo-speech';
import { ttsAPI } from '../services/api';
import { getCachedAudioUri } from '../services/audioCache';

const COLORS = { accent: '#F47920', primary: '#0B3D2E' };

// Mapping code langue → locale expo-speech
const LANG_TO_LOCALE = {
  baoule:  'fr-FR',
  dioula:  'fr-FR',
  bete:    'fr-FR',
  senoufo: 'fr-FR',
  agni:    'fr-FR',
  gouro:   'fr-FR',
  guere:   'fr-FR',
  nouchi:  'fr-FR',
  fr:      'fr-FR',
};

/**
 * Bouton audio universel — 3 niveaux de fallback :
 *   1. audioUrl en base (Cloudinary) → lecture directe via expo-audio
 *   2. Service TTS en ligne (/api/dictionary/admin/generate-audio)
 *   3. expo-speech (TTS natif du device) — toujours disponible, hors-ligne
 */
export default function AudioButton({ audioUrl, text, langCode, gender, size = 22, color = COLORS.accent, style }) {
  const [loading, setLoading]   = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const player = useAudioPlayer(audioUrl || undefined);
  const status = useAudioPlayerStatus(player);

  // ─── Fallback expo-speech ──────────────────────────────────────────────────
  const speakWithDevice = useCallback(async () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    const locale = LANG_TO_LOCALE[langCode] || 'fr-FR';
    // Voix genrée : pitch féminin (~1.22) ou masculin (~0.82), neutre par défaut
    const pitch = gender === 'F' ? 1.22 : gender === 'M' ? 0.82 : 1.0;
    const rate  = gender === 'F' ? 0.88 : gender === 'M' ? 1.0  : 0.85;
    setSpeaking(true);
    Speech.speak(text || '', {
      language:  locale,
      rate,
      pitch,
      onDone:    () => setSpeaking(false),
      onError:   () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
    });
  }, [text, langCode, gender, speaking]);

  const play = useCallback(async () => {
    // ── 1. Lire depuis l'URL Cloudinary ────────────────────────────────────
    if (audioUrl && player) {
      if (status?.playing) {
        player.pause();
        return;
      }
      try {
        const cached = await getCachedAudioUri(audioUrl);
        if (cached) player.replace(cached);
        player.seekTo(0);
        player.play();
      } catch {
        player.seekTo(0);
        player.play();
      }
      return;
    }

    if (!text) return;

    // ── 2. Générer via le service TTS en ligne ──────────────────────────────
    setLoading(true);
    try {
      const { data } = await ttsAPI.synthesize({ text, languageCode: langCode || 'fr', gender: gender || undefined });
      if (data?.audioUrl && player) {
        player.replace(data.audioUrl);
        player.play();
        setLoading(false);
        return;
      }
    } catch {
      // Service en ligne indisponible → fallback device
    }
    setLoading(false);

    // ── 3. Fallback expo-speech (device natif, hors-ligne) ──────────────────
    speakWithDevice();
  }, [audioUrl, text, langCode, player, status?.playing, speakWithDevice]);

  const isPlaying = status?.playing || speaking;

  return (
    <TouchableOpacity
      style={[styles.btn, style, (loading || isPlaying) && styles.btnActive]}
      onPress={play}
      activeOpacity={0.6}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons
          name={isPlaying ? 'stop-circle' : 'volume-high'}
          size={size}
          color={isPlaying ? color : color}
        />
      )}
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  btn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(244, 121, 32, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnActive: {
    backgroundColor: 'rgba(244, 121, 32, 0.2)',
  },
});
