import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Image, Modal, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { offlineLanguagesAPI as languagesAPI, offlineDictionaryAPI as dictionaryAPI } from '../services/offlineApi';
import AudioButton from '../components/AudioButton';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };
const SCREEN_W = Dimensions.get('window').width;

// Catégories visuelles alignées avec les catégories du dictionnaire
const VISUAL_CATEGORIES = [
  { key: 'animaux', label: 'Animaux', icon: '🐘', color: '#2E7D32' },
  { key: 'nourriture', label: 'Nourriture', icon: '🍲', color: '#00695C' },
  { key: 'corps', label: 'Corps humain', icon: '🤚', color: '#AD1457' },
  { key: 'famille', label: 'Famille', icon: '👨‍👩‍👧‍👦', color: '#F47920' },
  { key: 'nature', label: 'Nature', icon: '🌳', color: '#33691E' },
  { key: 'habitat', label: 'Habitat', icon: '🏠', color: '#1565C0' },
  { key: 'chiffres', label: 'Chiffres', icon: '🔢', color: '#4E342E' },
  { key: 'couleurs', label: 'Couleurs', icon: '🎨', color: '#C62828' },
  { key: 'verbes', label: 'Verbes', icon: '🏃', color: '#5D4037' },
  { key: 'salutations', label: 'Salutations', icon: '👋', color: '#6A1B9A' },
  { key: 'expressions', label: 'Expressions', icon: '💬', color: '#E65100' },
  { key: 'transport', label: 'Transport', icon: '🚗', color: '#37474F' },
];

export default function ImagesScreen() {
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    languagesAPI.getAll({ mvpOnly: 'true' }).then(({ data }) => {
      setLanguages(data);
      if (data.length > 0) setSelectedLang(data[0]);
    });
  }, []);

  const loadCategory = useCallback(async (cat, lang) => {
    const langToUse = lang || selectedLang;
    if (!langToUse) return;
    setActiveCategory(cat);
    setLoading(true);
    try {
      const { data } = await dictionaryAPI.get(langToUse.code, {
        categorie: cat.key,
        limit: 100,
      });
      const results = Array.isArray(data) ? data : (data.data || []);
      setEntries(results);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLang]);

  const selectLanguage = (lang) => {
    setSelectedLang(lang);
    setDropdownOpen(false);
    if (activeCategory) loadCategory(activeCategory, lang);
  };

  // Si on n'a pas encore choisi de catégorie, afficher la grille de catégories
  if (!activeCategory) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <LinearGradient colors={['#AD1457', '#D81B60']} style={styles.banner}>
          <Ionicons name="images" size={30} color="#F8BBD0" />
          <Text style={styles.bannerTitle}>Apprendre par l'Image</Text>
          <Text style={styles.bannerSub}>
            Découvrez le vocabulaire à travers des catégories visuelles
          </Text>
        </LinearGradient>

        {/* Sélecteur de langue */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Langue :</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen(!dropdownOpen)}>
            <Ionicons name="earth" size={18} color={COLORS.primary} />
            <Text style={styles.dropdownText}>{selectedLang?.nom || 'Sélectionner'}</Text>
            <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#888" />
          </TouchableOpacity>
        </View>

        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
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
        )}

        <FlatList
          data={VISUAL_CATEGORIES}
          keyExtractor={item => item.key}
          numColumns={3}
          contentContainerStyle={{ padding: 12, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.catCard, { borderColor: item.color }]}
              onPress={() => loadCategory(item)}
            >
              <View style={[styles.catIcon, { backgroundColor: item.color + '15' }]}>
                <Text style={{ fontSize: 28 }}>{item.icon}</Text>
              </View>
              <Text style={[styles.catLabel, { color: item.color }]}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // Vue liste des mots de la catégorie sélectionnée
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient colors={[activeCategory.color, activeCategory.color + 'CC']} style={styles.catBanner}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { setActiveCategory(null); setEntries([]); }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 34 }}>{activeCategory.icon}</Text>
        <Text style={styles.catBannerTitle}>{activeCategory.label}</Text>
        <Text style={styles.catBannerSub}>{entries.length} mot(s) en {selectedLang?.nom}</Text>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} size="large" style={{ marginTop: 40 }} />
      ) : entries.length > 0 ? (
        <FlatList
          data={entries}
          keyExtractor={(item, i) => item.id || String(i)}
          contentContainerStyle={{ padding: 14, gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.wordCard} onPress={() => setSelectedEntry(item)}>
              {/* Image si disponible */}
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.wordImage} />
              ) : (
                <View style={[styles.wordImagePlaceholder, { backgroundColor: activeCategory.color + '15' }]}>
                  <Text style={{ fontSize: 30 }}>{activeCategory.icon}</Text>
                </View>
              )}

              <View style={styles.wordInfo}>
                <Text style={styles.wordMot}>{item.mot || item.phrase}</Text>
                {item.transcription && <Text style={styles.wordPhon}>[{item.transcription}]</Text>}
                <Text style={styles.wordTrad}>{item.traduction}</Text>
              </View>

              <View style={styles.wordAudioCol}>
                <AudioButton
                  audioUrl={item.audioUrl}
                  text={item.mot || item.phrase}
                  langCode={selectedLang?.code}
                  size={22}
                />
                <AudioButton
                  text={item.traduction}
                  langCode="fr"
                  size={18}
                  color={COLORS.primary}
                  style={{ backgroundColor: 'rgba(11,61,46,0.08)' }}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyBox}>
          <Text style={{ fontSize: 50 }}>{activeCategory.icon}</Text>
          <Text style={styles.emptyTitle}>
            Pas encore de mots pour "{activeCategory.label}" en {selectedLang?.nom}
          </Text>
          <Text style={styles.emptyText}>
            Cette catégorie sera enrichie prochainement. Vous pouvez contribuer en ajoutant des mots via la section "Contribuer".
          </Text>
        </View>
      )}

      {/* Modal détail mot */}
      <Modal visible={!!selectedEntry} transparent animationType="slide" onRequestClose={() => setSelectedEntry(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedEntry(null)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            {selectedEntry && (
              <>
                {selectedEntry.imageUrl ? (
                  <Image source={{ uri: selectedEntry.imageUrl }} style={styles.modalImage} />
                ) : (
                  <View style={[styles.modalImagePlaceholder, { backgroundColor: activeCategory.color + '15' }]}>
                    <Text style={{ fontSize: 60 }}>{activeCategory.icon}</Text>
                  </View>
                )}

                <View style={styles.modalMotRow}>
                  <Text style={styles.modalMot}>{selectedEntry.mot || selectedEntry.phrase}</Text>
                  <AudioButton
                    audioUrl={selectedEntry.audioUrl}
                    text={selectedEntry.mot || selectedEntry.phrase}
                    langCode={selectedLang?.code}
                    size={28}
                  />
                </View>

                {selectedEntry.transcription && (
                  <Text style={styles.modalPhon}>[{selectedEntry.transcription}]</Text>
                )}

                <View style={styles.modalTradRow}>
                  <Text style={styles.modalTrad}>{selectedEntry.traduction}</Text>
                  <AudioButton text={selectedEntry.traduction} langCode="fr" size={22} color={COLORS.primary} />
                </View>

                {selectedEntry.exemplePhrase && (
                  <View style={styles.exempleBox}>
                    <Text style={styles.exempleLabel}>Exemple :</Text>
                    <View style={styles.exempleRow}>
                      <Text style={[styles.exempleText, { flex: 1 }]}>{selectedEntry.exemplePhrase}</Text>
                      <AudioButton text={selectedEntry.exemplePhrase} langCode={selectedLang?.code} size={20} />
                    </View>
                    {selectedEntry.exempleTraduction && (
                      <View style={styles.exempleRow}>
                        <Text style={[styles.exempleTrad, { flex: 1 }]}>"{selectedEntry.exempleTraduction}"</Text>
                        <AudioButton text={selectedEntry.exempleTraduction} langCode="fr" size={18} color={COLORS.primary} />
                      </View>
                    )}
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
  banner: { padding: 20, alignItems: 'center', gap: 4 },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  bannerSub: { fontSize: 13, color: '#F8BBD0', textAlign: 'center' },

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
    backgroundColor: '#fff', marginHorizontal: 14, borderRadius: 12,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
    borderWidth: 1, borderColor: '#E8E8E8', zIndex: 100,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  dropdownItemActive: { backgroundColor: '#FFF3E0' },
  dropdownItemText: { fontSize: 15, color: '#333' },
  dropdownItemTextActive: { color: COLORS.accent, fontWeight: 'bold' },

  catCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', gap: 8,
    borderWidth: 1.5, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  catIcon: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  catLabel: { fontSize: 12, fontWeight: '700', textAlign: 'center' },

  catBanner: { padding: 20, alignItems: 'center', gap: 6 },
  backBtn: { position: 'absolute', left: 14, top: 14 },
  catBannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  catBannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },

  wordCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row',
    alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  wordImage: { width: 60, height: 60, borderRadius: 12 },
  wordImagePlaceholder: {
    width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  wordInfo: { flex: 1 },
  wordMot: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary },
  wordPhon: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 1 },
  wordTrad: { fontSize: 14, color: '#555', marginTop: 3 },
  wordAudioCol: { gap: 6, alignItems: 'center' },

  emptyBox: { alignItems: 'center', padding: 40, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', textAlign: 'center' },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 22 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingTop: 16, maxHeight: '80%',
  },
  modalClose: { alignSelf: 'flex-end', padding: 4, marginBottom: 8 },
  modalImage: {
    width: SCREEN_W - 48, height: 180, borderRadius: 16, alignSelf: 'center', marginBottom: 16,
    resizeMode: 'cover',
  },
  modalImagePlaceholder: {
    width: SCREEN_W - 48, height: 140, borderRadius: 16, alignSelf: 'center', marginBottom: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  modalMotRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalMot: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary, flex: 1 },
  modalPhon: { fontSize: 15, color: '#888', fontStyle: 'italic', marginTop: 4 },
  modalTradRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  modalTrad: { fontSize: 18, color: '#1A1A1A', flex: 1 },

  exempleBox: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 14, marginTop: 16 },
  exempleLabel: { fontSize: 12, color: '#999', fontWeight: '600', marginBottom: 6 },
  exempleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  exempleText: { fontSize: 15, fontStyle: 'italic', color: COLORS.primary },
  exempleTrad: { fontSize: 13, color: '#666' },
});
