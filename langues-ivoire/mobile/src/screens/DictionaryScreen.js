import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, Modal, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dictionaryAPI, languagesAPI } from '../services/api';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

const TABS = ['Mots', 'Phrases'];

export default function DictionaryScreen() {
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [tab, setTab] = useState(0);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    languagesAPI.getAll({ mvpOnly: 'true' }).then(({ data }) => {
      setLanguages(data);
      if (data.length > 0) setSelectedLang(data[0]);
    });
  }, []);

  const loadEntries = useCallback(async (reset = false) => {
    if (!selectedLang) return;
    setLoading(true);
    try {
      const p = reset ? 1 : page;
      const { data } = await dictionaryAPI.get(selectedLang.code, {
        tab: tab === 0 ? 'words' : 'phrases',
        page: p,
        limit: 30,
      });
      setEntries(prev => reset ? data.data : [...prev, ...data.data]);
      setHasMore(p < data.totalPages);
      if (!reset) setPage(p + 1);
    } catch {} finally {
      setLoading(false);
    }
  }, [selectedLang, tab, page]);

  useEffect(() => {
    if (selectedLang) {
      setEntries([]);
      setPage(1);
      setHasMore(true);
      loadEntries(true);
    }
  }, [selectedLang, tab]);

  const handleSearch = async (q) => {
    setSearch(q);
    if (q.length < 2) { loadEntries(true); return; }
    setLoading(true);
    try {
      const { data } = await dictionaryAPI.search({ q, langue: selectedLang?.code });
      setEntries(data);
      setHasMore(false);
    } catch {} finally { setLoading(false); }
  };

  const renderEntry = ({ item }) => (
    <TouchableOpacity style={styles.entryCard} onPress={() => setSelectedEntry(item)}>
      <View style={styles.entryLeft}>
        <Text style={styles.entryMot}>{item.mot || item.phrase}</Text>
        {item.transcription && <Text style={styles.entryPhon}>[{item.transcription}]</Text>}
      </View>
      <View style={styles.entryRight}>
        <Text style={styles.entryTrad} numberOfLines={2}>{item.traduction}</Text>
        {item.categorie && <View style={styles.catBadge}><Text style={styles.catText}>{item.categorie}</Text></View>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Sélecteur de langue */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langScroll}
        contentContainerStyle={{ padding: 12, gap: 8 }}>
        {languages.map(lang => (
          <TouchableOpacity key={lang.id}
            style={[styles.langChip, selectedLang?.id === lang.id && styles.langChipActive]}
            onPress={() => { setSelectedLang(lang); setSearch(''); }}>
            <Text style={[styles.langChipText, selectedLang?.id === lang.id && { color: '#fff' }]}>
              {lang.nom}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput style={styles.searchInput} placeholder="Rechercher un mot..."
          value={search} onChangeText={handleSearch} placeholderTextColor="#aaa" />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => { setSearch(''); loadEntries(true); }}>
            <Ionicons name="close-circle" size={18} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      {/* Onglets */}
      <View style={styles.tabs}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={i} style={[styles.tab, tab === i && styles.tabActive]} onPress={() => setTab(i)}>
            <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste */}
      <FlatList
        data={entries}
        keyExtractor={(item, i) => item.id || String(i)}
        renderItem={renderEntry}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        onEndReached={() => hasMore && !loading && loadEntries()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator color={COLORS.accent} style={{ margin: 16 }} />}
        ListEmptyComponent={!loading && <Text style={styles.empty}>Aucun résultat</Text>}
      />

      {/* Modal détail */}
      <Modal visible={!!selectedEntry} transparent animationType="slide" onRequestClose={() => setSelectedEntry(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedEntry(null)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            {selectedEntry && (
              <>
                <Text style={styles.modalMot}>{selectedEntry.mot || selectedEntry.phrase}</Text>
                {selectedEntry.transcription && (
                  <Text style={styles.modalPhon}>[{selectedEntry.transcription}]</Text>
                )}
                <Text style={styles.modalTrad}>{selectedEntry.traduction}</Text>
                {selectedEntry.exemplePhrase && (
                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleLabel}>Exemple :</Text>
                    <Text style={styles.exampleText}>{selectedEntry.exemplePhrase}</Text>
                    {selectedEntry.exempleTraduction && (
                      <Text style={styles.exampleTrad}>"{selectedEntry.exempleTraduction}"</Text>
                    )}
                  </View>
                )}
                {selectedEntry.categorie && (
                  <View style={[styles.catBadge, { alignSelf: 'flex-start', marginTop: 12 }]}>
                    <Text style={styles.catText}>{selectedEntry.categorie}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  langScroll: { maxHeight: 56, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  langChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
              backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: 'transparent' },
  langChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  langChipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 12,
               borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8,
               shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 12, borderRadius: 10,
          padding: 4, marginBottom: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.accent },
  tabText: { fontSize: 14, fontWeight: '600', color: '#888' },
  tabTextActive: { color: '#fff' },
  entryCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, flexDirection: 'row',
               gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  entryLeft: { width: 110 },
  entryMot: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  entryPhon: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 2 },
  entryRight: { flex: 1 },
  entryTrad: { fontSize: 14, color: '#1A1A1A' },
  catBadge: { backgroundColor: '#FFF3E0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4, alignSelf: 'flex-start' },
  catText: { fontSize: 11, color: COLORS.accent, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingTop: 20 },
  modalClose: { alignSelf: 'flex-end', padding: 4, marginBottom: 8 },
  modalMot: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  modalPhon: { fontSize: 16, color: '#888', fontStyle: 'italic', marginTop: 4 },
  modalTrad: { fontSize: 18, color: '#1A1A1A', marginTop: 12 },
  exampleBox: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 14, marginTop: 16 },
  exampleLabel: { fontSize: 12, color: '#999', fontWeight: '600', marginBottom: 4 },
  exampleText: { fontSize: 15, fontStyle: 'italic', color: COLORS.primary },
  exampleTrad: { fontSize: 13, color: '#666', marginTop: 4 },
});
