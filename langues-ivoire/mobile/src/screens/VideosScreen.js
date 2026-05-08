import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, ActivityIndicator, Linking, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { videosAPI } from '../services/api';
import { offlineLanguagesAPI as languagesAPI } from '../services/offlineApi';
import LanguagePicker from '../components/LanguagePicker';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8', text: '#1A1A1A' };

const CATEGORIES = [
  { key: '', label: 'Tout', icon: 'grid' },
  { key: 'prononciation', label: 'Prononciation', icon: 'mic' },
  { key: 'culturel', label: 'Culturel', icon: 'sparkles' },
  { key: 'tutoriel', label: 'Tutoriel', icon: 'school' },
  { key: 'musique', label: 'Musique', icon: 'musical-notes' },
  { key: 'documentaire', label: 'Documentaire', icon: 'film' },
];

function extractYoutubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function formatDuration(seconds) {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function VideosScreen() {
  const [videos, setVideos] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedLang, setSelectedLang] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    languagesAPI.getAll().then(({ data }) => setLanguages(data)).catch(() => {});
  }, []);

  const loadVideos = useCallback(async (p = 1, append = false) => {
    if (p === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const params = { page: p, limit: 15 };
      if (selectedCat) params.categorie = selectedCat;
      if (selectedLang) params.langue = selectedLang;
      const { data } = await videosAPI.getAll(params);
      setVideos(prev => append ? [...prev, ...data.data] : data.data);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch (_) {}
    finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCat, selectedLang]);

  useEffect(() => { loadVideos(1); }, [loadVideos]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVideos(1);
    setRefreshing(false);
  };

  const onEndReached = () => {
    if (!loadingMore && page < totalPages) {
      loadVideos(page + 1, true);
    }
  };

  const openVideo = (url) => {
    Linking.openURL(url);
  };

  const renderVideo = ({ item }) => {
    const ytId = extractYoutubeId(item.url);
    const thumb = item.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);
    const duration = formatDuration(item.duree);

    return (
      <TouchableOpacity style={styles.videoCard} onPress={() => openVideo(item.url)} activeOpacity={0.8}>
        {/* Thumbnail */}
        <View style={styles.thumbContainer}>
          {thumb ? (
            <Image source={{ uri: thumb }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]}>
              <Ionicons name="play-circle" size={40} color="#ccc" />
            </View>
          )}
          <View style={styles.playOverlay}>
            <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.9)" />
          </View>
          {duration ? (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{duration}</Text>
            </View>
          ) : null}
          {item.source === 'youtube' && (
            <View style={styles.sourceBadge}>
              <Ionicons name="logo-youtube" size={14} color="#FF0000" />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>{item.titre}</Text>
          {item.description ? (
            <Text style={styles.videoDesc} numberOfLines={2}>{item.description}</Text>
          ) : null}
          <View style={styles.metaRow}>
            {item.language && (
              <View style={styles.langTag}>
                <Text style={styles.langTagText}>{item.language.nom}</Text>
              </View>
            )}
            <View style={styles.catTag}>
              <Text style={styles.catTagText}>{item.categorie}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Catégories */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={c => c.key}
        contentContainerStyle={styles.catList}
        renderItem={({ item: cat }) => (
          <TouchableOpacity
            style={[styles.catChip, selectedCat === cat.key && styles.catChipActive]}
            onPress={() => setSelectedCat(cat.key)}
          >
            <Ionicons name={cat.icon} size={16} color={selectedCat === cat.key ? '#fff' : COLORS.primary} />
            <Text style={[styles.catChipText, selectedCat === cat.key && styles.catChipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Langues — dropdown */}
      <View style={styles.langRow}>
        <LanguagePicker
          languages={languages}
          selected={selectedLang}
          onSelect={setSelectedLang}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          {renderHeader()}
          <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 40 }} />
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideo}
          keyExtractor={v => v.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="videocam-off-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Aucune vidéo disponible</Text>
            </View>
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator color={COLORS.accent} style={{ padding: 16 }} /> : null}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1 },
  list: { paddingBottom: 24 },

  // Catégories
  catList: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8, gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#e0e0e0',
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catChipText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  catChipTextActive: { color: '#fff' },

  // Langues
  langRow: { paddingHorizontal: 12, paddingBottom: 12, paddingTop: 4 },

  // Video card
  videoCard: {
    marginHorizontal: 16, marginTop: 12,
    backgroundColor: '#fff', borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  thumbContainer: { position: 'relative', width: '100%', aspectRatio: 16 / 9, backgroundColor: '#111' },
  thumb: { width: '100%', height: '100%' },
  thumbPlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
  playOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute', bottom: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  sourceBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: '#fff', borderRadius: 12, padding: 4,
  },

  videoInfo: { padding: 12 },
  videoTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, lineHeight: 20 },
  videoDesc: { fontSize: 13, color: '#666', marginTop: 4, lineHeight: 18 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  langTag: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  langTagText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  catTag: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  catTagText: { fontSize: 11, fontWeight: '600', color: '#E65100' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: '#999' },
});
