/**
 * LanguagePicker — composant réutilisable
 * Affiche un bouton "langue sélectionnée" qui ouvre un modal bottom-sheet
 * avec la liste complète des langues. Prévu pour supporter 60+ langues.
 */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList,
  StyleSheet, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = { primary: '#0B3D2E', accent: '#F47920' };

/**
 * @param {Array}    languages      — liste [{ id, code, nom, ... }]
 * @param {string}   selected       — code de la langue sélectionnée (ou '' pour "Toutes")
 * @param {Function} onSelect       — (code: string) => void
 * @param {string}   [allLabel]     — label pour l'option "toutes" (défaut : "Toutes les langues")
 * @param {string}   [placeholder]  — texte quand rien n'est sélectionné
 * @param {object}   [style]        — style supplémentaire du bouton trigger
 */
export default function LanguagePicker({
  languages = [],
  selected = '',
  onSelect,
  allLabel = 'Toutes les langues',
  placeholder = 'Sélectionner une langue',
  style,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedLang = languages.find(l => l.code === selected);
  const label = selected === '' ? allLabel : (selectedLang?.nom || placeholder);

  const filtered = languages.filter(l =>
    l.nom.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code) => {
    onSelect(code);
    setOpen(false);
    setSearch('');
  };

  return (
    <>
      {/* Bouton déclencheur */}
      <TouchableOpacity style={[styles.trigger, style]} onPress={() => setOpen(true)}>
        <View style={styles.triggerDot} />
        <Text style={styles.triggerText} numberOfLines={1}>{label}</Text>
        <Ionicons name="chevron-down" size={16} color="#888" />
      </TouchableOpacity>

      {/* Modal bottom-sheet */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Choisir une langue</Text>

          {/* Recherche si plus de 6 langues */}
          {languages.length > 6 && (
            <View style={styles.searchRow}>
              <Ionicons name="search" size={16} color="#aaa" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher..."
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="#bbb"
                autoCorrect={false}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={18} color="#aaa" />
                </TouchableOpacity>
              )}
            </View>
          )}

          <FlatList
            data={[{ id: '__all__', code: '', nom: allLabel }, ...filtered]}
            keyExtractor={item => item.id || item.code}
            style={styles.list}
            renderItem={({ item }) => {
              const isActive = item.code === selected;
              return (
                <TouchableOpacity
                  style={[styles.option, isActive && styles.optionActive]}
                  onPress={() => handleSelect(item.code)}
                >
                  <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                    {item.nom}
                  </Text>
                  {isActive && <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F5F5F5', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  triggerDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent,
  },
  triggerText: {
    flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.primary,
  },

  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: 32, maxHeight: '70%',
  },
  handle: {
    width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2,
    alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#1A1A1A',
    textAlign: 'center', paddingVertical: 12,
  },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: '#F5F5F5', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  list: { flexGrow: 0 },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  optionActive: { backgroundColor: '#FFF3E0' },
  optionText: { fontSize: 15, color: '#333' },
  optionTextActive: { color: COLORS.accent, fontWeight: '700' },
});
