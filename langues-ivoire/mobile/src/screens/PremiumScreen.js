import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, Dimensions, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');
const COLORS = { primary: '#0B3D2E', accent: '#F47920', gold: '#F5A623', bg: '#FAFAF8' };

// ─── Plans tarifaires ───────────────────────────────────────────────────────
const PLANS = [
  {
    key:      'mensuel',
    label:    'Mensuel',
    price:    '3 500',
    unit:     'FCFA / mois',
    priceEur: '~5,35 €',
    badge:    null,
    highlight: false,
    desc:     'Idéal pour démarrer',
  },
  {
    key:      'annuel',
    label:    'Annuel',
    price:    '28 000',
    unit:     'FCFA / an',
    priceEur: '~42 €',
    badge:    '33% d\'économie',
    highlight: true,
    desc:     'Le plus populaire',
    perMonth: '2 333 FCFA / mois',
  },
  {
    key:      'institution',
    label:    'Institution',
    price:    'Sur devis',
    unit:     '',
    priceEur: '',
    badge:    'Personnalisé',
    highlight: false,
    desc:     'Écoles · Mairies · ONG',
  },
];

// ─── Avantages Premium ──────────────────────────────────────────────────────
const FEATURES = [
  { icon: 'earth',              color: '#0B3D2E', title: 'Toutes les 8 langues',    free: '3 langues',       premium: '8 langues complètes' },
  { icon: 'book',               color: '#1565C0', title: 'Dictionnaire complet',    free: '50 mots/langue',  premium: '200+ mots/langue' },
  { icon: 'hardware-chip',      color: '#6A1B9A', title: 'Tuteurs IA illimités',   free: '10 msg/jour',     premium: 'Illimité 24h/24' },
  { icon: 'videocam',           color: '#D84315', title: 'Toutes les vidéos',       free: '3 vidéos/langue', premium: 'Bibliothèque complète' },
  { icon: 'school',             color: '#00695C', title: 'Tous les niveaux',        free: 'Niveau A1',       premium: 'A1 · A2 · B1 · B2' },
  { icon: 'cloud-download',     color: '#37474F', title: 'Hors-ligne complet',      free: '1 langue',        premium: 'Toutes les langues' },
  { icon: 'bar-chart',          color: '#E65100', title: 'Stats avancées',          free: 'Basiques',        premium: 'Graphiques + heatmap' },
  { icon: 'shield-checkmark',   color: '#2E7D32', title: 'Sans publicité',          free: 'Avec pub',        premium: '100% sans pub' },
];

// ─── FAQ ────────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: 'Puis-je annuler à tout moment ?',
    a: 'Oui. Vous pouvez annuler votre abonnement à tout moment depuis votre profil. Vous conservez l\'accès jusqu\'à la fin de la période payée.',
  },
  {
    q: 'Comment payer en FCFA ?',
    a: 'Nous acceptons Orange Money, MTN Money, Wave, carte bancaire et virement. Le paiement est sécurisé.',
  },
  {
    q: 'L\'institution peut-elle bénéficier d\'un essai ?',
    a: 'Oui. Contactez-nous à contact@langues-ivoire.ci pour une démonstration gratuite et un devis personnalisé.',
  },
];

export default function PremiumScreen({ navigation }) {
  const { user, updateUser } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState('annuel');
  const [faqOpen, setFaqOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isPremium = user?.isPremium;

  // Simulation d'activation (sans vrai paiement pour l'instant)
  const handleActivate = async () => {
    if (selectedPlan === 'institution') {
      Alert.alert(
        'Contact Institution',
        'Envoyez un email à contact@langues-ivoire.ci pour recevoir un devis personnalisé.',
        [{ text: 'Fermer' }]
      );
      return;
    }

    setLoading(true);
    // Simulation d'un délai de traitement
    await new Promise(r => setTimeout(r, 1200));
    try {
      // Optimistic update local
      await updateUser({ isPremium: true });
      setShowSuccess(true);
    } catch {
      Alert.alert('Erreur', 'Impossible d\'activer le Premium. Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <View style={styles.alreadyPremium}>
        <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.alreadyGradient}>
          <Ionicons name="star" size={64} color="#FFD700" />
          <Text style={styles.alreadyTitle}>Vous êtes Premium ! ⭐</Text>
          <Text style={styles.alreadySub}>
            Profitez de tout le contenu Langues Ivoire sans restriction. Merci pour votre soutien !
          </Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Retour au profil</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ── Hero ── */}
        <LinearGradient colors={['#0B3D2E', '#1a5c45', '#2E7D32']} style={styles.hero}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          <View style={styles.heroStarRow}>
            {[0,1,2,3,4].map(i => (
              <Ionicons key={i} name="star" size={20} color="#FFD700" style={{ marginHorizontal: 2 }} />
            ))}
          </View>

          <Text style={styles.heroTitle}>Langues Ivoire</Text>
          <View style={styles.heroPremiumBadge}>
            <Text style={styles.heroPremiumText}>PREMIUM</Text>
          </View>
          <Text style={styles.heroSub}>
            Accédez aux 8 langues ethniques ivoiriennes, à l'IA linguistique illimitée et à tout le contenu culturel.
          </Text>

          {/* Essai gratuit */}
          <View style={styles.trialBadge}>
            <Ionicons name="gift-outline" size={16} color={COLORS.accent} />
            <Text style={styles.trialText}>7 jours d'essai gratuit • Sans engagement</Text>
          </View>
        </LinearGradient>

        {/* ── Comparaison avantages ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ce que vous débloquez</Text>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: f.color + '20' }]}>
                <Ionicons name={f.icon} size={20} color={f.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <View style={styles.featureCompare}>
                  <View style={styles.freeTag}>
                    <Text style={styles.freeTagText}>{f.free}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={12} color="#aaa" style={{ marginHorizontal: 6 }} />
                  <View style={styles.premiumTag}>
                    <Text style={styles.premiumTagText}>{f.premium}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
            </View>
          ))}
        </View>

        {/* ── Plans ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisissez votre plan</Text>
          {PLANS.map(plan => (
            <TouchableOpacity
              key={plan.key}
              style={[styles.planCard, plan.highlight && styles.planCardHighlight, selectedPlan === plan.key && styles.planCardSelected]}
              onPress={() => setSelectedPlan(plan.key)}
              activeOpacity={0.85}
            >
              {plan.badge && (
                <View style={[styles.planBadge, plan.highlight && { backgroundColor: COLORS.accent }]}>
                  <Text style={styles.planBadgeText}>{plan.badge}</Text>
                </View>
              )}

              <View style={styles.planLeft}>
                <View style={[styles.planRadio, selectedPlan === plan.key && styles.planRadioSelected]}>
                  {selectedPlan === plan.key && <View style={styles.planRadioDot} />}
                </View>
                <View>
                  <Text style={[styles.planLabel, plan.highlight && styles.planLabelHighlight]}>{plan.label}</Text>
                  <Text style={styles.planDesc}>{plan.desc}</Text>
                </View>
              </View>

              <View style={styles.planRight}>
                <Text style={[styles.planPrice, plan.highlight && styles.planPriceHighlight]}>
                  {plan.price}
                </Text>
                {plan.unit ? <Text style={styles.planUnit}>{plan.unit}</Text> : null}
                {plan.perMonth && <Text style={styles.planPerMonth}>{plan.perMonth}</Text>}
                {plan.priceEur ? <Text style={styles.planEur}>{plan.priceEur}</Text> : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Témoignages ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ce que disent nos utilisateurs</Text>
          {[
            { name: 'Aminata K.', text: 'Enfin je comprends ma grand-mère quand elle parle baoulé ! L\'IA est incroyable.', stars: 5 },
            { name: 'Ibrahim D.', text: 'J\'apprends le dioula pour mes voyages au Mali. L\'audio natif fait toute la différence.', stars: 5 },
            { name: 'Fatou B.', text: 'Mon école utilise Langues Ivoire pour les cours de culture ivoirienne. Parfait !', stars: 5 },
          ].map((t, i) => (
            <View key={i} style={styles.testimonialCard}>
              <View style={styles.testimonialStars}>
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Ionicons key={s} name="star" size={13} color="#FFD700" />
                ))}
              </View>
              <Text style={styles.testimonialText}>"{t.text}"</Text>
              <Text style={styles.testimonialName}>— {t.name}</Text>
            </View>
          ))}
        </View>

        {/* ── FAQ ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          {FAQ.map((f, i) => (
            <TouchableOpacity
              key={i}
              style={styles.faqItem}
              onPress={() => setFaqOpen(faqOpen === i ? null : i)}
            >
              <View style={styles.faqQ}>
                <Text style={styles.faqQText}>{f.q}</Text>
                <Ionicons name={faqOpen === i ? 'chevron-up' : 'chevron-down'} size={18} color="#999" />
              </View>
              {faqOpen === i && <Text style={styles.faqA}>{f.a}</Text>}
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* ── CTA fixe en bas ── */}
      <View style={styles.ctaBar}>
        <TouchableOpacity
          style={[styles.ctaBtn, loading && { opacity: 0.7 }]}
          onPress={handleActivate}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#F47920', '#E65100']} style={styles.ctaGradient}>
            {loading ? (
              <Text style={styles.ctaBtnText}>Activation…</Text>
            ) : selectedPlan === 'institution' ? (
              <>
                <Ionicons name="mail-outline" size={20} color="#fff" />
                <Text style={styles.ctaBtnText}>Nous contacter</Text>
              </>
            ) : (
              <>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.ctaBtnText}>
                  Commencer l'essai gratuit 7 jours
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.ctaSmall}>
          {selectedPlan !== 'institution'
            ? 'Aucun paiement pendant l\'essai · Annulation libre'
            : 'Réponse sous 24h · Devis personnalisé'}
        </Text>
      </View>

      {/* ── Modal succès ── */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.successGradient}>
              <Ionicons name="star" size={56} color="#FFD700" />
              <Text style={styles.successTitle}>Bienvenue dans Premium ! 🎉</Text>
              <Text style={styles.successSub}>
                Vous avez maintenant accès aux 8 langues ivoiriennes, à l'IA illimitée et à tout le contenu culturel.
              </Text>
              <TouchableOpacity
                style={styles.successBtn}
                onPress={() => { setShowSuccess(false); navigation.goBack(); }}
              >
                <Text style={styles.successBtnText}>Explorer le contenu Premium</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Hero
  hero:         { paddingTop: 56, paddingBottom: 36, paddingHorizontal: 24, alignItems: 'center', gap: 12 },
  closeBtn:     { position: 'absolute', top: 52, right: 20 },
  heroStarRow:  { flexDirection: 'row', marginBottom: 4 },
  heroTitle:    { fontSize: 34, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
  heroPremiumBadge: { backgroundColor: '#FFD700', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 4 },
  heroPremiumText:  { fontSize: 14, fontWeight: '900', color: '#0B3D2E', letterSpacing: 2 },
  heroSub:      { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 22 },
  trialBadge:   { flexDirection: 'row', alignItems: 'center', gap: 7,
                  backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20,
                  paddingHorizontal: 14, paddingVertical: 8, marginTop: 6 },
  trialText:    { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Section
  section:      { backgroundColor: '#fff', marginHorizontal: 14, marginTop: 14, borderRadius: 18, padding: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 16 },

  // Features
  featureRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  featureIcon:   { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  featureTitle:  { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  featureCompare: { flexDirection: 'row', alignItems: 'center' },
  freeTag:       { backgroundColor: '#F5F5F5', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  freeTagText:   { fontSize: 11, color: '#999' },
  premiumTag:    { backgroundColor: '#E8F5E9', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  premiumTagText: { fontSize: 11, color: '#2E7D32', fontWeight: '600' },

  // Plans
  planCard: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 16,
    padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: '#FAFAFA',
  },
  planCardHighlight: { borderColor: COLORS.accent, backgroundColor: '#FFF8F5' },
  planCardSelected:  { borderColor: COLORS.primary, borderWidth: 2 },
  planBadge:    { position: 'absolute', top: -10, right: 14, backgroundColor: '#1565C0',
                  borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  planBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  planLeft:     { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  planRadio:    { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc',
                  justifyContent: 'center', alignItems: 'center' },
  planRadioSelected: { borderColor: COLORS.primary },
  planRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  planLabel:    { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  planLabelHighlight: { color: COLORS.accent },
  planDesc:     { fontSize: 12, color: '#888', marginTop: 2 },
  planRight:    { alignItems: 'flex-end' },
  planPrice:    { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  planPriceHighlight: { color: COLORS.accent },
  planUnit:     { fontSize: 11, color: '#888' },
  planPerMonth: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  planEur:      { fontSize: 11, color: '#bbb' },

  // Témoignages
  testimonialCard: { backgroundColor: '#FAFAFA', borderRadius: 14, padding: 14, marginBottom: 10,
                     borderWidth: 1, borderColor: '#f0f0f0' },
  testimonialStars: { flexDirection: 'row', gap: 2, marginBottom: 6 },
  testimonialText:  { fontSize: 13, color: '#444', lineHeight: 20, fontStyle: 'italic' },
  testimonialName:  { fontSize: 12, color: '#888', marginTop: 6, fontWeight: '600' },

  // FAQ
  faqItem:  { borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingVertical: 14 },
  faqQ:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQText: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', flex: 1, paddingRight: 8 },
  faqA:     { fontSize: 13, color: '#666', marginTop: 10, lineHeight: 20 },

  // CTA
  ctaBar:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
                 paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32,
                 borderTopWidth: 1, borderTopColor: '#f0f0f0',
                 shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 8 },
  ctaBtn:      { borderRadius: 16, overflow: 'hidden' },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                 gap: 10, paddingVertical: 16 },
  ctaBtnText:  { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  ctaSmall:    { textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 8 },

  // Déjà Premium
  alreadyPremium:  { flex: 1 },
  alreadyGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 36 },
  alreadyTitle:    { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  alreadySub:      { fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 22 },
  backBtn:         { marginTop: 20, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14,
                     paddingHorizontal: 24, paddingVertical: 14 },
  backBtnText:     { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Succès
  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  successCard:    { borderRadius: 24, overflow: 'hidden' },
  successGradient: { padding: 32, alignItems: 'center', gap: 14 },
  successTitle:   { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  successSub:     { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 22 },
  successBtn:     { backgroundColor: COLORS.accent, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14, marginTop: 8 },
  successBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
