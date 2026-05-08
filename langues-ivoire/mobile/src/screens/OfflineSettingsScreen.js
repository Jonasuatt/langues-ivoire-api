import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useOfflineStore from '../store/offlineStore';
import useNetworkStore from '../store/networkStore';
import { languagesAPI } from '../services/api';
import { getCacheSize } from '../services/audioCache';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

export default function OfflineSettingsScreen() {
  const {
    downloadedLanguages,
    syncingLangCode,
    syncProgress,
    syncError,
    loadDownloadedLanguages,
    downloadLanguage,
    removeLanguage,
    clearSyncError,
  } = useOfflineStore();
  const { isConnected } = useNetworkStore();
  const [languages, setLanguages] = useState([]);
  const [audioFileCount, setAudioFileCount] = useState(0);

  useEffect(() => {
    loadDownloadedLanguages();
    languagesAPI.getAll().then((r) => setLanguages(r.data)).catch(() => {});
    getCacheSize().then(setAudioFileCount).catch(() => {});
  }, []);

  useEffect(() => {
    if (syncError) {
      Alert.alert('Erreur', syncError, [{ text: 'OK', onPress: clearSyncError }]);
    }
  }, [syncError]);

  const handleDownload = (langCode, langName) => {
    if (!isConnected) {
      Alert.alert('Hors-ligne', 'Connectez-vous à Internet pour télécharger une langue.');
      return;
    }
    Alert.alert(
      'Télécharger',
      `Télécharger ${langName} pour une utilisation hors-ligne ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Télécharger',
          onPress: async () => {
            try {
              await downloadLanguage(langCode);
              getCacheSize().then(setAudioFileCount);
            } catch {}
          },
        },
      ]
    );
  };

  const handleRemove = (langCode, langName) => {
    Alert.alert(
      'Supprimer',
      `Supprimer les données hors-ligne de ${langName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await removeLanguage(langCode);
            getCacheSize().then(setAudioFileCount);
          },
        },
      ]
    );
  };

  const downloadedCodes = downloadedLanguages.map((l) => l.code);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Header */}
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.header}>
        <Ionicons name="cloud-download-outline" size={36} color="#fff" />
        <Text style={styles.headerTitle}>Mode Hors-ligne</Text>
        <Text style={styles.headerSub}>
          Téléchargez des langues pour apprendre sans connexion
        </Text>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="language-outline" size={22} color={COLORS.accent} />
          <Text style={styles.statValue}>{downloadedLanguages.length}</Text>
          <Text style={styles.statLabel}>Langues</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="musical-notes-outline" size={22} color={COLORS.accent} />
          <Text style={styles.statValue}>{audioFileCount}</Text>
          <Text style={styles.statLabel}>Fichiers audio</Text>
        </View>
      </View>

      {/* Progression en cours */}
      {syncingLangCode && syncProgress && (
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.progressTitle}>
              Téléchargement en cours...
            </Text>
          </View>
          <Text style={styles.progressDetail}>{syncProgress.detail}</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${syncProgress.percent || 0}%` }]}
            />
          </View>
        </View>
      )}

      {/* Langues disponibles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Langues disponibles</Text>
        {languages.map((lang) => {
          const isDownloaded = downloadedCodes.includes(lang.code);
          const isSyncing = syncingLangCode === lang.code;
          const meta = downloadedLanguages.find((l) => l.code === lang.code);

          return (
            <View key={lang.id} style={styles.langRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.langName}>{lang.nom}</Text>
                {isDownloaded && meta?.syncedAt && (
                  <Text style={styles.langMeta}>
                    {meta.dictCount || 0} mots · Synchro{' '}
                    {new Date(meta.syncedAt).toLocaleDateString('fr-FR')}
                  </Text>
                )}
              </View>

              {isSyncing ? (
                <ActivityIndicator size="small" color={COLORS.accent} />
              ) : isDownloaded ? (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={styles.refreshBtn}
                    onPress={() => handleDownload(lang.code, lang.nom)}
                  >
                    <Ionicons name="refresh" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemove(lang.code, lang.nom)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#E53935" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => handleDownload(lang.code, lang.nom)}
                  disabled={!!syncingLangCode}
                >
                  <Ionicons name="cloud-download-outline" size={18} color="#fff" />
                  <Text style={styles.downloadBtnText}>Télécharger</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    gap: 8,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 14, color: '#c8e6c9', textAlign: 'center', paddingHorizontal: 32 },
  statsRow: { flexDirection: 'row', margin: 16, gap: 12 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14,
    alignItems: 'center', gap: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  statLabel: { fontSize: 12, color: '#888' },
  progressCard: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  progressTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  progressDetail: { fontSize: 13, color: '#888', marginBottom: 8 },
  progressBar: {
    height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: COLORS.accent, borderRadius: 3,
  },
  section: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 16, padding: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  langRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  langName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  langMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.accent, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  downloadBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  refreshBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center',
  },
  removeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center',
  },
});
