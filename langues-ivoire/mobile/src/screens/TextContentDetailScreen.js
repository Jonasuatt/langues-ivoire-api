import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import AudioButton from '../components/AudioButton';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

const TYPE_META = {
  CONTE:       { emoji: '🌙', color: '#E65100', label: 'Conte' },
  CHANSON:     { emoji: '🎵', color: '#AD1457', label: 'Chanson' },
  HISTOIRE:    { emoji: '📜', color: '#1565C0', label: 'Histoire' },
  PROVERBE:    { emoji: '💬', color: '#6A1B9A', label: 'Proverbe' },
  POEME:       { emoji: '✨', color: '#00695C', label: 'Poème' },
  RECIT:       { emoji: '📖', color: '#4527A0', label: 'Récit' },
  LEGENDE:     { emoji: '🏺', color: '#BF360C', label: 'Légende' },
  DISCOURS:    { emoji: '🎙️', color: '#2E7D32', label: 'Discours' },
};

function typeMeta(type) {
  if (!type) return { emoji: '📄', color: '#888', label: 'Texte' };
  const key = type.toUpperCase();
  return TYPE_META[key] || { emoji: '📄', color: '#555', label: type };
}

const NIVEAU_COLORS = {
  debutant:      '#2E7D32',
  intermediaire: '#F57F17',
  avance:        '#C62828',
};

export default function TextContentDetailScreen({ route, navigation }) {
  const { item: initialItem } = route.params;
  const [item, setItem] = useState(initialItem);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = initialItem?.id;
    if (!id) {
      setLoading(false);
      return;
    }
    api.get(`/text-contents/${id}`)
      .then(({ data }) => {
        setItem(data);
      })
      .catch(() => {
        setError('Impossible de charger le contenu complet.');
      })
      .finally(() => setLoading(false));
  }, [initialItem?.id]);

  const meta = typeMeta(item?.type);
  const langName = item?.language?.nom || item?.langue || '';
  const langCode = item?.language?.code || '';

  const tags = Array.isArray(item?.tags) ? item.tags : [];
  const niveauColor = item?.niveau
    ? (NIVEAU_COLORS[item.niveau.toLowerCase()] || '#888')
    : '#888';

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#4A148C', '#7B1FA2']} style={styles.header}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Type badge */}
        <View style={[styles.headerTypeBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
          <Text style={styles.headerTypeEmoji}>{meta.emoji}</Text>
          <Text style={styles.headerTypeLabel}>{meta.label}</Text>
        </View>

        {/* Title */}
        <Text style={styles.headerTitle} numberOfLines={3}>
          {item?.titre || '(Sans titre)'}
        </Text>

        {/* Audio button if available */}
        {item?.audioUrl ? (
          <View style={styles.headerAudioContainer}>
            <AudioButton
              audioUrl={item.audioUrl}
              text={item?.contenu}
              langCode={langCode}
              size={28}
              color="#fff"
            />
            <Text style={styles.headerAudioLabel}>Écouter</Text>
          </View>
        ) : null}
      </LinearGradient>

      {/* Loading / error overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={'#7B1FA2'} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      )}

      {!loading && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="warning-outline" size={22} color={COLORS.accent} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Image */}
          {item?.imageUrl ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ) : null}

          {/* Section: Texte original */}
          {item?.contenu ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Texte original</Text>
              </View>
              <View style={styles.sectionBody}>
                <Text style={styles.textContenu}>{item.contenu}</Text>
              </View>
            </View>
          ) : null}

          {/* Section: Traduction */}
          {item?.traduction ? (
            <>
              <View style={styles.separator} />
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="language-outline" size={18} color={COLORS.accent} />
                  <Text style={[styles.sectionTitle, { color: COLORS.accent }]}>Traduction</Text>
                </View>
                <View style={styles.sectionBody}>
                  <Text style={styles.textTraduction}>{item.traduction}</Text>
                </View>
              </View>
            </>
          ) : null}

          {/* Section: Transcription phonétique */}
          {item?.transcription ? (
            <>
              <View style={styles.separator} />
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="mic-outline" size={18} color="#7B1FA2" />
                  <Text style={[styles.sectionTitle, { color: '#7B1FA2' }]}>
                    Transcription phonétique
                  </Text>
                </View>
                <View style={[styles.sectionBody, { backgroundColor: '#F3E5F5' }]}>
                  <Text style={styles.textTranscription}>{item.transcription}</Text>
                </View>
              </View>
            </>
          ) : null}

          {/* Section: Informations */}
          <View style={styles.separator} />
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Informations</Text>

            <View style={styles.infoGrid}>
              {item?.niveau ? (
                <View style={styles.infoRow}>
                  <Ionicons name="bar-chart-outline" size={15} color="#888" />
                  <Text style={styles.infoKey}>Niveau</Text>
                  <View style={[styles.niveauPill, { backgroundColor: niveauColor + '18' }]}>
                    <Text style={[styles.niveauPillText, { color: niveauColor }]}>
                      {item.niveau}
                    </Text>
                  </View>
                </View>
              ) : null}

              {item?.auteur ? (
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={15} color="#888" />
                  <Text style={styles.infoKey}>Auteur</Text>
                  <Text style={styles.infoValue}>{item.auteur}</Text>
                </View>
              ) : null}

              {item?.sourceEthnique ? (
                <View style={styles.infoRow}>
                  <Ionicons name="earth-outline" size={15} color="#888" />
                  <Text style={styles.infoKey}>Source ethnique</Text>
                  <Text style={styles.infoValue}>{item.sourceEthnique}</Text>
                </View>
              ) : null}

              {langName ? (
                <View style={styles.infoRow}>
                  <Ionicons name="chatbubbles-outline" size={15} color="#888" />
                  <Text style={styles.infoKey}>Langue</Text>
                  <Text style={styles.infoValue}>{langName}</Text>
                </View>
              ) : null}

              {item?.dureeMin ? (
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={15} color="#888" />
                  <Text style={styles.infoKey}>Durée</Text>
                  <Text style={styles.infoValue}>{item.dureeMin} min</Text>
                </View>
              ) : null}
            </View>

            {/* Tags */}
            {tags.length > 0 ? (
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsLabel}>Tags</Text>
                <View style={styles.tagsRow}>
                  {tags.map((tag, idx) => (
                    <View key={idx} style={styles.tagPill}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 20,
    gap: 10,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 8,
  },
  headerTypeEmoji: {
    fontSize: 15,
  },
  headerTypeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 28,
  },
  headerAudioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  headerAudioLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.accent,
    fontSize: 14,
    flex: 1,
  },
  imageContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  section: {
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBody: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  textContenu: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 28,
  },
  textTraduction: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 28,
  },
  textTranscription: {
    fontSize: 15,
    color: '#6A1B9A',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  separator: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 18,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoKey: {
    fontSize: 13,
    color: '#888',
    width: 120,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  niveauPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  niveauPillText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  tagsContainer: {
    marginTop: 14,
    gap: 8,
  },
  tagsLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    backgroundColor: '#EDE7F6',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 12,
    color: '#7B1FA2',
    fontWeight: '600',
  },
});
