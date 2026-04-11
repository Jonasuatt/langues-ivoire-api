import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { progressAPI } from '../services/api';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [notif, setNotif] = useState(user?.notifEnabled ?? true);

  useEffect(() => {
    Promise.all([progressAPI.get(), progressAPI.getBadges()])
      .then(([p, b]) => { setStats(p.data.stats); setBadges(b.data); })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: logout },
    ]);
  };

  const toggleNotif = async (value) => {
    setNotif(value);
    await updateUser({ notifEnabled: value });
  };

  const isPremium = user?.isPremium;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Header profil */}
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.header}>
        <View style={styles.avatarBig}>
          <Text style={styles.avatarText}>{(user?.prenom || 'U').slice(0, 1)}{(user?.nom || 'U').slice(0, 1)}</Text>
        </View>
        <Text style={styles.userName}>{user?.prenom} {user?.nom}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        {isPremium
          ? <View style={styles.premiumBadge}><Text style={styles.premiumText}>⭐ Premium</Text></View>
          : <TouchableOpacity style={styles.upgradeBadge}><Text style={styles.upgradeText}>Passer à Premium</Text></TouchableOpacity>
        }
      </LinearGradient>

      {/* Stats */}
      {stats && (
        <View style={styles.statsRow}>
          {[
            { icon: 'flame', label: 'Streak', value: stats.streak, color: '#F47920' },
            { icon: 'star', label: 'XP Total', value: stats.totalXp, color: '#FFD700' },
            { icon: 'checkmark-circle', label: 'Leçons', value: stats.completed, color: '#4CAF50' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Ionicons name={s.icon} size={22} color={s.color} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes Badges ({badges.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
            {badges.map(ub => (
              <View key={ub.id} style={styles.badgeCard}>
                <Ionicons name="ribbon" size={28} color={COLORS.accent} />
                <Text style={styles.badgeName}>{ub.badge.nom}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Paramètres */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        <View style={styles.settingRow}>
          <Ionicons name="notifications-outline" size={20} color="#555" />
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch value={notif} onValueChange={toggleNotif} trackColor={{ true: COLORS.accent }} />
        </View>
      </View>

      {/* Déconnexion */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#E53935" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingTop: 48, paddingBottom: 32, gap: 8 },
  avatarBig: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)',
                justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  userEmail: { fontSize: 14, color: '#c8e6c9' },
  premiumBadge: { backgroundColor: 'rgba(255,215,0,0.25)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  premiumText: { color: '#FFD700', fontWeight: 'bold', fontSize: 13 },
  upgradeBadge: { backgroundColor: COLORS.accent, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  upgradeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  statsRow: { flexDirection: 'row', margin: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', gap: 4,
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  statLabel: { fontSize: 12, color: '#888' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  badgeCard: { backgroundColor: '#FFF3E0', borderRadius: 12, padding: 14, alignItems: 'center', gap: 6, minWidth: 80 },
  badgeName: { fontSize: 11, color: COLORS.accent, fontWeight: '600', textAlign: 'center' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, marginTop: 4,
               backgroundColor: '#FFF', borderRadius: 14, padding: 16,
               shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#E53935' },
});
