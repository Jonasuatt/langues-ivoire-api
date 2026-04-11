import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tutorsAPI } from '../services/api';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

const CATEGORIES = ['Salutations', 'Famille', 'Marché', 'Urgence', 'Fête'];

export default function TutorChatScreen({ route }) {
  const { tutor } = route.params;
  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'tutor',
      text: `Bonjour ! Je suis ${tutor.nomAvatar}, votre tuteur ${tutor.language?.nom}. Comment puis-je vous aider aujourd'hui ?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const listRef = useRef(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await tutorsAPI.chat(tutor.id, { message: text, categorie: category });
      setMessages(m => [...m, { id: Date.now().toString() + '_r', role: 'tutor', text: data.reply }]);
    } catch {
      setMessages(m => [...m, {
        id: Date.now().toString() + '_err',
        role: 'tutor',
        text: 'Désolé, je suis temporairement indisponible. Réessayez dans quelques instants.',
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderMessage = ({ item }) => {
    const isTutor = item.role === 'tutor';
    return (
      <View style={[styles.bubble, isTutor ? styles.tutorBubble : styles.userBubble]}>
        {isTutor && <Text style={styles.bubbleName}>{tutor.nomAvatar}</Text>}
        <Text style={[styles.bubbleText, !isTutor && { color: '#fff' }]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      {/* En-tête tuteur */}
      <LinearGradient colors={[COLORS.primary, '#1a5c45']} style={styles.header}>
        {tutor.imageUrl ? (
          <Image source={{ uri: tutor.imageUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarInitial}>{tutor.nomAvatar.slice(0, 1)}</Text>
          </View>
        )}
        <View>
          <Text style={styles.tutorName}>{tutor.nomAvatar}</Text>
          <Text style={styles.tutorLang}>{tutor.language?.nom}</Text>
        </View>
      </LinearGradient>

      {/* Catégories */}
      <View style={styles.catRow}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={c => c}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.catChip, category === item && styles.catChipActive]}
              onPress={() => setCategory(item === category ? null : item)}
            >
              <Text style={[styles.catChipText, category === item && { color: '#fff' }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={i => i.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={COLORS.accent} />
          <Text style={styles.loadingText}>{tutor.nomAvatar} écrit…</Text>
        </View>
      )}

      {/* Saisie */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputField}
          placeholder={`Écrire à ${tutor.nomAvatar}…`}
          value={input}
          onChangeText={setInput}
          multiline
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
          onPress={send} disabled={!input.trim() || loading}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingTop: 10 },
  avatarSmall: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.25)',
                  justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  avatarInitial: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  tutorName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  tutorLang: { fontSize: 12, color: '#c8e6c9' },
  catRow: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  catChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F0F0F0' },
  catChipActive: { backgroundColor: COLORS.accent },
  catChipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 14 },
  tutorBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 4,
                  shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  userBubble: { backgroundColor: COLORS.accent, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleName: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  bubbleText: { fontSize: 15, color: '#1A1A1A', lineHeight: 22 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  loadingText: { fontSize: 13, color: '#999', fontStyle: 'italic' },
  inputRow: { flexDirection: 'row', padding: 12, gap: 10, backgroundColor: '#fff',
              borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'flex-end' },
  inputField: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 16,
                paddingVertical: 10, fontSize: 15, maxHeight: 100, color: '#1A1A1A' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.accent,
              justifyContent: 'center', alignItems: 'center' },
});
