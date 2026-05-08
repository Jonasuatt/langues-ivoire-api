import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { offlineLanguagesAPI as languagesAPI, offlineDictionaryAPI as dictionaryAPI } from '../services/offlineApi';
import AudioButton from '../components/AudioButton';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

// Pronoms courants par famille de langue
const PRONOMS_DEFAULT = [
  { label: 'Je', key: '1s' },
  { label: 'Tu', key: '2s' },
  { label: 'Il / Elle', key: '3s' },
  { label: 'Nous', key: '1p' },
  { label: 'Vous', key: '2p' },
  { label: 'Ils / Elles', key: '3p' },
];

const TEMPS = [
  { label: 'Présent', key: 'present' },
  { label: 'Passé', key: 'passe' },
  { label: 'Futur', key: 'futur' },
  { label: 'Impératif', key: 'imperatif' },
];

// Verbes essentiels pour l'apprentissage
const VERBES_ESSENTIELS = [
  { fr: 'être', cat: 'Base' },
  { fr: 'avoir', cat: 'Base' },
  { fr: 'aller', cat: 'Mouvement' },
  { fr: 'venir', cat: 'Mouvement' },
  { fr: 'faire', cat: 'Action' },
  { fr: 'dire', cat: 'Communication' },
  { fr: 'manger', cat: 'Quotidien' },
  { fr: 'boire', cat: 'Quotidien' },
  { fr: 'dormir', cat: 'Quotidien' },
  { fr: 'voir', cat: 'Perception' },
  { fr: 'entendre', cat: 'Perception' },
  { fr: 'parler', cat: 'Communication' },
  { fr: 'donner', cat: 'Action' },
  { fr: 'prendre', cat: 'Action' },
  { fr: 'aimer', cat: 'Sentiment' },
  { fr: 'vouloir', cat: 'Sentiment' },
  { fr: 'pouvoir', cat: 'Base' },
  { fr: 'savoir', cat: 'Base' },
  { fr: 'travailler', cat: 'Quotidien' },
  { fr: 'acheter', cat: 'Commerce' },
  { fr: 'vendre', cat: 'Commerce' },
  { fr: 'saluer', cat: 'Communication' },
  { fr: 'danser', cat: 'Culture' },
  { fr: 'chanter', cat: 'Culture' },
];

const CATEGORIES = ['Tout', 'Base', 'Mouvement', 'Action', 'Communication', 'Quotidien', 'Sentiment', 'Commerce', 'Culture', 'Perception'];

export default function ConjugationScreen() {
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(140);
  const [selectedVerbe, setSelectedVerbe] = useState(null);
  const [activeTense, setActiveTense] = useState('present');
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [conjugations, setConjugations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    languagesAPI.getAll({ mvpOnly: 'true' }).then(({ data }) => {
      setLanguages(data);
      if (data.length > 0) setSelectedLang(data[0]);
    });
  }, []);

  // Quand un verbe est sélectionné, chercher ses conjugaisons dans le dictionnaire
  const loadConjugation = async (verbe) => {
    setSelectedVerbe(verbe);
    if (!selectedLang) return;
    setLoading(true);
    try {
      const { data } = await dictionaryAPI.search({ q: verbe.fr, langue: selectedLang.code });
      // Chercher les entrées de type verbe
      const verbEntries = Array.isArray(data) ? data.filter(e =>
        e.categorie?.toLowerCase() === 'verbes' ||
        e.categorie?.toLowerCase() === 'verbe' ||
        e.traduction?.toLowerCase().includes(verbe.fr.toLowerCase())
      ) : [];

      // Construire les conjugaisons à partir des données disponibles
      if (verbEntries.length > 0) {
        const entry = verbEntries[0];
        setConjugations([{
          mot: entry.mot,
          traduction: entry.traduction,
          transcription: entry.transcription,
          audioUrl: entry.audioUrl,
          exemplePhrase: entry.exemplePhrase,
          exempleTraduction: entry.exempleTraduction,
          conjugaisons: entry.conjugaisons || null,
        }]);
      } else {
        setConjugations([]);
      }
    } catch {
      setConjugations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredVerbes = activeCategory === 'Tout'
    ? VERBES_ESSENTIELS
    : VERBES_ESSENTIELS.filter(v => v.cat === activeCategory);

  const selectLanguage = (lang) => {
    setSelectedLang(lang);
    setDropdownOpen(false);
    setSelectedVerbe(null);
    setConjugations([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* En-tête */}
      <LinearGradient colors={['#00695C', '#00897B']} style={styles.banner}>
        <Ionicons name="language" size={30} color="#B2DFDB" />
        <Text style={styles.bannerTitle}>Conjugaison</Text>
        <Text style={styles.bannerSub}>Apprenez à conjuguer les verbes dans les langues ivoiriennes</Text>
      </LinearGradient>

      {/* Sélecteur de langue */}
      <View
        style={styles.dropdownContainer}
        onLayout={(e) => setDropdownTop(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}
      >
        <Text style={styles.dropdownLabel}>Langue :</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen(!dropdownOpen)}>
          <Ionicons name="earth" size={18} color={COLORS.primary} />
          <Text style={styles.dropdownText}>{selectedLang?.nom || 'Sélectionner'}</Text>
          <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Catégories de verbes — masquées sur la vue détail */}
      {!selectedVerbe && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 6, paddingVertical: 8, alignItems: 'center' }}
          style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', flexGrow: 0, flexShrink: 0, height: 46 }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => { setActiveCategory(cat); setDropdownOpen(false); }}>
              <Text style={[styles.catChipText, activeCategory === cat && { color: '#fff' }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Dropdown flottant — au-dessus du contenu, ne perturbe pas le layout */}
      {dropdownOpen && (
        <>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={() => setDropdownOpen(false)}
            activeOpacity={1}
          />
          <View style={[styles.dropdownMenu, { top: dropdownTop }]}>
            <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
              {languages.map(lang => (
                <TouchableOpacity key={lang.id}
                  style={[styles.dropdownItem, selectedLang?.id === lang.id && styles.dropdownItemActive]}
                  onPress={() => selectLanguage(lang)}>
                  <Text style={[styles.dropdownItemText, selectedLang?.id === lang.id && styles.dropdownItemTextActive]}>
                    {lang.nom}
                  </Text>
                  {selectedLang?.id === lang.id && <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}

      {/* Vue détail du verbe sélectionné */}
      {selectedVerbe ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          <TouchableOpacity style={styles.backBtn} onPress={() => { setSelectedVerbe(null); setConjugations([]); }}>
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            <Text style={styles.backBtnText}>Retour aux verbes</Text>
          </TouchableOpacity>

          <View style={styles.verbeHeader}>
            <Text style={styles.verbeFr}>{selectedVerbe.fr}</Text>
            <View style={[styles.verbeCatBadge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={{ fontSize: 12, color: '#2E7D32', fontWeight: '600' }}>{selectedVerbe.cat}</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator color={COLORS.accent} size="large" style={{ marginTop: 30 }} />
          ) : conjugations.length > 0 ? (
            conjugations.map((conj, i) => (
              <View key={i} style={styles.conjCard}>
                <View style={styles.conjMotRow}>
                  <View>
                    <Text style={styles.conjMot}>{conj.mot}</Text>
                    {conj.transcription && <Text style={styles.conjPhon}>[{conj.transcription}]</Text>}
                  </View>
                  <AudioButton
                    audioUrl={conj.audioUrl}
                    text={conj.mot}
                    langCode={selectedLang?.code}
                    size={26}
                  />
                </View>
                <Text style={styles.conjTrad}>{conj.traduction}</Text>

                {/* Onglets des temps */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 6, marginTop: 16, marginBottom: 12 }}>
                  {TEMPS.map(t => (
                    <TouchableOpacity key={t.key}
                      style={[styles.tenseChip, activeTense === t.key && styles.tenseChipActive]}
                      onPress={() => setActiveTense(t.key)}>
                      <Text style={[styles.tenseText, activeTense === t.key && { color: '#fff' }]}>{t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Tableau de conjugaison */}
                {conj.conjugaisons && conj.conjugaisons[activeTense] ? (
                  <View style={styles.conjTable}>
                    {PRONOMS_DEFAULT.map(pr => {
                      const forme = conj.conjugaisons[activeTense]?.[pr.key];
                      if (!forme) return null;
                      return (
                        <View key={pr.key} style={styles.conjRow}>
                          <Text style={styles.conjPronom}>{pr.label}</Text>
                          <Text style={styles.conjForme}>{forme}</Text>
                          <AudioButton text={forme} langCode={selectedLang?.code} size={18} />
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.noConjBox}>
                    <Ionicons name="information-circle" size={24} color="#999" />
                    <Text style={styles.noConjText}>
                      Les conjugaisons détaillées pour ce temps ne sont pas encore disponibles.
                      Les langues ivoiriennes ont des systèmes de conjugaison différents du français.
                    </Text>
                  </View>
                )}

                {/* Exemple */}
                {conj.exemplePhrase && (
                  <View style={styles.exempleBox}>
                    <Text style={styles.exempleLabel}>Exemple d'utilisation :</Text>
                    <View style={styles.exempleRow}>
                      <Text style={[styles.exempleText, { flex: 1 }]}>{conj.exemplePhrase}</Text>
                      <AudioButton text={conj.exemplePhrase} langCode={selectedLang?.code} size={20} />
                    </View>
                    {conj.exempleTraduction && (
                      <View style={styles.exempleRow}>
                        <Text style={[styles.exempleTrad, { flex: 1 }]}>"{conj.exempleTraduction}"</Text>
                        <AudioButton text={conj.exempleTraduction} langCode="fr" size={18} color={COLORS.primary} />
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.noConjBox}>
              <Ionicons name="book-outline" size={40} color="#ccc" />
              <Text style={styles.noConjTitle}>Verbe non trouvé en {selectedLang?.nom}</Text>
              <Text style={styles.noConjText}>
                Ce verbe n'est pas encore dans notre dictionnaire {selectedLang?.nom}.
                Vous pouvez contribuer en ajoutant ce mot via la section "Contribuer".
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        /* Liste des verbes */
        <FlatList
          data={filteredVerbes}
          keyExtractor={(item) => item.fr}
          numColumns={2}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 12, gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.verbeCard} onPress={() => loadConjugation(item)}>
              <View style={[styles.verbeIcon, { backgroundColor: getCatColor(item.cat) + '20' }]}>
                <Text style={{ fontSize: 18 }}>{getVerbeEmoji(item.cat)}</Text>
              </View>
              <Text style={styles.verbeLabel}>{item.fr}</Text>
              <Text style={styles.verbeCardCat}>{item.cat}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Aucun verbe dans cette catégorie</Text>}
        />
      )}
    </View>
  );
}

function getCatColor(cat) {
  const map = {
    Base: '#1565C0', Mouvement: '#E65100', Action: '#2E7D32', Communication: '#6A1B9A',
    Quotidien: '#00695C', Sentiment: '#AD1457', Commerce: '#F47920', Culture: '#4E342E',
    Perception: '#37474F',
  };
  return map[cat] || '#888';
}

function getVerbeEmoji(cat) {
  const map = {
    Base: '🔤', Mouvement: '🚶', Action: '✋', Communication: '💬',
    Quotidien: '🏠', Sentiment: '❤️', Commerce: '🛒', Culture: '🎭',
    Perception: '👁️',
  };
  return map[cat] || '📖';
}

const styles = StyleSheet.create({
  banner: { padding: 20, alignItems: 'center', gap: 4 },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  bannerSub: { fontSize: 13, color: '#B2DFDB', textAlign: 'center' },

  dropdownContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    paddingHorizontal: 14, paddingVertical: 10, gap: 10,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  dropdownLabel: { fontSize: 14, fontWeight: '600', color: '#555' },
  dropdown: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  dropdownText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.primary },
  dropdownMenu: {
    position: 'absolute',
    left: 14,
    right: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, elevation: 10,
    borderWidth: 1, borderColor: '#E8E8E8',
    zIndex: 999,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  dropdownItemActive: { backgroundColor: '#FFF3E0' },
  dropdownItemText: { fontSize: 15, color: '#333' },
  dropdownItemTextActive: { color: COLORS.accent, fontWeight: 'bold' },

  catChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, backgroundColor: '#F0F0F0' },
  catChipActive: { backgroundColor: '#00695C' },
  catChipText: { fontSize: 12, fontWeight: '600', color: '#555' },

  verbeCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  verbeIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  verbeLabel: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  verbeCardCat: { fontSize: 11, color: '#999' },

  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  backBtnText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  verbeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  verbeFr: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary },
  verbeCatBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },

  conjCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  conjMotRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  conjMot: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  conjPhon: { fontSize: 14, color: '#888', fontStyle: 'italic', marginTop: 2 },
  conjTrad: { fontSize: 16, color: '#555', marginTop: 6 },

  tenseChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0' },
  tenseChipActive: { backgroundColor: '#00695C' },
  tenseText: { fontSize: 13, fontWeight: '600', color: '#555' },

  conjTable: { borderRadius: 12, overflow: 'hidden' },
  conjRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5', gap: 8,
  },
  conjPronom: { width: 80, fontSize: 14, color: '#888', fontWeight: '500' },
  conjForme: { flex: 1, fontSize: 16, fontWeight: 'bold', color: COLORS.primary },

  noConjBox: { alignItems: 'center', padding: 30, gap: 12 },
  noConjTitle: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  noConjText: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 22 },

  exempleBox: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 14, marginTop: 16 },
  exempleLabel: { fontSize: 12, color: '#999', fontWeight: '600', marginBottom: 6 },
  exempleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  exempleText: { fontSize: 15, fontStyle: 'italic', color: COLORS.primary },
  exempleTrad: { fontSize: 13, color: '#666' },

  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 16 },
});
