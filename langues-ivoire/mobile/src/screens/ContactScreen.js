import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supportAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

const SUJETS = [
  { key: 'bug',          label: '🐛 Signaler un bug',              desc: 'Problème technique ou comportement inattendu' },
  { key: 'contenu',      label: '📚 Question sur le contenu',       desc: 'Leçon, dictionnaire, audio incorrect' },
  { key: 'compte',       label: '👤 Problème de compte',            desc: 'Connexion, profil, données personnelles' },
  { key: 'suggestion',   label: '💡 Suggestion d\'amélioration',    desc: 'Idée pour enrichir l\'application' },
  { key: 'premium',      label: '⭐ Question Premium',              desc: 'Abonnement, paiement, fonctionnalités' },
  { key: 'autre',        label: '✉️ Autre',                         desc: 'Toute autre question ou préoccupation' },
];

function ThreadItem({ reply, isUser }) {
  return (
    <View style={[styles.threadItem, isUser ? styles.threadUser : styles.threadAdmin]}>
      {!isUser && (
        <View style={styles.adminAvatar}>
          <Ionicons name="shield-checkmark" size={14} color="#fff" />
        </View>
      )}
      <View style={[styles.threadBubble, isUser ? styles.bubbleUser : styles.bubbleAdmin]}>
        {!isUser && (
          <Text style={styles.threadAdminLabel}>Équipe Langues Ivoire</Text>
        )}
        <Text style={[styles.threadText, isUser && { color: '#fff' }]}>{reply.corps}</Text>
        <Text style={[styles.threadDate, isUser && { color: 'rgba(255,255,255,0.6)' }]}>
          {new Date(reply.createdAt).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
}

export default function ContactScreen({ navigation }) {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [view, setView] = useState('list'); // 'list' | 'new' | 'thread'
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Nouveau message
  const [sujetKey, setSujetKey] = useState(null);
  const [corps, setCorps] = useState('');
  const [sending, setSending] = useState(false);

  const load = () => {
    setLoading(true);
    supportAPI.getMine()
      .then(({ data }) => setMessages(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSend = async () => {
    if (!sujetKey) { Alert.alert('Choisissez un sujet'); return; }
    if (corps.trim().length < 20) {
      Alert.alert('Message trop court', 'Décrivez votre problème en au moins 20 caractères.');
      return;
    }
    setSending(true);
    try {
      const sujetLabel = SUJETS.find(s => s.key === sujetKey)?.label || sujetKey;
      await supportAPI.create({ sujet: sujetLabel, corps: corps.trim() });
      Alert.alert(
        '✅ Message envoyé !',
        'Notre équipe vous répondra dans les plus brefs délais. Vous recevrez une notification.',
        [{ text: 'OK', onPress: () => { setView('list'); setCorps(''); setSujetKey(null); load(); } }],
      );
    } catch {
      Alert.alert('Erreur', 'Impossible d\'envoyer le message. Vérifiez votre connexion.');
    } finally { setSending(false); }
  };

  const openThread = (msg) => {
    setSelected(msg);
    setView('thread');
  };

  const STATUT_CONFIG = {
    OUVERT:   { label: 'Ouvert',   color: '#1565C0', bg: '#E3F2FD' },
    EN_COURS: { label: 'En cours', color: '#E65100', bg: '#FFF3E0' },
    RESOLU:   { label: 'Résolu',   color: '#2E7D32', bg: '#E8F5E9' },
  };

  // ── VUE : Thread ──────────────────────────────────────────
  if (view === 'thread' && selected) {
    const sconf = STATUT_CONFIG[selected.statut] || STATUT_CONFIG.OUVERT;
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => { setView('list'); load(); }} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle} numberOfLines={1}>{selected.sujet}</Text>
            <View style={[styles.statutPill, { backgroundColor: sconf.bg }]}>
              <Text style={[styles.statutText, { color: sconf.color }]}>{sconf.label}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          {/* Message original */}
          <ThreadItem reply={{ corps: selected.corps, createdAt: selected.createdAt }} isUser />

          {/* Réponses */}
          {selected.reponses?.map(r => (
            <ThreadItem key={r.id} reply={r} isUser={false} />
          ))}

          {selected.reponses?.length === 0 && (
            <View style={styles.waitingBox}>
              <Ionicons name="time-outline" size={28} color="#999" />
              <Text style={styles.waitingText}>En attente de réponse</Text>
              <Text style={styles.waitingSubText}>Notre équipe vous répondra bientôt.</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── VUE : Nouveau message ─────────────────────────────────
  if (view === 'new') {
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => setView('list')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouveau message</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Quel est le sujet de votre message ?</Text>

          {SUJETS.map(s => (
            <TouchableOpacity key={s.key}
              style={[styles.sujetCard, sujetKey === s.key && styles.sujetCardActive]}
              onPress={() => setSujetKey(s.key)}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sujetLabel, sujetKey === s.key && { color: COLORS.primary }]}>
                  {s.label}
                </Text>
                <Text style={styles.sujetDesc}>{s.desc}</Text>
              </View>
              {sujetKey === s.key && (
                <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}

          <Text style={[styles.label, { marginTop: 20 }]}>Décrivez votre problème ou question</Text>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={6}
            placeholder="Soyez aussi précis que possible pour que nous puissions vous aider rapidement…"
            placeholderTextColor="#bbb"
            value={corps}
            onChangeText={setCorps}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{corps.length} / 1000 caractères</Text>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Vous serez notifié(e) dès que l'équipe vous répond. Consultez vos messages dans votre profil.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.sendBtn, (sending || !sujetKey || corps.trim().length < 20) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={sending || !sujetKey || corps.trim().length < 20}>
            {sending
              ? <ActivityIndicator color="#fff" size="small" />
              : <><Ionicons name="send" size={18} color="#fff" /><Text style={styles.sendBtnText}>Envoyer le message</Text></>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── VUE : Liste des messages ──────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes messages</Text>
        <TouchableOpacity onPress={() => setView('new')} style={styles.newBtn}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={COLORS.accent} />
      ) : messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="mail-outline" size={52} color="#ddd" />
          <Text style={styles.emptyTitle}>Aucun message envoyé</Text>
          <Text style={styles.emptySubText}>
            Vous avez une question ou un problème ? Notre équipe est là pour vous aider.
          </Text>
          <TouchableOpacity style={styles.newMsgBtn} onPress={() => setView('new')}>
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.newMsgBtnText}>Envoyer un message</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <TouchableOpacity style={styles.newMsgCard} onPress={() => setView('new')}>
            <Ionicons name="create-outline" size={20} color={COLORS.accent} />
            <Text style={styles.newMsgCardText}>Nouveau message</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.accent} />
          </TouchableOpacity>

          {messages.map(msg => {
            const sconf = STATUT_CONFIG[msg.statut] || STATUT_CONFIG.OUVERT;
            const hasReply = msg.reponses?.length > 0;
            return (
              <TouchableOpacity key={msg.id} style={styles.msgCard} onPress={() => openThread(msg)}>
                <View style={styles.msgIconWrap}>
                  <Ionicons
                    name={hasReply ? 'chatbubble-ellipses' : 'mail'}
                    size={22}
                    color={hasReply ? COLORS.primary : '#999'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.msgSujet} numberOfLines={1}>{msg.sujet}</Text>
                    <View style={[styles.statutPill, { backgroundColor: sconf.bg }]}>
                      <Text style={[styles.statutText, { color: sconf.color }]}>{sconf.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.msgCorps} numberOfLines={1}>{msg.corps}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Text style={styles.msgDate}>
                      {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </Text>
                    {hasReply && (
                      <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: '600' }}>
                        {msg.reponses.length} réponse(s) ✓
                      </Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#ccc" />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingBottom: 14,
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: 'bold', color: '#fff' },
  newBtn: { padding: 4 },

  // Liste
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 16, marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  newMsgBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24,
  },
  newMsgBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  newMsgCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF8F3', borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: '#FFE0B2', borderStyle: 'dashed',
  },
  newMsgCardText: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.accent },

  msgCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  msgIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center',
  },
  msgSujet: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', flex: 1 },
  msgCorps: { fontSize: 12, color: '#999', marginTop: 2 },
  msgDate: { fontSize: 11, color: '#bbb' },

  statutPill: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  statutText: { fontSize: 10, fontWeight: '700' },

  // Nouveau message
  label: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  sujetCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1.5, borderColor: '#E5E5E5',
  },
  sujetCardActive: { borderColor: COLORS.primary, backgroundColor: '#F0F7F4' },
  sujetLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 2 },
  sujetDesc: { fontSize: 12, color: '#999' },

  textarea: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E5E5',
    padding: 14, fontSize: 14, color: '#1A1A1A', minHeight: 140,
  },
  charCount: { fontSize: 11, color: '#bbb', textAlign: 'right', marginTop: 4, marginBottom: 16 },

  infoBox: {
    flexDirection: 'row', gap: 10, backgroundColor: '#F0F7F4',
    borderRadius: 12, padding: 12, marginBottom: 20, alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: 13, color: COLORS.primary, lineHeight: 18 },

  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.accent, borderRadius: 16, paddingVertical: 14,
  },
  sendBtnDisabled: { opacity: 0.45 },
  sendBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Thread
  threadItem: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  threadUser: { justifyContent: 'flex-end' },
  threadAdmin: { justifyContent: 'flex-start' },
  adminAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  threadBubble: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  bubbleUser: { backgroundColor: COLORS.accent, borderBottomRightRadius: 4 },
  bubbleAdmin: {
    backgroundColor: '#fff', borderBottomLeftRadius: 4,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  threadAdminLabel: { fontSize: 10, color: COLORS.primary, fontWeight: '700', marginBottom: 4, opacity: 0.7 },
  threadText: { fontSize: 14, color: '#1A1A1A', lineHeight: 20 },
  threadDate: { fontSize: 10, color: '#bbb', marginTop: 4 },

  waitingBox: { alignItems: 'center', padding: 32 },
  waitingText: { fontSize: 16, fontWeight: '600', color: '#999', marginTop: 12 },
  waitingSubText: { fontSize: 13, color: '#bbb', marginTop: 6, textAlign: 'center' },
});
