import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { offlineLanguagesAPI } from '../services/offlineApi';
import LanguagePicker from '../components/LanguagePicker';

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

const NIVEAU_COLORS = {
  debutant:      '#2E7D32',
  intermediaire: '#F57F17',
  avance:        '#C62828',
};

function typeMeta(type) {
  if (!type) return { emoji: '📄', color: '#888', label: type || 'Texte' };
  const key = type.toUpperCase();
  return TYPE_META[key] || { emoji: '📄', color: '#555', label: type };
}

function niveauColor(niveau) {
  if (!niveau) return '#888';
  return NIVEAU_COLORS[niveau.toLowerCase()] || '#888';
}

export default function TextContentScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedLang, setSelectedLang] = useState('');
  const [activeType, setActiveType] = useState('Tout');
  const [availableTypes, setAvailableTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load language list
  useEffect(() => {
    offlineLanguagesAPI.getAll()
      .then(({ data }) => setLanguages(data || []))
      .catch(() => {});
  }, []);

  const fetchItems = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const p = reset ? 1 : page;
      const params = { page: p, limit: 15 };
      if (selectedLang) params.langue = selectedLang;
      if (activeType !== 'Tout') params.type = activeType;

      const { data } = await api.get('/text-contents', { params });
      const list = data.data || data || [];
      const totalPages = data.totalPages || 1;

      // Collect unique types from returned data
      if (reset) {
        const types = [...new Set(list.map(i => i.type).filter(Boolean))];
        setAvailableTypes(prev => {
          const merged = [...new Set([...prev, ...types])];
          return merged;
        });
        setItems(list);
      } else {
        const types = [...new Set(list.map(i => i.type).filter(Boolean))];
        setAvailableTypes(prev => [...new Set([...prev, ...types])]);
        setItems(prev => [...prev, ...list]);
      }

      setHasMore(p < totalPages);
      if (!reset) setPage(p + 1);
      else setPage(2);
    } catch (e) {
      // fail silently, keep previous data
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, selectedLang, activeType]);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType, selectedLang]);

  const handleLoadMore = () => {
    if (!hasMore || loading || loadingMore) return;
    fetchItems(false);
  };

  const chipTypes = ['Tout', ...availableTypes];

  const renderItem = ({ item }) => {
    const meta = typeMeta(item.type);
    const langName = item.language?.nom || '';
    const hasAudio = !!item.audioUrl;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.82}
        onPress={() => navigation.navigate('TextContentDetail', { item })}
      >
        {/* Top row: type badge + niveau + duration */}
        <View style={styles.cardTop}>
          <View style={[styles.typeBadge, { backgroundColor: meta.color + '18' }]}>
            <Text style={styles.typeEmoji}>{meta.emoji}</Text>
            <Text style={[styles.typeLabel, { color: meta.color }]}>{meta.label}</Text>
          </View>
          {item.niveau ? (
            <View style={[styles.niveauBadge, { backgroundColor: niveauColor(item.niveau) + '18' }]}>
              <Text style={[styles.niveauText, { color: niveauColor(item.niveau) }]}>
                {item.niveau}
              </Text>
            </View>
          ) : null}
          {item.dureeMin ? (
            <View style={styles.dureeBadge}>
              <Ionicons name="time-outline" size={12} color="#888" />
              <Text style={styles.dureeText}>{item.dureeMin} min</Text>
            </View>
          ) : null}
        </View>

        {/* Title */}
        <Text style={styles.cardTitle} numberOfLines={2}>{item.titre || '(Sans titre)'}</Text>

        {/* Resume */}
        {item.resume ? (
          <Text style={styles.cardResume} numberOfLines={2}>{item.resume}</Text>
        ) : null}

        {/* Bottom row: author / source + lang + audio indicator */}
        <View style={styles.cardBottom}>
          <View style={{ flex: 1 }}>
            {item.auteur ? (
              <Text style={styles.cardMeta} numberOfLines={1}>
                <Ionicons name="person-outline" size={11} color="#aaa" /> {item.auteur}
              </Text>
            ) : item.sourceEthnique ? (
              <Text style={styles.cardMeta} numberOfLines={1}>
                <Ionicons name="earth-outline" size={11} color="#aaa" /> {item.sourceEthnique}
              </Text>
            ) : null}
          </View>
          <View style={styles.cardBottomRight}>
            {langName ? (
              <Text style={styles.langTag}>{langName}</Text>
            ) : null}
            {hasAudio ? (
              <View style={styles.audioIndicator}>
                <Ionicons name="headset-outline" size={14} color={COLORS.accent} />
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📚</Text>
        <Text style={styles.emptyTitle}>Aucun texte disponible</Text>
        <Text style={styles.emptySubtitle}>
          Essayez de changer de langue ou de type de contenu
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator color={COLORS.accent} style={{ margin: 16 }} />;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#4A148C', '#7B1FA2']} style={styles.header}>
        <Ionicons name="book" size={30} color="rgba(255,255,255,0.9)" />
        <Text style={styles.headerTitle}>Textes & Récits</Text>
        <Text style={styles.headerSub}>
          Contes, histoires, chansons et traditions ivoiriennes
        </Text>
      </LinearGradient>

      {/* Filters bar */}
      <View style={styles.filtersBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
          style={styles.chipsScroll}
        >
          {chipTypes.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, activeType === t && styles.chipActive]}
              onPress={() => setActiveType(t)}
            >
              <Text style={[styles.chipText, activeType === t && styles.chipTextActive]}>
                {t === 'Tout' ? 'Tout' : (typeMeta(t).emoji + ' ' + typeMeta(t).label)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <LanguagePicker
          languages={languages}
          selected={selectedLang}
          onSelect={setSelectedLang}
          allLabel="Toutes"
          style={styles.langPicker}
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={'#7B1FA2'} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, i) => item.id || String(i)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
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
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  filtersBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 10,
    paddingLeft: 12,
    gap: 8,
  },
  chipsScroll: {
    flex: 1,
  },
  chipsContainer: {
    gap: 8,
    paddingRight: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  chipActive: {
    backgroundColor: '#7B1FA2',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  chipTextActive: {
    color: '#fff',
  },
  langPicker: {
    maxWidth: 140,
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeEmoji: {
    fontSize: 13,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  niveauBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  niveauText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dureeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 'auto',
  },
  dureeText: {
    fontSize: 11,
    color: '#888',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 6,
    lineHeight: 23,
  },
  cardResume: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: '#aaa',
  },
  cardBottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langTag: {
    fontSize: 11,
    color: '#aaa',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  audioIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
  },
});
