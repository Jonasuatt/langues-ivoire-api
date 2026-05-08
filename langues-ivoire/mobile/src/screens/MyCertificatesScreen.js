import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Animated, Share, Image,
} from 'react-native';

const LOGO = require('../../assets/logo.png');
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { certificateAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

const NIVEAU_CONFIG = {
  A1: { label: 'Débutant',             grad: ['#43A047', '#2E7D32'], icon: 'leaf',        stars: 1 },
  A2: { label: 'Élémentaire',          grad: ['#00ACC1', '#00838F'], icon: 'water',       stars: 2 },
  B1: { label: 'Intermédiaire',        grad: ['#1E88E5', '#1565C0'], icon: 'partly-sunny',stars: 3 },
  B2: { label: 'Intermédiaire avancé', grad: ['#8E24AA', '#6A1B9A'], icon: 'star',        stars: 4 },
  C1: { label: 'Avancé',              grad: ['#F47920', '#E65100'], icon: 'trophy',      stars: 5 },
};

function Stars({ count }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3, justifyContent: 'center', marginVertical: 6 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Ionicons key={i} name={i < count ? 'star' : 'star-outline'} size={14} color="#FFD700" />
      ))}
    </View>
  );
}

function CertificateCard({ cert, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const conf = NIVEAU_CONFIG[cert.niveau] || NIVEAU_CONFIG.A1;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1, delay: index * 120,
      tension: 60, friction: 8, useNativeDriver: true,
    }).start();
  }, []);

  const handleShare = () => {
    Share.share({
      message:
        `🎓 J'ai obtenu mon certificat de niveau ${cert.niveau} (${conf.label}) en ${cert.language?.nom} sur Langues Ivoire ! ` +
        `#LanguesIvoire #CultureIvoirienne`,
    });
  };

  const date = new Date(cert.issuedAt).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ scale: anim }, { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
    }}>
      <LinearGradient colors={conf.grad} style={styles.certCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {/* Décoration */}
        <View style={styles.certDecoLeft} />
        <View style={styles.certDecoRight} />

        {/* En-tête */}
        <View style={styles.certHeader}>
          <Image source={LOGO} style={styles.certLogo} resizeMode="contain" />
          <Text style={styles.certBrand}>LANGUES IVOIRE</Text>
        </View>

        <Text style={styles.certTitle}>CERTIFICAT DE COMPÉTENCE</Text>

        {/* Langue */}
        <View style={styles.certLangBadge}>
          <Text style={styles.certLangText}>{cert.language?.nom?.toUpperCase()}</Text>
        </View>

        {/* Niveau + étoiles */}
        <View style={styles.certNiveauWrap}>
          <Ionicons name={conf.icon} size={32} color="rgba(255,255,255,0.9)" />
          <Text style={styles.certNiveau}>{cert.niveau}</Text>
        </View>
        <Text style={styles.certNiveauLabel}>{conf.label}</Text>
        <Stars count={conf.stars} />

        <View style={styles.certDivider} />

        {/* Date */}
        <Text style={styles.certDateLabel}>Délivré le</Text>
        <Text style={styles.certDate}>{date}</Text>

        {/* Bouton partager */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={16} color="rgba(255,255,255,0.9)" />
          <Text style={styles.shareBtnText}>Partager</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

export default function MyCertificatesScreen({ navigation }) {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateAPI.getMine()
      .then(({ data }) => setCerts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Grouper par langue
  const byLang = {};
  certs.forEach(c => {
    const k = c.language?.nom || 'Autre';
    if (!byLang[k]) byLang[k] = [];
    byLang[k].push(c);
  });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, '#1a5c45']}
        style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Mes Diplômes</Text>
          <Text style={styles.headerSub}>{certs.length} certificat(s) obtenu(s)</Text>
        </View>
        <Ionicons name="school" size={28} color="rgba(255,255,255,0.7)" />
      </LinearGradient>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={COLORS.accent} size="large" />
      ) : certs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="school-outline" size={64} color="#ddd" />
          <Text style={styles.emptyTitle}>Aucun certificat encore</Text>
          <Text style={styles.emptyText}>
            Complétez toutes les leçons d'un niveau pour obtenir votre premier diplôme automatiquement !
          </Text>
          <TouchableOpacity style={styles.goLearnBtn} onPress={() => navigation.navigate('Langues')}>
            <Text style={styles.goLearnText}>🎓 Commencer à apprendre</Text>
          </TouchableOpacity>

          {/* Info niveaux */}
          <View style={styles.niveauInfo}>
            <Text style={styles.niveauInfoTitle}>Progression des niveaux</Text>
            {Object.entries(NIVEAU_CONFIG).map(([n, conf]) => (
              <View key={n} style={styles.niveauRow}>
                <LinearGradient colors={conf.grad} style={styles.niveauDot} />
                <Text style={styles.niveauCode}>{n}</Text>
                <Text style={styles.niveauLabel}>{conf.label}</Text>
                <Stars count={conf.stars} />
              </View>
            ))}
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: insets.bottom + 24 }}>
          {/* Résumé */}
          <View style={styles.summaryBox}>
            <Ionicons name="trophy" size={20} color={COLORS.accent} />
            <Text style={styles.summaryText}>
              Bravo {user?.prenom} ! Vous avez obtenu <Text style={{ fontWeight: '800' }}>{certs.length}</Text> certificat(s).
            </Text>
          </View>

          {/* Certificats par langue */}
          {Object.entries(byLang).map(([langue, langCerts]) => (
            <View key={langue}>
              <Text style={styles.langSection}>{langue}</Text>
              {langCerts.map((c, i) => (
                <CertificateCard key={c.id} cert={c} index={i} />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingBottom: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },

  // Certificat
  certCard: {
    borderRadius: 20, padding: 24, marginBottom: 4,
    alignItems: 'center', overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  certDecoLeft: {
    position: 'absolute', left: -30, top: -30,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  certDecoRight: {
    position: 'absolute', right: -30, bottom: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  certHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6,
  },
  certLogo: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 2,
  },
  certBrand: { fontSize: 11, fontWeight: '900', color: 'rgba(255,255,255,0.85)', letterSpacing: 3 },
  certTitle: { fontSize: 13, fontWeight: '700', color: '#fff', letterSpacing: 1, marginBottom: 12 },
  certLangBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 5, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  certLangText: { color: '#fff', fontWeight: '800', fontSize: 13, letterSpacing: 2 },
  certNiveauWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  certNiveau: { fontSize: 52, fontWeight: '900', color: '#fff' },
  certNiveauLabel: { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  certDivider: {
    width: '60%', height: 1, backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 16,
  },
  certDateLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 2 },
  certDate: { fontSize: 14, color: '#fff', fontWeight: '600', marginBottom: 16 },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  shareBtnText: { color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: 13 },

  // Section langue
  langSection: {
    fontSize: 16, fontWeight: '800', color: COLORS.primary,
    marginBottom: 12, paddingLeft: 4,
  },

  // Résumé
  summaryBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF8F3', borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: '#FFE0B2',
  },
  summaryText: { flex: 1, fontSize: 14, color: '#555', lineHeight: 20 },

  // État vide
  emptyState: { flex: 1, alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 20, marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  goLearnBtn: {
    backgroundColor: COLORS.accent, paddingHorizontal: 28, paddingVertical: 12,
    borderRadius: 24, marginBottom: 32,
  },
  goLearnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  niveauInfo: {
    width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  niveauInfoTitle: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 12 },
  niveauRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  niveauDot: { width: 20, height: 20, borderRadius: 10 },
  niveauCode: { fontSize: 13, fontWeight: '800', color: '#333', width: 24 },
  niveauLabel: { flex: 1, fontSize: 13, color: '#666' },
});
