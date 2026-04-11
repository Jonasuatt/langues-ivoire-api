import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { culturalAPI } from '../services/api';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

const TYPE_ICONS = {
  PROVERB: { icon: 'chatbubble-ellipses', color: '#6A1B9A', label: 'Proverbe' },
  TRADITION: { icon: 'leaf', color: '#2E7D32', label: 'Tradition' },
  ANECDOTE: { icon: 'book', color: '#1565C0', label: 'Anecdote' },
  TALE: { icon: 'moon', color: '#E65100', label: 'Conte' },
  MUSIC: { icon: 'musical-notes', color: '#AD1457', label: 'Musique' },
  DANCE: { icon: 'body', color: '#00695C', label: 'Danse' },
};

const TYPES = ['Tout', 'PROVERB', 'TRADITION', 'ANECDOTE', 'TALE'];

export default function CulturalScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('Tout');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const load = async (reset = false) => {
    setLoading(true);
    try {
      const p = reset ? 1 : page;
      const params = { page: p, limit: 15 };
      if (activeType !== 'Tout') params.type = activeType;
      const { data } = await culturalAPI.getAll(params);
      setItems(prev => reset ? data.data : [...prev, ...data.data]);
      setHasMore(p < data.totalPages);
      if (!reset) setPage(p + 1);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    setItems([]); setPage(1); setHasMore(true);
    load(true);
  }, [activeType]);

  const renderItem = ({ item }) => {
    const meta = TYPE_ICONS[item.type] || { icon: 'star', color: COLORS.accent, label: item.type };
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBadge, { backgroundColor: meta.color + '20' }]}>
            <Ionicons name={meta.icon} size={18} color={meta.color} />
          </View>
          <Text style={[styles.typeLabel, { color: meta.color }]}>{meta.label}</Text>
          {item.language && <Text style={styles.langTag}>{item.language.nom}</Text>}
        </View>
        {item.titre && <Text style={styles.titre}>{item.titre}</Text>}
        <Text style={styles.contenu}>{item.contenu}</Text>
        {item.traduction && <Text style={styles.traduction}>"{item.traduction}"</Text>}
        {item.sourceEthnique && <Text style={styles.source}>— {item.sourceEthnique}</Text>}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.banner}>
        <Ionicons name="earth" size={28} color="#c8e6c9" />
        <Text style={styles.bannerTitle}>Culture & Traditions</Text>
        <Text style={styles.bannerSub}>Explorez la richesse des peuples ivoiriens</Text>
      </LinearGradient>

      {/* Filtres */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingVertical: 10 }}
        style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
        {TYPES.map(t => (
          <TouchableOpacity key={t} style={[styles.filterChip, activeType === t && styles.filterChipActive]}
            onPress={() => setActiveType(t)}>
            <Text style={[styles.filterText, activeType === t && { color: '#fff' }]}>
              {t === 'Tout' ? 'Tout' : (TYPE_ICONS[t]?.label || t)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={items}
        keyExtractor={(item, i) => item.id || String(i)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        onEndReached={() => hasMore && !loading && load()}
        onEndReachedThreshold={0.4}
        ListFooterComponent={loading && <ActivityIndicator color={COLORS.accent} style={{ margin: 16 }} />}
        ListEmptyComponent={!loading && <Text style={styles.empty}>Aucun contenu disponible</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 24, alignItems: 'center', gap: 6 },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  bannerSub: { fontSize: 14, color: '#c8e6c9', textAlign: 'center' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: '#F0F0F0' },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: '#555' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18,
          shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  iconBadge: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  typeLabel: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  langTag: { marginLeft: 'auto', fontSize: 11, color: '#aaa', backgroundColor: '#F5F5F5',
              paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  titre: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  contenu: { fontSize: 15, color: '#333', fontStyle: 'italic', lineHeight: 24 },
  traduction: { fontSize: 14, color: '#666', marginTop: 8 },
  source: { fontSize: 12, color: '#999', marginTop: 4 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 16 },
});
