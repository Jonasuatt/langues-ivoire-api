import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, SectionList, Keyboard,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchAPI } from '../services/api';
import AudioButton from '../components/AudioButton';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8', text: '#1A1A1A' };
const RECENT_KEY = 'search_recent';
const MAX_RECENT = 6;

// ─── Couleur par langue ────────────────────────────────────────────────────
const LANG_COLORS = {
  baoule: '#0B3D2E', dioula: '#1565C0', bete: '#6A1B9A',
  senoufo: '#C62828', agni: '#00897B', gouro: '#EF6C00',
  guere: '#AD1457', nouchi: '#37474F',
};

const langColor = (code) => LANG_COLORS[code] || COLORS.primary;

// ─── Badge langue ──────────────────────────────────────────────────────────
const LangBadge = ({ lang }) => {
  if (!lang) return null;
  return (
    <View style={[styles.badge, { backgroundColor: langColor(lang.code) }]}>
      <Text style={styles.badgeText}>{lang.nom}</Text>
    </View>
  );
};

// ─── Résultat : mot du dictionnaire ───────────────────────────────────────
const MotResult = ({ item }) => (
  <View style={styles.resultCard}>
    <View style={{ flex: 1 }}>
      <View style={styles.resultTopRow}>
        <Text style={styles.motText}>{item.mot}</Text>
        <LangBadge lang={item.language} />
      </View>
      {item.phonetique && <Text style={styles.phonetique}>{item.phonetique}</Text>}
      <Text style={styles.traduction}>{item.traduction}</Text>
      {item.exemple && <Text style={styles.exemple} numberOfLines={1}>ex: {item.exemple}</Text>}
    </View>
    <AudioButton
      audioUrl={item.audioUrl}
      text={item.mot}
      langCode={item.language?.code}
      size={22}
    />
  </View>
);

// ─── Résultat : leçon ──────────────────────────────────────────────────────
const LeconResult = ({ item, onPress }) => (
  <TouchableOpacity style={styles.resultCard} onPress={onPress} activeOpacity={0.75}>
    <View style={[styles.leconIcon, { backgroundColor: langColor(item.language?.code) }]}>
      <Ionicons name="book" size={18} color="#fff" />
    </View>
    <View style={{ flex: 1 }}>
      <View style={styles.resultTopRow}>
        <Text style={[styles.motText, { flex: 1 }]} numberOfLines={1}>{item.titre}</Text>
        <View style={styles.niveauBadge}>
          <Text style={styles.niveauText}>{item.niveau}</Text>
        </View>
      </View>
      {item.description && <Text style={styles.traduction} numberOfLines={2}>{item.description}</Text>}
      <Text style={styles.exemple}>{item.language?.nom} · {item.pointsXp} XP</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#ccc" style={{ marginLeft: 4 }} />
  </TouchableOpacity>
);

// ─── Résultat : culture ────────────────────────────────────────────────────
const CultureResult = ({ item, onPress }) => (
  <TouchableOpacity style={styles.resultCard} onPress={onPress} activeOpacity={0.75}>
    <View style={[styles.leconIcon, { backgroundColor: '#795548' }]}>
      <Ionicons name="sparkles" size={18} color="#fff" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.traduction} numberOfLines={3}>{item.contenu}</Text>
      {item.traduction && <Text style={styles.exemple} numberOfLines={1}>"{item.traduction}"</Text>}
      {item.sourceEthnique && <Text style={styles.exemple}>{item.sourceEthnique}</Text>}
    </View>
    <View style={{ alignItems: 'flex-end', gap: 6 }}>
      <LangBadge lang={item.language} />
      <AudioButton audioUrl={item.audioUrl} text={item.contenu} langCode={item.language?.code} size={18} />
    </View>
  </TouchableOpacity>
);

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);  // null = pas encore cherché
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ─── Charger recherches récentes ────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then(raw => {
      if (raw) setRecent(JSON.parse(raw));
    });
    // Auto-focus
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const saveRecent = useCallback(async (term) => {
    const updated = [term, ...recent.filter(r => r !== term)].slice(0, MAX_RECENT);
    setRecent(updated);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  }, [recent]);

  const clearRecent = useCallback(async () => {
    setRecent([]);
    await AsyncStorage.removeItem(RECENT_KEY);
  }, []);

  // ─── Recherche debouncée ─────────────────────────────────────────────────
  const doSearch = useCallback(async (term) => {
    if (!term || term.trim().length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await searchAPI.global(term.trim());
      setResults(data);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      await saveRecent(term.trim());
    } catch {
      setResults({ total: 0, mots: [], lecons: [], culture: [] });
    } finally {
      setLoading(false);
    }
  }, [saveRecent, fadeAnim]);

  const handleChange = (text) => {
    setQuery(text);
    clearTimeout(debounceTimer.current);
    if (text.length < 2) { setResults(null); return; }
    debounceTimer.current = setTimeout(() => doSearch(text), 350);
  };

  const handleRecentPress = (term) => {
    setQuery(term);
    doSearch(term);
    Keyboard.dismiss();
  };

  // ─── Navigation depuis résultats ─────────────────────────────────────────
  const openLesson = useCallback((lesson) => {
    Keyboard.dismiss();
    navigation.navigate('LessonDetail', {
      languageId:   lesson.language?.id   || '',
      languageCode: lesson.language?.code || '',
      languageName: lesson.language?.nom  || 'Leçons',
    });
  }, [navigation]);

  const openCultural = useCallback(() => {
    Keyboard.dismiss();
    navigation.navigate('Cultural');
  }, [navigation]);

  // ─── Sections des résultats ───────────────────────────────────────────────
  const buildSections = () => {
    if (!results) return [];
    const sections = [];
    if (results.mots?.length)    sections.push({ title: 'Mots & Phrases', type: 'mot',     data: results.mots });
    if (results.lecons?.length)  sections.push({ title: 'Leçons',         type: 'lecon',   data: results.lecons });
    if (results.culture?.length) sections.push({ title: 'Culture',        type: 'culture', data: results.culture });
    return sections;
  };

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length}</Text>
    </View>
  );

  const renderItem = ({ item, section }) => {
    if (section.type === 'mot')     return <MotResult item={item} />;
    if (section.type === 'lecon')   return <LeconResult item={item} onPress={() => openLesson(item)} />;
    if (section.type === 'culture') return <CultureResult item={item} onPress={openCultural} />;
    return null;
  };

  const sections = buildSections();
  const hasResults = sections.length > 0;
  const isEmpty = results && results.total === 0;

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.inputWrap}>
          <Ionicons name="search" size={18} color="#999" style={{ marginLeft: 10 }} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Chercher un mot, une leçon…"
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={handleChange}
            returnKeyType="search"
            onSubmitEditing={() => { doSearch(query); Keyboard.dismiss(); }}
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults(null); }} style={{ padding: 8 }}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loader */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      )}

      {/* Résultats */}
      {!loading && hasResults && (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            stickySectionHeadersEnabled
            ListHeaderComponent={
              <Text style={styles.totalText}>
                {results.total} résultat{results.total > 1 ? 's' : ''} pour "{results.query}"
              </Text>
            }
          />
        </Animated.View>
      )}

      {/* Aucun résultat */}
      {!loading && isEmpty && (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={56} color="#ddd" />
          <Text style={styles.emptyTitle}>Aucun résultat</Text>
          <Text style={styles.emptySubtitle}>
            Essayez un autre terme ou vérifiez l'orthographe.
          </Text>
        </View>
      )}

      {/* Recherches récentes (si pas encore tapé) */}
      {!loading && !results && (
        <View style={styles.recentWrap}>
          {recent.length > 0 ? (
            <>
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>Recherches récentes</Text>
                <TouchableOpacity onPress={clearRecent}>
                  <Text style={styles.recentClear}>Effacer</Text>
                </TouchableOpacity>
              </View>
              {recent.map((term, i) => (
                <TouchableOpacity key={i} style={styles.recentItem} onPress={() => handleRecentPress(term)}>
                  <Ionicons name="time-outline" size={16} color="#aaa" />
                  <Text style={styles.recentText}>{term}</Text>
                  <Ionicons name="arrow-up-back" size={14} color="#ccc" />
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.center}>
              <Ionicons name="search-outline" size={52} color="#e0e0e0" />
              <Text style={styles.emptyTitle}>Recherche globale</Text>
              <Text style={styles.emptySubtitle}>
                Mots du dictionnaire, leçons et contenus culturels — tout dans une seule recherche.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // Barre
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 52, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  backBtn:   { padding: 4 },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f4f4f4', borderRadius: 12, height: 42,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.text, paddingHorizontal: 8, height: '100%' },

  // Sections
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.bg, paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#ececec',
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCount: { fontSize: 12, color: '#aaa', fontWeight: '600' },

  // Total
  totalText: { fontSize: 13, color: '#888', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },

  // Résultats
  resultCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', marginHorizontal: 12, marginTop: 8,
    borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  resultTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  motText:   { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  phonetique: { fontSize: 12, color: '#aaa', fontStyle: 'italic', marginBottom: 2 },
  traduction: { fontSize: 14, color: '#555', lineHeight: 20 },
  exemple:    { fontSize: 12, color: '#aaa', marginTop: 3 },

  // Badge langue
  badge:     { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },

  // Leçon
  leconIcon:  { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  niveauBadge: { backgroundColor: '#E8F5E9', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  niveauText:  { fontSize: 10, fontWeight: '700', color: '#2E7D32' },

  // Récents
  recentWrap: { flex: 1, padding: 16 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  recentTitle:  { fontSize: 13, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 0.4 },
  recentClear:  { fontSize: 13, color: COLORS.accent },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  recentText: { flex: 1, fontSize: 15, color: COLORS.text },

  // Empty / center
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12, paddingBottom: 80 },
  emptyTitle:    { fontSize: 18, fontWeight: 'bold', color: '#bbb' },
  emptySubtitle: { fontSize: 14, color: '#ccc', textAlign: 'center', lineHeight: 22 },
});
