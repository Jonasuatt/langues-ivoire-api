import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { progressAPI, notificationsAPI } from '../services/api';
import { offlineCulturalAPI as culturalAPI } from '../services/offlineApi';
import AudioButton from '../components/AudioButton';
import { PremiumBanner } from '../components/PremiumGate';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8', text: '#1A1A1A' };

export default function HomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const [culturalItem, setCulturalItem] = useState(null);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [preferredLang, setPreferredLang] = useState(null);
  const [dailyGoal, setDailyGoal] = useState('10');

  const loadData = async () => {
    try {
      const [cultural, progress] = await Promise.all([
        culturalAPI.getToday(),
        progressAPI.get(),
      ]);
      setCulturalItem(cultural.data);
      setStats(progress.data.stats);
      try {
        const notifs = await notificationsAPI.getAll();
        setUnreadNotifs(notifs.data.unreadCount);
      } catch {}
    } catch (_) {}
  };

  useEffect(() => {
    loadData();
    // Charger les préférences d'onboarding
    AsyncStorage.multiGet(['preferred_language', 'daily_goal_minutes']).then(pairs => {
      const lang = pairs[0][1];
      const goal = pairs[1][1];
      if (lang) setPreferredLang(lang);
      if (goal) setDailyGoal(goal);
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Bonjour, {user?.prenom} 👋</Text>
            <Text style={styles.subtitle}>
              {preferredLang
                ? `Objectif : ${dailyGoal} min/jour · ${preferredLang.charAt(0).toUpperCase() + preferredLang.slice(1)}`
                : 'Continuez votre apprentissage !'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={{ position: 'relative', padding: 4 }}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
            {unreadNotifs > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadNotifs > 9 ? '9+' : unreadNotifs}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {stats && (
          <View style={styles.statsRow}>
            <StatCard icon="flame" value={stats.streak} label="Jours" color="#F47920" />
            <StatCard icon="star" value={stats.totalXp} label="XP" color="#FFD700" />
            <StatCard icon="checkmark-circle" value={stats.completed} label="Leçons" color="#4CAF50" />
          </View>
        )}
      </LinearGradient>

      {/* Barre de recherche globale */}
      <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')} activeOpacity={0.85}>
        <Ionicons name="search" size={18} color="#999" />
        <Text style={styles.searchPlaceholder}>Chercher un mot, une leçon…</Text>
        <Ionicons name="mic-outline" size={18} color="#bbb" />
      </TouchableOpacity>

      {/* Bannière Premium (utilisateurs gratuits) */}
      <PremiumBanner />

      {/* Point culturel du jour — avec audio */}
      {culturalItem && (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Cultural')}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={20} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Point culturel du jour</Text>
          </View>
          <View style={styles.culturalContent}>
            <Text style={[styles.culturalText, { flex: 1 }]}>{culturalItem.contenu}</Text>
            <AudioButton
              audioUrl={culturalItem.audioUrl}
              text={culturalItem.contenu}
              langCode={culturalItem.language?.code || 'fr'}
              size={24}
            />
          </View>
          {culturalItem.traduction && (
            <View style={styles.culturalTradRow}>
              <Text style={[styles.culturalTranslation, { flex: 1 }]}>"{culturalItem.traduction}"</Text>
              <AudioButton
                text={culturalItem.traduction}
                langCode="fr"
                size={20}
                color={COLORS.primary}
              />
            </View>
          )}
          {culturalItem.sourceEthnique && (
            <Text style={styles.culturalSource}>— {culturalItem.sourceEthnique}</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Actions rapides */}
      <Text style={styles.sectionTitle}>Accès rapide</Text>
      <View style={styles.actionsGrid}>
        <QuickAction icon="earth" label="Choisir une langue" color="#0B3D2E"
          onPress={() => navigation.navigate('Langues')} />
        <QuickAction icon="book" label="Dictionnaire" color="#1565C0"
          onPress={() => navigation.navigate('Dictionnaire')} />
        <QuickAction icon="mic" label="Pratiquer IA" color="#1565C0"
          onPress={() => navigation.navigate('Practice')} />
        <QuickAction icon="add-circle" label="Contribuer" color="#F47920"
          onPress={() => navigation.navigate('Contribute')} />
        <QuickAction icon="language" label="Conjugaison" color="#00695C"
          onPress={() => navigation.navigate('Conjugaison')} />
        <QuickAction icon="images" label="Images" color="#AD1457"
          onPress={() => navigation.navigate('Images')} />
        <QuickAction icon="videocam" label="Vidéos" color="#D84315"
          onPress={() => navigation.navigate('Vidéos')} />
        <QuickAction icon="alert-circle" label="Phrases SOS" color="#C62828"
          onPress={() => navigation.navigate('SOS')} />
        <QuickAction icon="people" label="Tuteurs" color="#6A1B9A"
          onPress={() => navigation.navigate('Tuteurs')} />
        <QuickAction icon="chatbubbles" label="Nouchi" color="#37474F"
          onPress={() => navigation.navigate('Nouchi')} />
        <QuickAction icon="book-outline" label="Textes & Récits" color="#4A148C"
          onPress={() => navigation.navigate('TextContent')} />
      </View>
    </ScrollView>
  );
}

const StatCard = ({ icon, value, label, color }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={22} color={color} />
    <Text style={styles.statValue}>{value ?? 0}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const QuickAction = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={[styles.actionBtn, { borderColor: color }]} onPress={onPress}>
    <Ionicons name={icon} size={28} color={color} />
    <Text style={[styles.actionLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 24, paddingTop: 48, paddingBottom: 32 },
  greeting: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 15, color: '#c8e6c9', marginTop: 4 },
  statsRow: { flexDirection: 'row', marginTop: 20, gap: 12 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12,
              padding: 12, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  statLabel: { fontSize: 11, color: '#c8e6c9', marginTop: 2 },
  card: { margin: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16,
          shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: COLORS.accent },
  culturalContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  culturalText: { fontSize: 16, fontStyle: 'italic', color: COLORS.text, lineHeight: 24 },
  culturalTradRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  culturalTranslation: { fontSize: 14, color: '#555' },
  culturalSource: { fontSize: 12, color: '#999', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginTop: 8 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  actionBtn: { width: '45%', backgroundColor: '#fff', borderWidth: 1.5, borderRadius: 14,
               padding: 16, alignItems: 'center', gap: 8 },
  actionLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  searchPlaceholder: { flex: 1, fontSize: 14, color: '#aaa' },
  notifBadge: {
    position: 'absolute', top: -2, right: -2, backgroundColor: '#E53935',
    borderRadius: 9, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 4,
  },
  notifBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});
