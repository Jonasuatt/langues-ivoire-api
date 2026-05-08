import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', danger: '#E53935' };

/**
 * Bouton d'enregistrement audio universel
 * Props:
 *   onRecordingComplete(uri) — appelé avec l'URI du fichier local
 *   maxDuration — durée max en secondes (défaut 30)
 *   size — taille du bouton (défaut 64)
 *   color — couleur principale
 */
export default function RecordButton({
  onRecordingComplete,
  maxDuration = 30,
  size = 64,
  color = COLORS.accent,
  style,
}) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  // Animation de pulsation pendant l'enregistrement
  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // Timer pour afficher la durée
  useEffect(() => {
    if (isRecording) {
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s + 1 >= maxDuration) {
            stopRecording();
            return s + 1;
          }
          return s + 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
  }, [isRecording]);

  const requestPermissions = async () => {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      Alert.alert(
        'Permission requise',
        'L\'accès au microphone est nécessaire pour enregistrer votre voix.',
      );
      return false;
    }
    return true;
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      recorder.record();
      setIsRecording(true);
    } catch (err) {
      console.error('Erreur démarrage enregistrement:', err);
      Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement.');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      clearInterval(timerRef.current);

      await recorder.stop();

      if (recorder.uri && onRecordingComplete) {
        onRecordingComplete(recorder.uri);
      }
    } catch (err) {
      console.error('Erreur arrêt enregistrement:', err);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Cercle de pulsation */}
      {isRecording && (
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              width: size + 20,
              height: size + 20,
              borderRadius: (size + 20) / 2,
              backgroundColor: COLORS.danger + '25',
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}

      {/* Bouton principal */}
      <TouchableOpacity
        onPress={toggleRecording}
        activeOpacity={0.7}
        style={[
          styles.btn,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isRecording ? COLORS.danger : color,
          },
        ]}
      >
        <Ionicons
          name={isRecording ? 'stop' : 'mic'}
          size={size * 0.4}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Timer */}
      {isRecording && (
        <View style={styles.timerRow}>
          <View style={styles.recordDot} />
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        </View>
      )}

      {/* Label */}
      {!isRecording && (
        <Text style={styles.label}>Appuyez pour enregistrer</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  pulseCircle: { position: 'absolute' },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  recordDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E53935',
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});
