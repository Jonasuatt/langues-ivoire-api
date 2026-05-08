import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';

const COLORS = { primary: '#0B3D2E', accent: '#F47920' };

/**
 * PremiumGate — affiche soit le contenu (si premium), soit un verrou avec CTA.
 *
 * Usage :
 *   <PremiumGate feature="Tuteurs IA illimités" limit="10 msg/jour en version gratuite">
 *     <MonContenuPremium />
 *   </PremiumGate>
 *
 * Variante compacte (inline dans une liste) :
 *   <PremiumGate compact feature="..." />
 */
export default function PremiumGate({ children, feature, limit, compact = false }) {
  const { user } = useAuthStore();
  const navigation = useNavigation();

  if (user?.isPremium) return children ?? null;

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactWrap}
        onPress={() => navigation.navigate('Premium')}
        activeOpacity={0.8}
      >
        <Ionicons name="lock-closed" size={14} color={COLORS.accent} />
        <Text style={styles.compactText}>Premium</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.gateWrap}>
      <View style={styles.lockCircle}>
        <Ionicons name="lock-closed" size={32} color={COLORS.accent} />
      </View>
      <Text style={styles.gateTitle}>{feature || 'Contenu Premium'}</Text>
      {limit && <Text style={styles.gateLimit}>{limit}</Text>}
      <TouchableOpacity
        style={styles.gateBtn}
        onPress={() => navigation.navigate('Premium')}
        activeOpacity={0.85}
      >
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.gateBtnText}>Passer à Premium</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * PremiumLockIcon — petite icône cadenas inline (pour une carte de langue, etc.)
 */
export function PremiumLockIcon({ size = 16 }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Premium')}
      style={styles.lockIcon}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="lock-closed" size={size} color={COLORS.accent} />
    </TouchableOpacity>
  );
}

/**
 * PremiumBanner — bannière douce pour inciter à l'upgrade (HomeScreen, etc.)
 */
export function PremiumBanner() {
  const { user } = useAuthStore();
  const navigation = useNavigation();
  if (user?.isPremium) return null;

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => navigation.navigate('Premium')}
      activeOpacity={0.9}
    >
      <View style={styles.bannerLeft}>
        <Ionicons name="star" size={18} color="#FFD700" />
        <View>
          <Text style={styles.bannerTitle}>Découvrez Premium</Text>
          <Text style={styles.bannerSub}>8 langues · IA illimitée · Hors-ligne</Text>
        </View>
      </View>
      <View style={styles.bannerBtn}>
        <Text style={styles.bannerBtnText}>Essai gratuit</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Gate complet
  gateWrap: { alignItems: 'center', padding: 28, gap: 12 },
  lockCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center',
  },
  gateTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center' },
  gateLimit: { fontSize: 13, color: '#888', textAlign: 'center' },
  gateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.accent, borderRadius: 24,
    paddingHorizontal: 22, paddingVertical: 12,
    shadowColor: COLORS.accent, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  gateBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  // Compact inline
  compactWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFF3E0', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: '#FFE0B2',
  },
  compactText: { fontSize: 11, color: COLORS.accent, fontWeight: '700' },

  // Lock icon
  lockIcon: { justifyContent: 'center', alignItems: 'center' },

  // Banner
  banner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary, marginHorizontal: 14, marginTop: 10,
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  bannerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  bannerTitle:   { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  bannerSub:     { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  bannerBtn:     { backgroundColor: COLORS.accent, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  bannerBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
