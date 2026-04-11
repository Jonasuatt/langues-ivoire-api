import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dictionaryAPI, languagesAPI } from '../services/api';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

const TYPES = [
  { key: 'word', label: 'Un mot', icon: 'text' },
  { key: 'phrase', label: 'Une phrase', icon: 'chatbubble-ellipses' },
];

export default function ContributeScreen({ navigation }) {
  const [type, setType] = useState('word');
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [form, setForm] = useState({ mot: '', traduction: '', transcription: '', categorie: '', contexte: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    languagesAPI.getAll({ mvpOnly: 'true' }).then(({ data }) => {
      setLanguages(data);
      if (data.length) setSelectedLang(data[0]);
    });
  }, []);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    const mainField = type === 'word' ? form.mot : form.phrase;
    if (!mainField || !form.traduction || !selectedLang) {
      return Alert.alert('Champs manquants', 'Veuillez remplir les champs obligatoires (*).');
    }
    setLoading(true);
    try {
      if (type === 'word') {
        await dictionaryAPI.contributeWord({ languageId: selectedLang.id, ...form });
      } else {
        await dictionaryAPI.contributePhrase({
          languageId: selectedLang.id,
          phrase: form.mot,
          traduction: form.traduction,
          transcription: form.transcription,
          categorie: form.categorie,
          contexte: form.contexte,
        });
      }
      Alert.alert('Merci !', 'Votre contribution a été soumise. Elle sera vérifiée par notre équipe.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.intro}>
        Contribuez à l'enrichissement des langues ivoiriennes ! Votre soumission sera vérifiée avant publication.
      </Text>

      {/* Type de contribution */}
      <Text style={styles.label}>Type de contribution</Text>
      <View style={styles.typeRow}>
        {TYPES.map(t => (
          <TouchableOpacity key={t.key} style={[styles.typeBtn, type === t.key && styles.typeBtnActive]}
            onPress={() => setType(t.key)}>
            <Ionicons name={t.icon} size={18} color={type === t.key ? '#fff' : '#555'} />
            <Text style={[styles.typeBtnText, type === t.key && { color: '#fff' }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sélection de la langue */}
      <Text style={styles.label}>Langue *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ marginBottom: 16 }}>
        {languages.map(lang => (
          <TouchableOpacity key={lang.id} style={[styles.langChip, selectedLang?.id === lang.id && styles.langChipActive]}
            onPress={() => setSelectedLang(lang)}>
            <Text style={[styles.langChipText, selectedLang?.id === lang.id && { color: '#fff' }]}>{lang.nom}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Formulaire */}
      {[
        { key: 'mot', placeholder: type === 'word' ? 'Mot en langue locale *' : 'Phrase en langue locale *', required: true },
        { key: 'traduction', placeholder: 'Traduction en français *', required: true },
        { key: 'transcription', placeholder: 'Transcription phonétique (ex: [mɔ ɔ])' },
        { key: 'categorie', placeholder: 'Catégorie (salutations, famille, marché…)' },
        { key: 'contexte', placeholder: 'Contexte d\'utilisation ou exemple de phrase' },
      ].map(({ key, placeholder }) => (
        <TextInput
          key={key}
          style={[styles.input, key === 'contexte' && { height: 80, textAlignVertical: 'top' }]}
          placeholder={placeholder}
          value={form[key]}
          onChangeText={v => update(key, v)}
          multiline={key === 'contexte'}
          placeholderTextColor="#aaa"
        />
      ))}

      <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <>
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.submitBtnText}>Soumettre ma contribution</Text>
            </>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 20, backgroundColor: '#E8F5E9',
           borderRadius: 12, padding: 14 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
             paddingVertical: 12, borderRadius: 12, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: 'transparent' },
  typeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeBtnText: { fontWeight: '600', fontSize: 14, color: '#555' },
  langChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: '#F0F0F0' },
  langChipActive: { backgroundColor: COLORS.primary },
  langChipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  input: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0',
           paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, marginBottom: 12, color: '#1A1A1A' },
  submitBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 16,
               flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
