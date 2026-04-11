import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { culturalAPI, progressAPI } from '../services/api';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8', text: '#1A1A1A' };

export default function HomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const [culturalItem, setCulturalItem] = useState(null);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [cultural, progress] = await Promise.all([
        culturalAPI.getToday(),
        progressAPI.get(),
      ]);
      setCulturalItem(cultural.data);
      setStats(progress.data.stats);
    } catch (_) {}
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Header */}
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.header}>
        <Text style={styles.greeting}>Bonjour, {user?.prenom} 👋</Text>
        <Text style={styles.subtitle}>Continuez votre apprentissage !</Text>
        {stats && (
          <View style={styles.statsRow}>
            <StatCard icon="flame" value={stats.streak} label="Jours" color="#F47920" />
            <StatCard icon="star" value={stats.totalXp} label="XP" color="#FFD700" />
            <StatCard icon="checkmark-circle" value={stats.completed} label="Leçons" color="#4CAF50" />
          </View>
        )}
      </LinearGradient>

      {/* Point culturel du jour */}
      {culturalItem && (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Cultural')}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={20} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Point culturel du jour</Text>
          </View>
          <Text style={styles.culturalText}>{culturalItem.contenu}</Text>
          {culturalItem.traduction && (
            <Text style={styles.culturalTranslation}>"{culturalItem.traduction}"</Text>
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
        <QuickAction icon="person" label="Mes tuteurs" color="#6A1B9A"
          onPress={() => navigation.navigate('Tuteurs')} />
        <QuickAction icon="add-circle" label="Contribuer" color="#F47920"
          onPress={() => navigation.navigate('Contribute')} />
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
  culturalText: { fontSize: 16, fontStyle: 'italic', color: COLORS.text, lineHeight: 24 },
  culturalTranslation: { fontSize: 14, color: '#555', marginTop: 8 },
  culturalSource: { fontSize: 12, color: '#999', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginTop: 8 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  actionBtn: { width: '45%', backgroundColor: '#fff', borderWidth: 1.5, borderRadius: 14,
               padding: 16, alignItems: 'center', gap: 8 },
  actionLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
