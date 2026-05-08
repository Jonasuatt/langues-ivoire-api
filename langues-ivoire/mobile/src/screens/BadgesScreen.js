import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { progressAPI, badgesAPI } from '../services/api';

// Icône par défaut selon la catégorie
const CATEGORY_DEFAULT_ICON = {
  linguistique: 'school',
  culturel: 'library',
  social: 'people',
  progression: 'trophy',
};

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

const CATEGORY_ICONS = {
  linguistique: 'school-outline',
  culturel: 'library-outline',
  social: 'people-outline',
};

const CATEGORY_COLORS = {
  linguistique: '#1565C0',
  culturel: '#6A1B9A',
  social: '#00897B',
};

export default function BadgesScreen() {
  const [stats, setStats] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([progressAPI.get(), progressAPI.getBadges(), badgesAPI.getAll()])
      .then(([prog, earned, all]) => {
        setStats(prog.data.stats);
        setEarnedBadges(earned.data || []);
        setAllBadges(all.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={COLORS.accent} size="large" />;

  // ─── Grades de l'Artisan (niveaux culturels) ────────────────────────────
  const totalXp = stats?.totalXp || 0;
  const GRADES = [
    { name: "L'Apprenti",           minXp: 0,   description: "L'élève qui observe et découvre",            icon: '🌱', iconIon: 'leaf-outline' },
    { name: 'Le Voyageur',          minXp: 150,  description: 'Celui qui peut se déplacer et saluer',       icon: '🚶', iconIon: 'compass-outline' },
    { name: "L'Ambassadeur",        minXp: 400,  description: 'Celui qui tisse des liens entre les peuples',icon: '🤝', iconIon: 'ribbon-outline' },
    { name: 'Le Maître de la Parole', minXp: 700, description: 'Celui qui maîtrise le verbe et la culture', icon: '👑', iconIon: 'trophy-outline' },
  ];

  const gradeFromAPI = stats?.grade;
  const nextGradeFromAPI = stats?.nextGrade;

  // Fallback local si l'API ne retourne pas encore les grades
  const currentGrade = gradeFromAPI
    ? GRADES.find(g => g.name === gradeFromAPI.name) || GRADES[0]
    : [...GRADES].reverse().find(g => totalXp >= g.minXp) || GRADES[0];
  const nextGrade = nextGradeFromAPI
    ? GRADES.find(g => g.name === nextGradeFromAPI.name)
    : GRADES[GRADES.indexOf(currentGrade) + 1] || null;

  const xpProgress = nextGrade
    ? Math.min((totalXp - currentGrade.minXp) / (nextGrade.minXp - currentGrade.minXp), 1)
    : 1;

  // IDs des badges déjà obtenus (par ID de badge)
  const earnedIds = new Set(earnedBadges.map(ub => ub.badgeId || ub.badge?.id));

  // Regrouper par catégorie — badges CMS en priorité, sinon tableau vide
  const mergedByCategory = {};
  allBadges.forEach(b => {
    const cat = b.categorie || 'progression';
    if (!mergedByCategory[cat]) mergedByCategory[cat] = [];
    const earnedRecord = earnedBadges.find(ub => (ub.badgeId || ub.badge?.id) === b.id);
    const unlocked = !!earnedRecord;
    mergedByCategory[cat].push({
      ...b,
      icon: CATEGORY_DEFAULT_ICON[cat] || 'ribbon',
      unlocked,
      earnedAt: earnedRecord?.obtainedAt,
    });
  });

  const unlockedCount = earnedBadges.length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Header — Grade de l'Artisan */}
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.header}>
        <Text style={styles.gradeEmoji}>{currentGrade.icon}</Text>
        <Text style={styles.levelName}>{currentGrade.name}</Text>
        <Text style={styles.gradeDesc}>{currentGrade.description}</Text>
        <Text style={styles.xpText}>{totalXp} XP</Text>

        {nextGrade && (
          <View style={styles.levelProgressContainer}>
            <View style={styles.levelProgressBar}>
              <View style={[styles.levelProgressFill, { width: `${xpProgress * 100}%` }]} />
            </View>
            <Text style={styles.levelProgressText}>
              {Math.max(0, nextGrade.minXp - totalXp)} XP pour "{nextGrade.name}" {nextGrade.icon}
            </Text>
          </View>
        )}
        {!nextGrade && (
          <View style={styles.masterBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#FFD700" />
            <Text style={styles.masterText}>Grade maximum atteint !</Text>
          </View>
        )}
      </LinearGradient>

      {/* Stats rapides */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={22} color="#F47920" />
          <Text style={styles.statValue}>{stats?.streak || 0}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
          <Text style={styles.statValue}>{stats?.completed || 0}</Text>
          <Text style={styles.statLabel}>Leçons</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="ribbon" size={22} color="#FFD700" />
          <Text style={styles.statValue}>{unlockedCount}/{allBadges.length}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {/* Barre progression globale badges */}
      <View style={styles.globalProgress}>
        <Text style={styles.globalProgressLabel}>{unlockedCount} badge{unlockedCount > 1 ? 's' : ''} débloqué{unlockedCount > 1 ? 's' : ''} sur {allBadges.length}</Text>
        <View style={styles.globalProgressBar}>
          <View style={[styles.globalProgressFill, { width: allBadges.length > 0 ? `${(unlockedCount / allBadges.length) * 100}%` : '0%' }]} />
        </View>
      </View>

      {/* Badges par catégorie */}
      {Object.entries(mergedByCategory).map(([category, badges]) => {
        const catUnlocked = badges.filter(b => b.unlocked).length;
        return (
          <View key={category} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name={CATEGORY_ICONS[category] || 'ribbon-outline'} size={18} color={CATEGORY_COLORS[category] || '#888'} />
              <Text style={styles.sectionTitle}>
                {category === 'linguistique' ? 'Linguistique' : category === 'culturel' ? 'Culturel' : 'Social'}
              </Text>
              <Text style={styles.sectionCount}>{catUnlocked}/{badges.length}</Text>
            </View>
            <View style={styles.badgesGrid}>
              {badges.map((b) => (
                <View key={b.id} style={[styles.badgeCard, !b.unlocked && styles.badgeLocked]}>
                  <View style={[styles.badgeIconWrap, {
                    backgroundColor: b.unlocked ? (CATEGORY_COLORS[category] || '#888') + '20' : '#F5F5F5',
                  }]}>
                    <Ionicons
                      name={b.unlocked ? (b.icon || 'ribbon') : 'lock-closed'}
                      size={28}
                      color={b.unlocked ? (CATEGORY_COLORS[category] || '#888') : '#ccc'}
                    />
                  </View>
                  <Text style={[styles.badgeName, !b.unlocked && { color: '#aaa' }]}>{b.nom}</Text>
                  <Text style={[styles.badgeDesc, !b.unlocked && { color: '#ccc' }]}>{b.description}</Text>
                  {b.unlocked
                    ? <>
                        <Text style={styles.badgeXp}>+{b.pointsXp} XP</Text>
                        {b.earnedAt && <Text style={styles.badgeDate}>{new Date(b.earnedAt).toLocaleDateString('fr-FR')}</Text>}
                      </>
                    : <Text style={styles.badgeXpLocked}>+{b.pointsXp} XP</Text>
                  }
                </View>
              ))}
            </View>
          </View>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 28, gap: 6 },
  gradeEmoji: { fontSize: 48, marginBottom: 4 },
  levelName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  gradeDesc: { fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center', paddingHorizontal: 32, marginBottom: 2 },
  xpText: { fontSize: 14, color: '#c8e6c9' },
  masterBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,215,0,0.2)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6, marginTop: 4 },
  masterText: { color: '#FFD700', fontWeight: 'bold', fontSize: 13 },
  levelProgressContainer: { width: '80%', marginTop: 12 },
  levelProgressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  levelProgressFill: { height: '100%', backgroundColor: '#FFD700', borderRadius: 4 },
  levelProgressText: { fontSize: 12, color: '#c8e6c9', textAlign: 'center', marginTop: 6 },
  statsRow: { flexDirection: 'row', margin: 16, gap: 12 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14,
    alignItems: 'center', gap: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  statLabel: { fontSize: 12, color: '#888' },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', flex: 1 },
  sectionCount: { fontSize: 13, color: '#999', fontWeight: '600' },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 14,
    alignItems: 'center', gap: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  badgeIconWrap: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  badgeName: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center' },
  badgeDesc: { fontSize: 11, color: '#888', textAlign: 'center' },
  badgeXp: { fontSize: 12, fontWeight: '600', color: COLORS.accent, marginTop: 2 },
  badgeDate: { fontSize: 10, color: '#bbb' },
  emptyContainer: { alignItems: 'center', marginTop: 40, gap: 12, paddingHorizontal: 32 },
  emptyText: { fontSize: 15, color: '#999', textAlign: 'center' },
  globalProgress: { marginHorizontal: 16, marginBottom: 8, gap: 6 },
  globalProgressLabel: { fontSize: 13, color: '#666', fontWeight: '600' },
  globalProgressBar: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  globalProgressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 4 },
  badgeLocked: { opacity: 0.7 },
  badgeXpLocked: { fontSize: 12, color: '#ccc', marginTop: 2 },
});
