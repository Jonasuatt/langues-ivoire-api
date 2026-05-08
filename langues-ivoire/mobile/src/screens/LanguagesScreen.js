import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { offlineLanguagesAPI as languagesAPI } from '../services/offlineApi';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

export default function LanguagesScreen({ navigation }) {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    languagesAPI.getAll({ mvpOnly: 'true' })
      .then(({ data }) => setLanguages(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = languages.filter(l =>
    l.nom.toLowerCase().includes(search.toLowerCase()) ||
    l.famille?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('LessonDetail', { languageId: item.id, languageCode: item.code, languageName: item.nom })}
    >
      <View style={styles.cardLeft}>
        <View style={styles.avatarBadge}>
          <Text style={styles.avatarText}>{item.nom.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.langName}>{item.nom}</Text>
          <Text style={styles.langFamily}>{item.famille} · {item.region}</Text>
          <Text style={styles.langSpeakers}>{(item.locuteurs / 1000000).toFixed(1)}M locuteurs</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.countBadge}>{item._count?.lessons ?? 0} leçons</Text>
        {item.tutor && (
          <Text style={styles.tutorName}>Tuteur : {item.tutor.nomAvatar}</Text>
        )}
        <Ionicons name="chevron-forward" size={18} color="#ccc" style={{ marginTop: 4 }} />
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={COLORS.accent} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une langue..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#aaa"
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>Aucune langue trouvée</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16,
               borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8,
               shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center',
          shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatarBadge: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary,
                 justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  info: { flex: 1 },
  langName: { fontSize: 17, fontWeight: 'bold', color: '#1A1A1A' },
  langFamily: { fontSize: 13, color: '#666', marginTop: 2 },
  langSpeakers: { fontSize: 12, color: COLORS.accent, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 2 },
  countBadge: { fontSize: 12, backgroundColor: '#E8F5E9', color: COLORS.primary,
                borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, fontWeight: '600' },
  tutorName: { fontSize: 11, color: '#999', marginTop: 2 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 16 },
});
