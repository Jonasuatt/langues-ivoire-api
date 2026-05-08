import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
  Image, Animated, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tutorsAPI } from '../services/api';
import AudioButton from '../components/AudioButton';
import { getAvatar } from '../data/avatars';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#F5F5F0' };

// ─── Catégories enrichies ───────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'Salutations', icon: 'hand-left-outline' },
  { key: 'Famille',     icon: 'people-outline' },
  { key: 'Marché',      icon: 'storefront-outline' },
  { key: 'Chiffres',    icon: 'calculator-outline' },
  { key: 'Couleurs',    icon: 'color-palette-outline' },
  { key: 'Nature',      icon: 'leaf-outline' },
  { key: 'Corps',       icon: 'body-outline' },
  { key: 'Voyage',      icon: 'airplane-outline' },
  { key: 'Fête',        icon: 'sparkles-outline' },
  { key: 'Urgence',     icon: 'medical-outline' },
];

// ─── Suggestions rapides par catégorie ─────────────────────────────────────
const QUICK_REPLIES = {
  Salutations: ['Comment dit-on bonjour ?', 'Et au revoir ?', 'Comment ça va ?', 'Enseigne-moi les salutations du matin'],
  Famille:     ['Comment dit-on père et mère ?', 'Et frère et sœur ?', 'Comment appelle-t-on un oncle ?', 'C\'est quoi "enfant" ?'],
  Marché:      ['Comment demander le prix ?', 'Comment négocier ?', 'Comment dire "c\'est trop cher" ?', 'Et "je prends ça" ?'],
  Chiffres:    ['Compte de 1 à 5', 'Comment dit-on 10 ?', 'Et 20 et 100 ?', 'Comment donner son âge ?'],
  Couleurs:    ['Quelles sont les couleurs de base ?', 'Comment dit-on "rouge" ?', 'Et "vert" ?', 'Couleur préférée en langue locale ?'],
  Nature:      ['Comment dit-on "eau" ?', 'Et "forêt" ?', 'Comment appelle-t-on le soleil ?', 'Et la pluie ?'],
  Corps:       ['Les parties du visage ?', 'Comment dit-on "main" ?', 'Et "cœur" ?', 'Expressions avec le corps ?'],
  Voyage:      ['Comment demander son chemin ?', 'Comment dire "loin" et "près" ?', 'Et "à gauche / à droite" ?', 'Comment dire "arrêtez ici" ?'],
  Fête:        ['Comment féliciter quelqu\'un ?', 'Joyeux anniversaire ?', 'Comment dire "santé !" ?', 'Les fêtes traditionnelles ?'],
  Urgence:     ['Comment appeler à l\'aide ?', 'Où est l\'hôpital ?', 'Je suis malade ?', 'Appelez la police ?'],
};

// ─── Rendu Markdown simplifié : **gras**, *italique*, ~~barré~~ ────────────
function MarkdownText({ text, style }) {
  if (!text) return null;

  // Découpe le texte en segments par type de formatage
  const segments = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|🔈[^\n]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'plain', text: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('**') && raw.endsWith('**')) {
      segments.push({ type: 'bold', text: raw.slice(2, -2) });
    } else if (raw.startsWith('*') && raw.endsWith('*') && !raw.startsWith('**')) {
      segments.push({ type: 'italic', text: raw.slice(1, -1) });
    } else if (raw.startsWith('~~') && raw.endsWith('~~')) {
      segments.push({ type: 'strike', text: raw.slice(2, -2) });
    } else if (raw.startsWith('🔈')) {
      segments.push({ type: 'correction', text: raw });
    }
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'plain', text: text.slice(lastIndex) });
  }

  return (
    <Text style={style}>
      {segments.map((seg, i) => {
        if (seg.type === 'bold')       return <Text key={i} style={{ fontWeight: 'bold', color: COLORS.primary }}>{seg.text}</Text>;
        if (seg.type === 'italic')     return <Text key={i} style={{ fontStyle: 'italic', color: '#666' }}>{seg.text}</Text>;
        if (seg.type === 'strike')     return <Text key={i} style={{ textDecorationLine: 'line-through', color: '#f44' }}>{seg.text}</Text>;
        if (seg.type === 'correction') return <Text key={i} style={{ color: '#E65100', fontStyle: 'italic' }}>{seg.text}</Text>;
        return <Text key={i}>{seg.text}</Text>;
      })}
    </Text>
  );
}

// ─── Indicateur "en train d'écrire..." ─────────────────────────────────────
function TypingIndicator({ name }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animate = (dot, delay) => Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
        Animated.timing(dot, { toValue:  0, duration: 300, useNativeDriver: true }),
        Animated.delay(600),
      ])
    ).start();
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={styles.typingWrap}>
      <Text style={styles.typingName}>{name}</Text>
      <View style={styles.typingBubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View key={i} style={[styles.typingDot, { transform: [{ translateY: dot }] }]} />
        ))}
      </View>
    </View>
  );
}

export default function TutorChatScreen({ route }) {
  const { tutor } = route.params;
  const insets = useSafeAreaInsets();
  const localPortrait = getAvatar(tutor.nomAvatar, 'portrait');
  const localNeutre   = getAvatar(tutor.nomAvatar, 'neutre');

  // ─── État ────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'tutor',
      text: `Bonjour ! Je suis **${tutor.nomAvatar}**, votre tuteur ${tutor.language?.nom}. Choisissez une catégorie ou posez-moi votre première question ! 🌍`,
    },
  ]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [category, setCategory]   = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const listRef = useRef(null);

  // ─── Historique pour l'IA (format {role, content}) ──────────────────────
  const conversationHistory = useRef([]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 150);
  }, []);

  // ─── Envoi d'un message ──────────────────────────────────────────────────
  const send = useCallback(async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setShowSuggestions(false);
    setLoading(true);
    scrollToBottom();

    // Ajouter au contexte d'historique
    conversationHistory.current.push({ role: 'user', content: text });

    try {
      const { data } = await tutorsAPI.chat(tutor.id, {
        message: text,
        categorie: category,
        conversationHistory: conversationHistory.current.slice(-10), // max 10 messages
      });

      const reply = data.reply || 'Je suis temporairement indisponible.';
      setMessages(m => [...m, {
        id: Date.now().toString() + '_r',
        role: 'tutor',
        text: reply,
        audioText: reply.replace(/\*\*|~~|\*/g, ''), // version sans markdown pour TTS
      }]);

      // Ajouter la réponse à l'historique
      conversationHistory.current.push({ role: 'assistant', content: reply });
    } catch {
      const errReply = 'Désolé, je suis momentanément indisponible. Réessayez dans quelques instants. 🙏';
      setMessages(m => [...m, {
        id: Date.now().toString() + '_err',
        role: 'tutor',
        text: errReply,
      }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [input, loading, category, tutor.id, scrollToBottom]);

  // ─── Changement de catégorie ─────────────────────────────────────────────
  const selectCategory = useCallback((cat) => {
    const next = cat === category ? null : cat;
    setCategory(next);
    setShowSuggestions(!!next);
    if (next) {
      // Message automatique pour amorcer
      send(`Je veux apprendre le thème : ${next}`);
    }
  }, [category, send]);

  // ─── Rendu d'un message ──────────────────────────────────────────────────
  const renderMessage = useCallback(({ item }) => {
    const isTutor = item.role === 'tutor';
    return (
      <View style={[styles.msgWrap, isTutor ? styles.msgWrapLeft : styles.msgWrapRight]}>
        {isTutor && (
          localNeutre ? (
            <Image source={localNeutre} style={styles.avatarMiniImg} resizeMode="cover" />
          ) : (
            <View style={[styles.avatarMini, { backgroundColor: '#0B3D2E' }]}>
              <Text style={styles.avatarMiniText}>{tutor.nomAvatar.slice(0, 1)}</Text>
            </View>
          )
        )}
        <View style={[styles.bubble, isTutor ? styles.tutorBubble : styles.userBubble, { maxWidth: '78%' }]}>
          {isTutor && (
            <Text style={styles.bubbleName}>{tutor.nomAvatar}</Text>
          )}
          <MarkdownText
            text={item.text}
            style={[styles.bubbleText, !isTutor && { color: '#fff' }]}
          />
          {/* AudioButton sur les messages du tuteur */}
          {isTutor && item.text.length > 5 && (
            <View style={styles.audioRow}>
              <AudioButton
                text={item.audioText || item.text.replace(/\*\*|~~|\*/g, '')}
                langCode={tutor.language?.code || 'fr'}
                gender={tutor.genre}
                size={16}
                color={COLORS.primary}
                style={styles.audioBtn}
              />
              <Text style={styles.audioHint}>Écouter</Text>
            </View>
          )}
        </View>
      </View>
    );
  }, [tutor]);

  // ─── Suggestions rapides ─────────────────────────────────────────────────
  const suggestions = category ? (QUICK_REPLIES[category] || []) : [];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
      {/* En-tête tuteur */}
      <LinearGradient colors={[COLORS.primary, '#1a5c45']} style={styles.header}>
        {localPortrait ? (
          <Image source={localPortrait} style={styles.avatarImage} resizeMode="cover" />
        ) : tutor.imageUrl ? (
          <Image source={{ uri: tutor.imageUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarInitial}>{tutor.nomAvatar.slice(0, 1)}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.tutorName}>{tutor.nomAvatar}</Text>
          <Text style={styles.tutorLang}>
            {tutor.language?.nom}
            {tutor.personalite ? ` · ${tutor.personalite.split('.')[0]}` : ''}
          </Text>
        </View>
        <View style={styles.onlineDot} />
      </LinearGradient>

      {/* Catégories (défilement horizontal) */}
      <View style={styles.catContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={c => c.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.catChip, category === item.key && styles.catChipActive]}
              onPress={() => selectCategory(item.key)}
              disabled={loading}
            >
              <Ionicons
                name={item.icon}
                size={13}
                color={category === item.key ? '#fff' : '#666'}
              />
              <Text style={[styles.catChipText, category === item.key && { color: '#fff' }]}>
                {item.key}
              </Text>
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
        contentContainerStyle={{ padding: 12, gap: 10, paddingBottom: 8 }}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
      />

      {/* Indicateur de frappe */}
      {loading && <TypingIndicator name={tutor.nomAvatar} />}

      {/* Suggestions rapides */}
      {showSuggestions && suggestions.length > 0 && !loading && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsRow}
          style={styles.suggestionsWrap}
        >
          {suggestions.map((s, i) => (
            <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => send(s)}>
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Zone de saisie */}
      <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
        <TextInput
          style={styles.inputField}
          placeholder={`Écrire à ${tutor.nomAvatar}…`}
          value={input}
          onChangeText={setInput}
          multiline
          placeholderTextColor="#aaa"
          onSubmitEditing={() => send()}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.4 }]}
          onPress={() => send()}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Header
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingTop: 10 },
  avatarSmall: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)',
                  justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  avatarInitial: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  tutorName:     { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  tutorLang:     { fontSize: 12, color: '#c8e6c9', marginTop: 1 },
  onlineDot:     { width: 10, height: 10, borderRadius: 5, backgroundColor: '#69F0AE', marginLeft: 4 },

  // Catégories
  catContainer: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  catChip:      { flexDirection: 'row', alignItems: 'center', gap: 5,
                  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F0F0F0' },
  catChipActive: { backgroundColor: COLORS.accent },
  catChipText:   { fontSize: 12, fontWeight: '600', color: '#555' },

  // Messages
  msgWrap:      { flexDirection: 'row', gap: 8 },
  msgWrapLeft:  { alignItems: 'flex-end' },
  msgWrapRight: { justifyContent: 'flex-end' },

  avatarMini:     { width: 28, height: 28, borderRadius: 14, justifyContent: 'center',
                    alignItems: 'center', marginBottom: 4, flexShrink: 0 },
  avatarMiniText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  avatarMiniImg:  { width: 28, height: 28, borderRadius: 14, marginBottom: 4, flexShrink: 0 },

  bubble: { borderRadius: 18, padding: 12, flexShrink: 1 },
  tutorBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4,
                  shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  userBubble: { backgroundColor: COLORS.accent, borderBottomRightRadius: 4 },

  bubbleName: { fontSize: 10, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5, opacity: 0.6 },
  bubbleText: { fontSize: 14.5, color: '#1A1A1A', lineHeight: 22 },

  // Audio sous chaque bulle tuteur
  audioRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, opacity: 0.75 },
  audioBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(11,61,46,0.08)' },
  audioHint: { fontSize: 11, color: '#999' },

  // Typing indicator
  typingWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 6 },
  typingBubble: { flexDirection: 'row', gap: 4, backgroundColor: '#fff', borderRadius: 14, padding: 10,
                  shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  typingDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#aaa' },

  // Suggestions
  suggestionsWrap: { maxHeight: 48, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  suggestionsRow:  { paddingHorizontal: 12, gap: 8, paddingVertical: 8 },
  suggestionChip:  { backgroundColor: '#FFF3E0', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6,
                     borderWidth: 1, borderColor: '#FFE0B2' },
  suggestionText:  { fontSize: 12, color: '#E65100', fontWeight: '500' },

  // Input
  inputRow: { flexDirection: 'row', paddingTop: 10, paddingHorizontal: 12, gap: 10,
              backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'flex-end' },
  inputField: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 22, paddingHorizontal: 16,
                paddingVertical: 10, fontSize: 15, maxHeight: 100, color: '#1A1A1A' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.accent,
              justifyContent: 'center', alignItems: 'center' },
});
