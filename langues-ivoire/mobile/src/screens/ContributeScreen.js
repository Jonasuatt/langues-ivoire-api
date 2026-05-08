import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Image, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { dictionaryAPI, uploadAPI } from '../services/api';
import { offlineLanguagesAPI as languagesAPI } from '../services/offlineApi';
import LanguagePicker from '../components/LanguagePicker';
import RecordButton from '../components/RecordButton';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8', danger: '#E53935' };

const TYPES = [
  { key: 'word',   label: 'Un mot',     icon: 'text' },
  { key: 'phrase', label: 'Une phrase', icon: 'chatbubble-ellipses' },
];

export default function ContributeScreen({ navigation }) {
  const [type, setType]           = useState('word');
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [form, setForm]   = useState({ mot: '', traduction: '', transcription: '', categorie: '', contexte: '' });
  const [loading, setLoading] = useState(false);

  // ── Médias ──────────────────────────────────────────────────────────────────
  const [audioUri, setAudioUri]   = useState(null);  // URI locale (enregistrement ou import)
  const [imageUri, setImageUri]   = useState(null);
  const [videoUri, setVideoUri]   = useState(null);
  const [videoThumb, setVideoThumb] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [showRecorder, setShowRecorder]     = useState(false);

  // Lecteur pour prévisualisation audio
  const player = useAudioPlayer(audioUri ? { uri: audioUri } : undefined);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    languagesAPI.getAll({ mvpOnly: 'true' }).then(({ data }) => {
      setLanguages(data);
      if (data.length) setSelectedLang(data[0]);
    });
  }, []);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Sélecteur d'image ───────────────────────────────────────────────────────
  const pickImage = async () => {
    const { status: perm } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm !== 'granted') {
      return Alert.alert('Permission requise', 'Autorisez l\'accès à la galerie pour joindre une image.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status: perm } = await ImagePicker.requestCameraPermissionsAsync();
    if (perm !== 'granted') {
      return Alert.alert('Permission requise', 'Autorisez l\'accès à la caméra pour prendre une photo.');
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ── Sélecteur de vidéo ──────────────────────────────────────────────────────
  const pickVideo = async () => {
    const { status: perm } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm !== 'granted') {
      return Alert.alert('Permission requise', 'Autorisez l\'accès à la galerie pour joindre une vidéo.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
      videoMaxDuration: 60, // 60 secondes max
    });
    if (!result.canceled && result.assets?.[0]) {
      setVideoUri(result.assets[0].uri);
      setVideoThumb(result.assets[0].uri); // expo-image-picker donne parfois un thumbnail
    }
  };

  // ── Import audio depuis les fichiers ────────────────────────────────────────
  const importAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        setAudioUri(result.assets[0].uri);
        setShowRecorder(false);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible d\'importer le fichier audio.');
    }
  };

  // ── Upload d'un fichier média vers l'API ────────────────────────────────────
  const uploadMedia = async (uri, type, fieldName, mot, langCode) => {
    const ext = uri.split('.').pop()?.toLowerCase() || (type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'm4a');
    const mimeMap = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
      mp4: 'video/mp4', mov: 'video/quicktime', '3gp': 'video/3gpp',
      mp3: 'audio/mpeg', m4a: 'audio/m4a', wav: 'audio/wav', ogg: 'audio/ogg',
    };
    const mime = mimeMap[ext] || (type === 'image' ? 'image/jpeg' : type === 'video' ? 'video/mp4' : 'audio/m4a');

    const fd = new FormData();
    fd.append(fieldName, { uri, name: `contrib_${Date.now()}.${ext}`, type: mime });
    if (mot)     fd.append('mot', mot);
    if (langCode) fd.append('langueCode', langCode);

    if (type === 'image') {
      const { data } = await uploadAPI.contributeImage(fd);
      return data.imageUrl;
    } else if (type === 'video') {
      const { data } = await uploadAPI.contributeVideo(fd);
      return data.videoUrl;
    } else {
      const { data } = await uploadAPI.contributeAudio(fd);
      return data.audioUrl;
    }
  };

  // ── Soumission ───────────────────────────────────────────────────────────────
  const submit = async () => {
    const mainField = form.mot;
    if (!mainField || !form.traduction || !selectedLang) {
      return Alert.alert('Champs manquants', 'Veuillez remplir les champs obligatoires (*).');
    }
    setLoading(true);
    try {
      let resolvedAudioUrl = null;
      let resolvedImageUrl = null;
      let resolvedVideoUrl = null;

      // Upload des médias si présents
      if (audioUri || imageUri || videoUri) {
        setUploadingMedia(true);
      }
      if (audioUri) {
        resolvedAudioUrl = await uploadMedia(audioUri, 'audio', 'audio', mainField, selectedLang.code);
      }
      if (imageUri) {
        resolvedImageUrl = await uploadMedia(imageUri, 'image', 'image', mainField, selectedLang.code);
      }
      if (videoUri) {
        resolvedVideoUrl = await uploadMedia(videoUri, 'video', 'video', mainField, selectedLang.code);
      }
      setUploadingMedia(false);

      const payload = {
        languageId:    selectedLang.id,
        mot:           form.mot,
        traduction:    form.traduction,
        transcription: form.transcription,
        categorie:     form.categorie,
        contexte:      form.contexte,
        audioUrl:      resolvedAudioUrl,
        imageUrl:      resolvedImageUrl,
        videoUrl:      resolvedVideoUrl,
      };

      if (type === 'word') {
        await dictionaryAPI.contributeWord(payload);
      } else {
        await dictionaryAPI.contributePhrase({ ...payload, phrase: form.mot });
      }

      Alert.alert(
        'Merci !',
        'Votre contribution a été soumise avec ses médias. Elle sera vérifiée par notre équipe.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      setUploadingMedia(false);
      Alert.alert('Erreur', err.response?.data?.error || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Intro */}
      <Text style={styles.intro}>
        Contribuez à l'enrichissement des langues ivoiriennes ! Votre soumission sera vérifiée avant publication.
      </Text>

      {/* Type */}
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

      {/* Langue */}
      <Text style={styles.label}>Langue *</Text>
      <View style={{ marginBottom: 16 }}>
        <LanguagePicker
          languages={languages}
          selected={selectedLang?.code || ''}
          onSelect={(code) => setSelectedLang(languages.find(l => l.code === code) || null)}
          allLabel="Choisir une langue..."
        />
      </View>

      {/* Champs texte */}
      {[
        { key: 'mot',           placeholder: type === 'word' ? 'Mot en langue locale *' : 'Phrase en langue locale *', required: true },
        { key: 'traduction',    placeholder: 'Traduction en français *', required: true },
        { key: 'transcription', placeholder: 'Transcription phonétique (ex: [mɔ ɔ])' },
        { key: 'categorie',     placeholder: 'Catégorie (salutations, famille, marché…)' },
        { key: 'contexte',      placeholder: 'Contexte d\'utilisation ou exemple de phrase' },
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

      {/* ─────────────────────────── SECTION AUDIO ─────────────────────────── */}
      <Text style={[styles.label, { marginTop: 8 }]}>🎙️ Audio (optionnel)</Text>
      <View style={styles.mediaCard}>
        {audioUri ? (
          /* Prévisualisation audio */
          <View style={styles.audioPreview}>
            <Ionicons name="musical-note" size={24} color={COLORS.primary} />
            <Text style={styles.audioName} numberOfLines={1}>
              Fichier audio prêt
            </Text>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => {
                if (status?.playing) { player.pause(); }
                else { player.seekTo(0); player.play(); }
              }}
            >
              <Ionicons name={status?.playing ? 'pause-circle' : 'play-circle'} size={32} color={COLORS.accent} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAudioUri(null)} style={styles.removeBtn}>
              <Ionicons name="close-circle" size={22} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        ) : showRecorder ? (
          /* Enregistreur inline */
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <RecordButton
              size={56}
              maxDuration={60}
              onRecordingComplete={(uri) => { setAudioUri(uri); setShowRecorder(false); }}
            />
            <TouchableOpacity onPress={() => setShowRecorder(false)} style={{ marginTop: 12 }}>
              <Text style={{ color: '#999', fontSize: 13 }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Boutons d'action */
          <View style={styles.mediaActions}>
            <TouchableOpacity style={styles.mediaActionBtn} onPress={() => setShowRecorder(true)}>
              <Ionicons name="mic" size={22} color={COLORS.primary} />
              <Text style={styles.mediaActionText}>Enregistrer</Text>
            </TouchableOpacity>
            <View style={styles.mediaDivider} />
            <TouchableOpacity style={styles.mediaActionBtn} onPress={importAudio}>
              <Ionicons name="folder-open" size={22} color={COLORS.primary} />
              <Text style={styles.mediaActionText}>Importer un fichier</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ─────────────────────────── SECTION IMAGE ─────────────────────────── */}
      <Text style={[styles.label, { marginTop: 12 }]}>🖼️ Image (optionnel)</Text>
      <View style={styles.mediaCard}>
        {imageUri ? (
          <View style={styles.imagePreview}>
            <Image source={{ uri: imageUri }} style={styles.imageThumb} resizeMode="cover" />
            <TouchableOpacity onPress={() => setImageUri(null)} style={styles.removeBtnOverlay}>
              <Ionicons name="close-circle" size={26} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mediaActions}>
            <TouchableOpacity style={styles.mediaActionBtn} onPress={takePhoto}>
              <Ionicons name="camera" size={22} color={COLORS.primary} />
              <Text style={styles.mediaActionText}>Prendre une photo</Text>
            </TouchableOpacity>
            <View style={styles.mediaDivider} />
            <TouchableOpacity style={styles.mediaActionBtn} onPress={pickImage}>
              <Ionicons name="images" size={22} color={COLORS.primary} />
              <Text style={styles.mediaActionText}>Choisir depuis la galerie</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ─────────────────────────── SECTION VIDÉO ─────────────────────────── */}
      <Text style={[styles.label, { marginTop: 12 }]}>🎬 Vidéo (optionnel)</Text>
      <View style={styles.mediaCard}>
        {videoUri ? (
          <View style={styles.videoPreview}>
            <View style={styles.videoIconWrap}>
              <Ionicons name="videocam" size={32} color={COLORS.primary} />
              <Text style={styles.videoDuration}>Vidéo sélectionnée</Text>
            </View>
            <TouchableOpacity onPress={() => setVideoUri(null)} style={styles.removeBtn}>
              <Ionicons name="close-circle" size={22} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.mediaActionBtn, { justifyContent: 'center' }]} onPress={pickVideo}>
            <Ionicons name="cloud-upload-outline" size={22} color={COLORS.primary} />
            <Text style={styles.mediaActionText}>Choisir une vidéo (max 60 s)</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ─────────────────────────── BOUTON SUBMIT ─────────────────────────── */}
      <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={loading}>
        {loading ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.submitBtnText}>
              {uploadingMedia ? 'Envoi des médias…' : 'Soumission…'}
            </Text>
          </View>
        ) : (
          <>
            <Ionicons name="send" size={18} color="#fff" />
            <Text style={styles.submitBtnText}>Soumettre ma contribution</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 20,
    backgroundColor: '#E8F5E9', borderRadius: 12, padding: 14,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 12, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: 'transparent',
  },
  typeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeBtnText: { fontWeight: '600', fontSize: 14, color: '#555' },
  input: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0',
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, marginBottom: 12, color: '#1A1A1A',
  },

  // Cartes médias
  mediaCard: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E8E8E8',
    marginBottom: 4, overflow: 'hidden',
  },
  mediaActions: { flexDirection: 'row', alignItems: 'center' },
  mediaActionBtn: {
    flex: 1, flexDirection: 'column', alignItems: 'center', gap: 6,
    paddingVertical: 16, paddingHorizontal: 8,
  },
  mediaActionText: { fontSize: 12, color: COLORS.primary, fontWeight: '500', textAlign: 'center' },
  mediaDivider: { width: 1, height: 50, backgroundColor: '#F0F0F0' },

  // Audio preview
  audioPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 14, paddingHorizontal: 16,
  },
  audioName: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  playBtn: { marginRight: 4 },
  removeBtn: { padding: 4 },

  // Image preview
  imagePreview: { position: 'relative' },
  imageThumb: { width: '100%', height: 180, borderRadius: 14 },
  removeBtnOverlay: { position: 'absolute', top: 8, right: 8 },

  // Video preview
  videoPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 16, paddingHorizontal: 16,
  },
  videoIconWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  videoDuration: { fontSize: 14, color: COLORS.primary, fontWeight: '500' },

  // Submit
  submitBtn: {
    backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 16,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
