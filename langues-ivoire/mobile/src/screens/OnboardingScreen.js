import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Image, ScrollView, Animated, FlatList,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Speech from 'expo-speech';
import { createAudioPlayer } from 'expo-audio';
import AudioButton from '../components/AudioButton';
import { scheduleDailyReminder } from '../services/notificationService';
import { languagesAPI } from '../services/api';

// Chargement conditionnel — expo-notifications crash dans Expo Go Android depuis SDK 53
const _isExpoGoAndroid = Constants.appOwnership === 'expo' && Platform.OS === 'android';
const Notifications = _isExpoGoAndroid ? null : require('expo-notifications');

const { width, height } = Dimensions.get('window');
const COLORS = { primary: '#0B3D2E', accent: '#F47920' };

// ─── Messages de bienvenue par défaut (fallback si pas encore configuré dans le CMS) ──
const DEFAULT_WELCOME_MESSAGES = {
  baoule:  "Akwaba sou LANGUES IVOIRE. Merci d'avoir choisi le Baoulé. Nous allons ensemble approfondir ta connaissance.",
  dioula:  "I nana a sou LANGUES IVOIRE. I ni ce Dioula latige la. An bena i donni nogon fe.",
  bete:    "Bienvenu sur LANGUES IVOIRE. Je te remercie d'avoir choisi le Bete. Nous allons ensemble approfondir ta connaissance.",
  senoufo: "Bienvenu sur LANGUES IVOIRE. Je te remercie d'avoir choisi le Senoufo. Nous allons ensemble approfondir ta connaissance.",
  agni:    "Akwaba sou LANGUES IVOIRE. Merci d'avoir choisi l'Agni. Nous allons ensemble approfondir ta connaissance.",
  gouro:   "Bienvenu sur LANGUES IVOIRE. Je te remercie d'avoir choisi le Gouro. Nous allons ensemble approfondir ta connaissance.",
  guere:   "Bienvenu sur LANGUES IVOIRE. Je te remercie d'avoir choisi le Guere. Nous allons ensemble approfondir ta connaissance.",
  nouchi:  "Woy ! Bienvenu sur LANGUES IVOIRE. Merci d'avoir choisi le Nouchi. On va s'eclater ensemble !",
};

// ─── Jouer la séquence de bienvenue ────────────────────────────────────────
// Les données (son + message) viennent de l'API (configurées via le CMS).
// Fallback sur les messages par défaut si non configurés.
let _welcomePlayer = null;

async function playWelcomeSequence(langData) {
  try { Speech.stop(); } catch (_) {}
  try { if (_welcomePlayer) { _welcomePlayer.remove(); _welcomePlayer = null; } } catch (_) {}

  const traditionalUrl = langData?.traditionalAudioUrl || null;
  const welcomeText    = langData?.welcomeMessage
    || DEFAULT_WELCOME_MESSAGES[langData?.code]
    || `Bienvenu sur LANGUES IVOIRE. Vous avez choisi le ${langData?.nom || 'langue'}. Nous allons ensemble approfondir ta connaissance.`;

  if (traditionalUrl) {
    try {
      _welcomePlayer = createAudioPlayer({ uri: traditionalUrl });
      _welcomePlayer.play();
      await new Promise(resolve => setTimeout(resolve, 5200));
      try { _welcomePlayer.remove(); _welcomePlayer = null; } catch (_) {}
    } catch (_) {
      await new Promise(resolve => setTimeout(resolve, 600));
    }
  } else {
    await new Promise(resolve => setTimeout(resolve, 400));
  }

  Speech.speak(welcomeText, { language: 'fr-FR', pitch: 1.05, rate: 0.88 });
}

// ─── Langues disponibles ───────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'baoule',  nom: 'Baoulé',  region: 'Centre',       color: '#0B3D2E', emoji: '🌿', speakers: '~4M locuteurs' },
  { code: 'dioula',  nom: 'Dioula',  region: 'Nord / Ouest', color: '#1565C0', emoji: '🌊', speakers: '~12M locuteurs' },
  { code: 'bete',    nom: 'Bété',    region: 'Ouest',        color: '#6A1B9A', emoji: '🌺', speakers: '~500k locuteurs' },
  { code: 'senoufo', nom: 'Sénoufo', region: 'Nord',         color: '#C62828', emoji: '🦅', speakers: '~1.5M locuteurs' },
  { code: 'agni',    nom: 'Agni',    region: 'Est',          color: '#00897B', emoji: '🌴', speakers: '~900k locuteurs' },
  { code: 'gouro',   nom: 'Gouro',   region: 'Centre-Ouest', color: '#EF6C00', emoji: '🎋', speakers: '~500k locuteurs' },
  { code: 'guere',   nom: 'Guéré',   region: 'Ouest',        color: '#AD1457', emoji: '🌄', speakers: '~500k locuteurs' },
  { code: 'nouchi',  nom: 'Nouchi',  region: 'National',     color: '#37474F', emoji: '🏙️', speakers: '~20M usagers' },
];

// ─── Mots de preview par langue (3 mots "aha") ────────────────────────────
const LANG_PREVIEW = {
  baoule:  [
    { mot: 'Mô',         phonetic: '[mô]',         traduction: 'Bonjour' },
    { mot: 'Mêrci',      phonetic: '[mɛrsi]',      traduction: 'Merci' },
    { mot: 'N\'sran',    phonetic: '[n\'sɾan]',    traduction: 'Famille' },
  ],
  dioula:  [
    { mot: 'I ni sɔgɔma', phonetic: '[i ni sɔgɔma]', traduction: 'Bonjour (matin)' },
    { mot: 'A ni ce',     phonetic: '[a ni tʃɛ]',    traduction: 'Merci' },
    { mot: 'So',          phonetic: '[so]',           traduction: 'Maison' },
  ],
  bete:    [
    { mot: 'Ébléhi',   phonetic: '[ɛblɛhi]',  traduction: 'Bonjour' },
    { mot: 'Agbrè',    phonetic: '[agbɾɛ]',   traduction: 'Merci' },
    { mot: 'Plé',      phonetic: '[plɛ]',     traduction: 'Eau' },
  ],
  senoufo: [
    { mot: 'Kárigué',  phonetic: '[kaɾigwɛ]', traduction: 'Bonjour' },
    { mot: 'Báaríkê',  phonetic: '[barike]',  traduction: 'Merci' },
    { mot: 'Tuo',      phonetic: '[two]',     traduction: 'Maison' },
  ],
  agni:    [
    { mot: 'Mô',       phonetic: '[mô]',      traduction: 'Bonjour' },
    { mot: 'Mêrci',   phonetic: '[mɛrsi]',   traduction: 'Merci' },
    { mot: 'Abrodo',   phonetic: '[abɾodo]',  traduction: 'Paix' },
  ],
  gouro:   [
    { mot: 'Biiyo',    phonetic: '[biijo]',   traduction: 'Bonjour' },
    { mot: 'Dromon',   phonetic: '[dɾomɔn]',  traduction: 'Merci' },
    { mot: 'Wè',       phonetic: '[wɛ]',      traduction: 'Eau' },
  ],
  guere:   [
    { mot: 'Gòmèn',   phonetic: '[gɔmɛn]',  traduction: 'Bonjour' },
    { mot: 'Glôh',    phonetic: '[glɔh]',    traduction: 'Merci' },
    { mot: 'Iu',      phonetic: '[iu]',      traduction: 'Eau' },
  ],
  nouchi:  [
    { mot: 'Wôy',      phonetic: '[wɔj]',    traduction: 'Salut / Eh !' },
    { mot: 'Mo',       phonetic: '[mo]',     traduction: 'Moi / Je' },
    { mot: 'Gbê',      phonetic: '[gbɛ]',    traduction: 'Difficile / Dur' },
  ],
};

// ─── Objectifs quotidiens ──────────────────────────────────────────────────
const GOALS = [
  { key: '5',  label: '5 min/jour',  desc: 'Décontracté',  icon: 'leaf-outline',   color: '#4CAF50' },
  { key: '10', label: '10 min/jour', desc: 'Régulier',     icon: 'flame-outline',  color: '#F47920' },
  { key: '20', label: '20 min/jour', desc: 'Ambitieux',    icon: 'rocket-outline', color: '#1565C0' },
  { key: '30', label: '30 min/jour', desc: 'Intensif',     icon: 'trophy-outline', color: '#6A1B9A' },
];

// ─── Slides statiques (swipables) ─────────────────────────────────────────
const STATIC_SLIDES = [
  {
    id: 'welcome',
    gradient: ['#0B3D2E', '#1a5c45'],
    icon: null,  // logo
    title: 'Bienvenue sur\nLangues Ivoire',
    subtitle: 'La première plateforme numérique pour apprendre et préserver les langues ethniques de Côte d\'Ivoire.',
    badge: null,
  },
  {
    id: 'languages',
    gradient: ['#1565C0', '#0D47A1'],
    icon: 'earth',
    title: '8 Langues\nIvoiriennes',
    subtitle: 'Baoulé, Dioula, Bété, Sénoufo, Agni, Gouro, Guéré et Nouchi — avec leçons structurées, audio natif et tuteurs IA.',
    badge: '1 600+ mots',
  },
  {
    id: 'ai',
    gradient: ['#6A1B9A', '#7B1FA2'],
    icon: 'hardware-chip',
    title: 'Tuteurs IA\nAmara & Kouadio',
    subtitle: 'Pratiquez la prononciation et la grammaire avec deux agents linguistiques intelligents, disponibles 24h/24.',
    badge: 'IA culturelle',
  },
  {
    id: 'gamif',
    gradient: ['#E65100', '#F47920'],
    icon: 'trophy',
    title: 'Apprenez\nen Jouant',
    subtitle: 'Badges, séries quotidiennes, classements et défis pour que chaque session soit addictive et motivante.',
    badge: 'Gamification',
  },
];

// ─── Steps : 0–3 statiques | 4 langue | 5 preview | 6 objectif ───────────
const TOTAL_STEPS = STATIC_SLIDES.length + 3; // 4 + langue + preview + objectif

export default function OnboardingScreen({ navigation }) {
  const flatRef = useRef(null);
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState('10');
  const [notifGranted, setNotifGranted] = useState(null);
  const [welcomePlaying, setWelcomePlaying] = useState(false);
  // Langues enrichies depuis l'API (avec traditionalAudioUrl + welcomeMessage du CMS)
  const [apiLanguages, setApiLanguages] = useState([]);

  const interactiveAnim = useRef(new Animated.Value(0)).current;
  const previewAnim     = useRef(new Animated.Value(0)).current;
  const pulseAnim       = useRef(new Animated.Value(1)).current;   // animation pulsation

  // Pulsation sur la carte sélectionnée pendant la lecture audio
  useEffect(() => {
    if (welcomePlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0,  duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [welcomePlaying]);

  // Charger les langues depuis l'API pour récupérer traditionalAudioUrl + welcomeMessage
  useEffect(() => {
    languagesAPI.getAll()
      .then(({ data }) => {
        const langs = Array.isArray(data) ? data : data.languages || [];
        setApiLanguages(langs);
      })
      .catch(() => {}); // Silencieux — fallback sur les données locales
  }, []);

  // Nettoyage audio à la sortie de l'écran
  useEffect(() => {
    return () => { try { Speech.stop(); } catch (_) {} };
  }, []);

  const animateIn = (anim) => {
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, tension: 70, friction: 10, useNativeDriver: true }).start();
  };

  // ─── Navigation ─────────────────────────────────────────────────────────
  const goTo = useCallback((next) => {
    if (next < STATIC_SLIDES.length && next >= 0) {
      // Swipe FlatList
      flatRef.current?.scrollToIndex({ index: next, animated: true });
    }
    setStep(next);
    if (next === 4) animateIn(interactiveAnim);
    if (next === 5) animateIn(previewAnim);
  }, [interactiveAnim, previewAnim]);

  const next = useCallback(() => {
    if (step < TOTAL_STEPS - 1) goTo(step + 1);
    else finish();
  }, [step, goTo]);

  const canNext = () => {
    if (step === 4) return !!selectedLang;
    return true;
  };

  // ─── Fin de l'onboarding ─────────────────────────────────────────────────
  const finish = async () => {
    // Demander la permission notifications et activer le rappel quotidien
    if (Platform.OS !== 'web' && notifGranted === null && Notifications) {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        const granted = status === 'granted';
        setNotifGranted(granted);
        if (granted) {
          // Rappel à 20h par défaut (heure du soir, après le travail)
          await scheduleDailyReminder(20, 0).catch(() => {});
        }
      } catch { /* ignore */ }
    }
    await AsyncStorage.multiSet([
      ['onboarding_done',     'true'],
      ['preferred_language',  selectedLang || 'baoule'],
      ['daily_goal_minutes',  selectedGoal],
    ]);
    navigation.replace('Register');
  };

  // ─── Slide statique (item FlatList) ─────────────────────────────────────
  const renderStaticSlide = ({ item: slide }) => (
    <LinearGradient colors={slide.gradient} style={styles.flatSlide}>
      <View style={styles.slideContent}>
        {slide.id === 'welcome' ? (
          <View style={styles.logoWrap}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          </View>
        ) : (
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name={slide.icon} size={72} color="#fff" />
          </View>
        )}

        {slide.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{slide.badge}</Text>
          </View>
        )}

        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
      </View>
    </LinearGradient>
  );

  // ─── Slide : Choix de langue ─────────────────────────────────────────────
  const renderLanguageSlide = () => (
    <Animated.View style={[
      { flex: 1 },
      { opacity: interactiveAnim, transform: [{ translateY: interactiveAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] },
    ]}>
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.slide}>
        <Text style={styles.interactiveTitle}>
          Quelle langue souhaitez{'\n'}vous apprendre ?
        </Text>
        <Text style={styles.interactiveSub}>
          Vous pourrez en changer ou en ajouter d'autres à tout moment.
        </Text>

        <ScrollView
          contentContainerStyle={styles.langGrid}
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
        >
          {LANGUAGES.map(lang => {
            const selected = selectedLang === lang.code;
            const isPlaying = selected && welcomePlaying;
            return (
              <Animated.View
                key={lang.code}
                style={isPlaying ? { transform: [{ scale: pulseAnim }] } : undefined}
              >
                <TouchableOpacity
                  style={[
                    styles.langCard,
                    selected && { backgroundColor: lang.color, borderColor: '#fff', borderWidth: 2 },
                    isPlaying && { shadowColor: lang.color, shadowOpacity: 0.7, shadowRadius: 12, elevation: 8 },
                  ]}
                  onPress={async () => {
                    if (welcomePlaying) return; // éviter double tap
                    setSelectedLang(lang.code);
                    setWelcomePlaying(true);
                    try {
                      // Fusionner les données locales avec les données API (son + message du CMS)
                      const apiLang = apiLanguages.find(l => l.code === lang.code) || {};
                      await playWelcomeSequence({ ...lang, ...apiLang });
                    } finally {
                      // Attendre la fin du TTS (~4s max) puis désactiver l'animation
                      setTimeout(() => setWelcomePlaying(false), 6000);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.langEmoji}>{lang.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.langName, selected && { color: '#fff' }]}>{lang.nom}</Text>
                    <Text style={[styles.langRegion, selected && { color: 'rgba(255,255,255,0.75)' }]}>
                      {lang.region} · {lang.speakers}
                    </Text>
                  </View>
                  {isPlaying
                    ? <Ionicons name="volume-high" size={22} color="#fff" />
                    : selected
                      ? <Ionicons name="checkmark-circle" size={22} color="#fff" />
                      : <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
                  }
                </TouchableOpacity>
              </Animated.View>
            );
          })}
          <View style={{ height: 200 }} />
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );

  // ─── Slide : Mini-leçon preview ──────────────────────────────────────────
  const renderPreviewSlide = () => {
    const lang     = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
    const words    = LANG_PREVIEW[lang.code] || LANG_PREVIEW['baoule'];

    return (
      <Animated.View style={[
        { flex: 1 },
        { opacity: previewAnim, transform: [{ scale: previewAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] },
      ]}>
        <LinearGradient colors={[lang.color, '#000']} style={[styles.slide, { justifyContent: 'flex-start', paddingTop: 70 }]}>
          <View style={styles.previewHeader}>
            <Text style={styles.langEmoji}>{lang.emoji}</Text>
            <View>
              <Text style={styles.previewLang}>{lang.nom}</Text>
              <Text style={styles.previewTagline}>Votre premier cours commence ici</Text>
            </View>
          </View>

          <View style={styles.previewCards}>
            {words.map((w, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.previewCard,
                  {
                    opacity: previewAnim,
                    transform: [{ translateX: previewAnim.interpolate({ inputRange: [0, 1], outputRange: [40 * (i + 1), 0] }) }],
                  },
                ]}
              >
                <View style={styles.previewCardLeft}>
                  <Text style={styles.previewMot}>{w.mot}</Text>
                  <Text style={styles.previewPhonetic}>{w.phonetic}</Text>
                  <Text style={styles.previewTraduction}>{w.traduction}</Text>
                </View>
                <AudioButton
                  text={w.mot}
                  langCode={lang.code}
                  size={24}
                  color="#fff"
                  style={styles.previewAudio}
                />
              </Animated.View>
            ))}
          </View>

          <View style={styles.previewHint}>
            <Ionicons name="volume-high-outline" size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.previewHintText}>
              Appuyez sur 🔊 pour entendre la prononciation
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  // ─── Slide : Objectif quotidien ──────────────────────────────────────────
  const renderGoalSlide = () => (
    <LinearGradient colors={['#1565C0', '#0D47A1']} style={styles.slide}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.goalScrollContent}
      >
        <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Ionicons name="time" size={64} color="#fff" />
        </View>
        <Text style={styles.interactiveTitle}>
          Quel est votre{'\n'}objectif quotidien ?
        </Text>
        <Text style={styles.interactiveSub}>
          Nous adapterons vos rappels et votre progression à cet objectif.
        </Text>

        <View style={styles.goalsRow}>
          {GOALS.map(goal => {
            const selected = selectedGoal === goal.key;
            return (
              <TouchableOpacity
                key={goal.key}
                style={[styles.goalCard, selected && { backgroundColor: goal.color, borderColor: '#fff' }]}
                onPress={() => setSelectedGoal(goal.key)}
              >
                <Ionicons name={goal.icon} size={28} color={selected ? '#fff' : goal.color} />
                <Text style={[styles.goalLabel, selected && { color: '#fff' }]}>{goal.label}</Text>
                <Text style={[styles.goalDesc, selected && { color: 'rgba(255,255,255,0.8)' }]}>{goal.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notification opt-in */}
        <View style={styles.notifHint}>
          <Ionicons name="notifications-outline" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.notifHintText}>
            Nous vous enverrons un rappel quotidien pour atteindre votre objectif.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );

  // ─── Rendu principal ─────────────────────────────────────────────────────
  const renderCurrentStep = () => {
    if (step < STATIC_SLIDES.length) return null; // géré par FlatList
    if (step === 4) return renderLanguageSlide();
    if (step === 5) return renderPreviewSlide();
    return renderGoalSlide();
  };

  const isLastStep    = step === TOTAL_STEPS - 1;
  const isInteractive = step >= 4;
  const isOnFlatList  = step < STATIC_SLIDES.length;

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* FlatList horizontale pour slides statiques */}
      {isOnFlatList && (
        <FlatList
          ref={flatRef}
          data={STATIC_SLIDES}
          renderItem={renderStaticSlide}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            if (idx !== step) setStep(idx);
          }}
          style={{ flex: 1 }}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        />
      )}

      {/* Slides interactives */}
      {!isOnFlatList && (
        <View style={{ flex: 1 }}>
          {renderCurrentStep()}
        </View>
      )}

      {/* ── Footer ── */}
      <View style={[styles.footer, isInteractive && styles.footerDark]}>
        {/* Indicateurs de progression */}
        <View style={styles.progressRow}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => { if (i < step || !isInteractive) goTo(i); }}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <View style={[
                styles.dot,
                i === step   && styles.dotActive,
                i < step     && styles.dotPast,
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bouton principal */}
        <TouchableOpacity
          style={[styles.btn, !canNext() && styles.btnDisabled]}
          onPress={next}
          disabled={!canNext()}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>
            {isLastStep ? 'Créer mon compte' : step === 5 ? 'Continuer →' : 'Suivant'}
          </Text>
          {isLastStep && <Ionicons name="person-add" size={18} color="#fff" />}
        </TouchableOpacity>

        {/* Liens secondaires */}
        <View style={styles.bottomLinks}>
          {!isLastStep && step < TOTAL_STEPS - 1 && (
            <TouchableOpacity onPress={() => goTo(TOTAL_STEPS - 1)}>
              <Text style={styles.skipText}>Passer</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.loginText}>J'ai déjà un compte →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Slides
  flatSlide:    { width, flex: 1, alignItems: 'center', justifyContent: 'center' },
  slide:        { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  slideContent: { alignItems: 'center', paddingHorizontal: 36, gap: 18, paddingTop: 60 },

  // Éléments statiques
  logoWrap:    { marginBottom: 8 },
  logo:        { width: 180, height: 180 },
  iconCircle:  { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center' },
  slideTitle:  { fontSize: 30, fontWeight: 'bold', color: '#fff', textAlign: 'center', lineHeight: 38 },
  slideSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 23 },

  badge:     { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Titres interactifs
  interactiveTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', lineHeight: 32, marginTop: 8, marginBottom: 6, paddingHorizontal: 20 },
  interactiveSub:   { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 20, marginBottom: 14, paddingHorizontal: 24 },

  // Langue
  langGrid: { paddingHorizontal: 20, gap: 10 },
  langCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16,
    padding: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
  },
  langEmoji:  { fontSize: 26, width: 34, textAlign: 'center' },
  langName:   { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  langRegion: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 },

  // Preview
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28, paddingHorizontal: 24 },
  previewLang:   { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  previewTagline: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  previewCards: { width: '100%', paddingHorizontal: 20, gap: 12 },
  previewCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: 18,
    padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  previewCardLeft: { flex: 1 },
  previewMot:       { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  previewPhonetic:  { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', marginBottom: 4 },
  previewTraduction: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  previewAudio:     { backgroundColor: 'rgba(255,255,255,0.18)', width: 46, height: 46, borderRadius: 23 },

  previewHint: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20, paddingHorizontal: 24 },
  previewHintText: { fontSize: 13, color: 'rgba(255,255,255,0.55)', textAlign: 'center', flex: 1 },

  // Objectifs
  goalScrollContent: {
    alignItems: 'center', paddingHorizontal: 36, gap: 18,
    paddingTop: 60, paddingBottom: 210,
    width: '100%',
  },
  goalsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 8, paddingHorizontal: 8 },
  goalCard: {
    width: (width - 72) / 2, alignItems: 'center', gap: 6, padding: 16,
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  goalLabel: { fontSize: 15, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  goalDesc:  { fontSize: 12, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },

  // Notification hint
  notifHint:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, paddingHorizontal: 24, opacity: 0.75 },
  notifHintText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', flex: 1, lineHeight: 18 },

  // Footer
  footer:     { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', gap: 14, paddingBottom: 44, paddingTop: 16 },
  footerDark: { backgroundColor: 'rgba(0,0,0,0.3)' },

  progressRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot:       { width: 7,  height: 7,  borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { width: 24, height: 7,  borderRadius: 3.5, backgroundColor: '#fff' },
  dotPast:   { width: 7,  height: 7,  borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.55)' },

  btn: {
    flexDirection: 'row', backgroundColor: COLORS.accent, borderRadius: 50,
    paddingVertical: 15, paddingHorizontal: 44, alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  btnDisabled: { opacity: 0.4 },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  bottomLinks: { flexDirection: 'row', gap: 28, alignItems: 'center' },
  skipText:    { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  loginText:   { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
});
