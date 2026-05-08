import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Animated, Alert, Dimensions, Modal, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { useFocusEffect } from '@react-navigation/native';
import { getAvatar } from '../data/avatars';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Palette street art ───────────────────────────────────────────────────────
const C = {
  bg: '#121212',
  card: '#1E1E1E',
  cardBorder: '#2A2A2A',
  orange: '#FF6B35',
  yellow: '#FFD600',
  green: '#39D353',
  blue: '#00D2FF',
  purple: '#C77DFF',
  white: '#F0F0F0',
  grey: '#888',
  red: '#FF3B30',
};

// ── Tuteurs Nouchi ────────────────────────────────────────────────────────────
const TUTEURS = {
  pololo: {
    nom: 'Pololo',
    genre: 'M',
    description: 'DJ de maquis, 26 ans · Cocody',
    emoji: '🎧',
    gradient: ['#FF6B35', '#FF3B30'],
    phrase: 'Wesh ! Bienvenue au Coin des Branches. On va parler le vrai abidjanais !',
  },
  nache: {
    nom: 'Nache',
    genre: 'F',
    description: 'Influenceuse-coiffeuse, 25 ans · Yopougon',
    emoji: '💅',
    gradient: ['#C77DFF', '#7B2FBE'],
    phrase: 'Eh les gos ! Installez-vous, on va apprendre le nouchi le plus stylé !',
  },
};

// ── Les 20 mots essentiels Nouchi ─────────────────────────────────────────────
const MOTS_NOUCHI = [
  {
    id: 1,
    mot: 'Garagara',
    prononciation: '[ga-ra-ga-ra]',
    sens: 'Beaucoup, énormément',
    exemple: "Il y a garagara de monde au maquis ce soir !",
    tag: 'quantité',
    emoji: '💯',
  },
  {
    id: 2,
    mot: 'Wari',
    prononciation: '[wa-ri]',
    sens: 'Argent',
    exemple: "J'ai pas de wari, je peux pas sortir.",
    tag: 'argent',
    emoji: '💸',
  },
  {
    id: 3,
    mot: 'Kpata',
    prononciation: '[kpa-ta]',
    sens: 'Problème, bagarre',
    exemple: "N'amène pas le kpata ici, on est entre amis.",
    tag: 'conflit',
    emoji: '🥊',
  },
  {
    id: 4,
    mot: 'Dja',
    prononciation: '[dja]',
    sens: 'Beau, cool, stylé',
    exemple: "Ton outfit là c'est trop dja !",
    tag: 'compliment',
    emoji: '✨',
  },
  {
    id: 5,
    mot: 'Gaou',
    prononciation: '[ga-ou]',
    sens: 'Naïf, nigaud, qui se fait avoir',
    exemple: "T'es trop gaou, tu lui as donné ton téléphone ?",
    tag: 'insulte légère',
    emoji: '😅',
  },
  {
    id: 6,
    mot: 'Les gos',
    prononciation: '[lé go]',
    sens: 'Les filles',
    exemple: "Les gos de Yopougon sont trop belles !",
    tag: 'personnes',
    emoji: '💃',
  },
  {
    id: 7,
    mot: "Gbê",
    prononciation: '[gbè]',
    sens: 'Vrai, vraiment, pour de vrai',
    exemple: "Gbê là, il sait chanter !",
    tag: 'affirmation',
    emoji: '☑️',
  },
  {
    id: 8,
    mot: 'Molo molo',
    prononciation: '[mo-lo mo-lo]',
    sens: 'Doucement, tranquillement',
    exemple: "Descends molo molo, c'est glissant.",
    tag: 'vitesse',
    emoji: '🐢',
  },
  {
    id: 9,
    mot: "C'est go",
    prononciation: '[sé go]',
    sens: "C'est parti, on y va, c'est d'accord",
    exemple: "Tout le monde est prêt ? C'est go !",
    tag: 'départ',
    emoji: '🚀',
  },
  {
    id: 10,
    mot: 'Vieux',
    prononciation: '[vieux]',
    sens: 'Ami, frère, pote (terme affectif)',
    exemple: "Eh vieux, ça fait longtemps !",
    tag: 'amitié',
    emoji: '🤜',
  },
  {
    id: 11,
    mot: 'Djaka',
    prononciation: '[dja-ka]',
    sens: 'Fête, ambiance festive',
    exemple: "Ce soir c'est djaka au quartier !",
    tag: 'fête',
    emoji: '🎉',
  },
  {
    id: 12,
    mot: 'Djandjou',
    prononciation: '[djan-djou]',
    sens: 'Désordre, pagaille, confusion',
    exemple: "Arrêtez le djandjou, on peut pas travailler.",
    tag: 'désordre',
    emoji: '🌀',
  },
  {
    id: 13,
    mot: 'Gnata',
    prononciation: '[gna-ta]',
    sens: 'Voler, piquer quelque chose',
    exemple: "Méfie-toi, il va te gnata ton portable.",
    tag: 'action',
    emoji: '🫳',
  },
  {
    id: 14,
    mot: 'Bôhi',
    prononciation: '[bô-hi]',
    sens: 'Dormir',
    exemple: "J'ai garagara bôhi cette nuit, je suis reposé !",
    tag: 'quotidien',
    emoji: '😴',
  },
  {
    id: 15,
    mot: 'Rouler carotte',
    prononciation: '[rou-lé ka-rot]',
    sens: "Tromper quelqu'un, arnaquer",
    exemple: "Il m'a roulé carotte avec ce deal.",
    tag: 'tromperie',
    emoji: '🥕',
  },
  {
    id: 16,
    mot: 'Branchés',
    prononciation: '[bran-ché]',
    sens: 'Personnes à la mode, dans la tendance',
    exemple: "Les branchés de la Riviera sont là.",
    tag: 'mode',
    emoji: '😎',
  },
  {
    id: 17,
    mot: 'Niale',
    prononciation: '[nia-lé]',
    sens: 'Galère, problème, situation difficile',
    exemple: "Quelle niale ce mois-ci, j'ai plus un rond.",
    tag: 'galère',
    emoji: '😩',
  },
  {
    id: 18,
    mot: 'Kponton',
    prononciation: '[kpon-ton]',
    sens: 'Gros, costaud, imposant',
    exemple: "Le videur est vraiment kponton, on entre pas.",
    tag: 'corps',
    emoji: '💪',
  },
  {
    id: 19,
    mot: 'Tchao',
    prononciation: '[tchao]',
    sens: 'Au revoir, bye (salutation de départ)',
    exemple: "Allez, tchao les amis !",
    tag: 'salutation',
    emoji: '👋',
  },
  {
    id: 20,
    mot: 'On est ensemble',
    prononciation: '[on è an-sanm]',
    sens: 'Expression de solidarité, de soutien',
    exemple: "T'inquiète pas vieux, on est ensemble.",
    tag: 'solidarité',
    emoji: '🤝',
  },
];

// ── Badges de rue ─────────────────────────────────────────────────────────────
const BADGES_NOUCHI = [
  {
    id: 'branche',
    titre: 'Le Branché',
    desc: 'Apprendre 5 mots Nouchi',
    emoji: '🌿',
    seuil: 5,
    couleur: C.green,
  },
  {
    id: 'pointu',
    titre: 'Le Pointu',
    desc: 'Apprendre 12 mots Nouchi',
    emoji: '⚡',
    seuil: 12,
    couleur: C.orange,
  },
  {
    id: 'connaisseur',
    titre: 'Le Connaisseur',
    desc: 'Maîtriser tous les 20 mots',
    emoji: '👑',
    seuil: 20,
    couleur: C.yellow,
  },
];

const STORAGE_KEYS = {
  known: 'nouchi_known_words',
  tuteur: 'nouchi_selected_tuteur',
};

// ── Composant principal ───────────────────────────────────────────────────────
export default function NouchiScreen({ navigation }) {
  const [tuteur, setTuteur] = useState('pololo');
  const [knownIds, setKnownIds] = useState(new Set());
  const [tab, setTab] = useState('apprendre'); // 'apprendre' | 'quiz' | 'badges'
  const [quizActive, setQuizActive] = useState(false);
  const [quizWord, setQuizWord] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizResult, setQuizResult] = useState(null); // null | 'correct' | 'wrong'
  const [quizScore, setQuizScore] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [tuteurModal, setTuteurModal] = useState(false);

  // Animations
  const graffAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation pour les badges débloqués
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Fade-in graffiti header
  useEffect(() => {
    Animated.timing(graffAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  // Charger préférences
  useEffect(() => {
    AsyncStorage.multiGet([STORAGE_KEYS.known, STORAGE_KEYS.tuteur]).then(pairs => {
      const saved = pairs[0][1];
      const savedTuteur = pairs[1][1];
      if (saved) {
        try { setKnownIds(new Set(JSON.parse(saved))); } catch (_) {}
      }
      if (savedTuteur) setTuteur(savedTuteur);
    });
  }, []);

  // Cleanup speech on exit
  useFocusEffect(
    useCallback(() => {
      return () => { Speech.stop(); };
    }, [])
  );

  const saveKnown = async (newSet) => {
    setKnownIds(newSet);
    await AsyncStorage.setItem(STORAGE_KEYS.known, JSON.stringify([...newSet]));
  };

  const toggleKnown = async (id) => {
    const next = new Set(knownIds);
    if (next.has(id)) { next.delete(id); } else { next.add(id); }
    await saveKnown(next);
    // Vérifier badge
    checkBadge(next.size);
  };

  const checkBadge = (count) => {
    const awarded = BADGES_NOUCHI.filter(b => b.seuil === count);
    if (awarded.length > 0) {
      const b = awarded[0];
      Alert.alert(
        `${b.emoji} Badge débloqué !`,
        `Tu as gagné le badge "${b.titre}" !\n${b.desc}`,
        [{ text: 'Trop dja ! 🎉', style: 'default' }]
      );
    }
  };

  const speakWord = (mot) => {
    Speech.stop();
    Speech.speak(mot, { language: 'fr-FR', rate: 0.75, pitch: 1.0 });
  };

  const speakExample = (exemple) => {
    Speech.stop();
    Speech.speak(exemple, { language: 'fr-FR', rate: 0.8, pitch: 1.0 });
  };

  // ── Quiz logic ────────────────────────────────────────────────────────────
  const startQuiz = () => {
    setQuizScore(0);
    setQuizCount(0);
    setQuizResult(null);
    setQuizActive(true);
    pickQuizWord();
  };

  const pickQuizWord = () => {
    const randomWord = MOTS_NOUCHI[Math.floor(Math.random() * MOTS_NOUCHI.length)];
    const wrongOnes = MOTS_NOUCHI
      .filter(w => w.id !== randomWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.sens);
    const options = [randomWord.sens, ...wrongOnes].sort(() => Math.random() - 0.5);
    setQuizWord(randomWord);
    setQuizOptions(options);
    setQuizResult(null);
    speakWord(randomWord.mot);
  };

  const answerQuiz = (answer) => {
    const correct = answer === quizWord.sens;
    setQuizResult(correct ? 'correct' : 'wrong');
    if (correct) {
      setQuizScore(s => s + 1);
      // Marquer comme connu
      const next = new Set(knownIds);
      next.add(quizWord.id);
      saveKnown(next);
    } else {
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
    const newCount = quizCount + 1;
    setQuizCount(newCount);
    if (newCount >= 10) {
      // Fin du quiz
      setTimeout(() => {
        Alert.alert(
          '🎯 Quiz terminé !',
          `Score : ${correct ? quizScore + 1 : quizScore} / 10\n${
            (correct ? quizScore + 1 : quizScore) >= 8
              ? "Gbê là, t'es un vrai connaisseur ! 👑"
              : (correct ? quizScore + 1 : quizScore) >= 5
              ? "Pas mal ! Continue comme ça ! ⚡"
              : "Révise encore un peu, vieux ! 💪"
          }`,
          [{ text: 'Rejouer', onPress: startQuiz }, { text: 'Retour', onPress: () => { setQuizActive(false); setTab('apprendre'); } }]
        );
      }, 800);
    } else {
      setTimeout(pickQuizWord, 1200);
    }
  };

  const progress = knownIds.size;
  const t = TUTEURS[tuteur];

  // ── Render badges ──────────────────────────────────────────────────────────
  const renderBadges = () => (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.badgesTitle}>🏆 Badges de Rue</Text>
      <Text style={styles.badgesSubtitle}>Mots connus : {progress} / 20</Text>
      {BADGES_NOUCHI.map(badge => {
        const unlocked = progress >= badge.seuil;
        return (
          <Animated.View
            key={badge.id}
            style={[
              styles.badgeCard,
              unlocked && { borderColor: badge.couleur, transform: [{ scale: unlocked ? pulseAnim : 1 }] },
            ]}
          >
            <Text style={[styles.badgeEmoji, !unlocked && { opacity: 0.3 }]}>{badge.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.badgeTitle, { color: unlocked ? badge.couleur : C.grey }]}>
                {badge.titre}
              </Text>
              <Text style={styles.badgeDesc}>{badge.desc}</Text>
              {!unlocked && (
                <View style={styles.badgeProgress}>
                  <View style={[styles.badgeProgressFill, {
                    width: `${Math.min(100, (progress / badge.seuil) * 100)}%`,
                    backgroundColor: badge.couleur,
                  }]} />
                </View>
              )}
            </View>
            {unlocked && (
              <Ionicons name="checkmark-circle" size={28} color={badge.couleur} />
            )}
          </Animated.View>
        );
      })}

      {/* Section mots connus */}
      <Text style={[styles.badgesTitle, { marginTop: 24 }]}>📋 Mes mots appris</Text>
      {progress === 0 ? (
        <Text style={styles.emptyText}>Commence par apprendre quelques mots !</Text>
      ) : (
        <View style={styles.knownGrid}>
          {MOTS_NOUCHI.filter(m => knownIds.has(m.id)).map(m => (
            <View key={m.id} style={styles.knownChip}>
              <Text style={styles.knownChipText}>{m.emoji} {m.mot}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  // ── Render quiz ────────────────────────────────────────────────────────────
  const renderQuiz = () => {
    if (!quizActive) {
      return (
        <View style={styles.quizStart}>
          <Text style={styles.quizStartEmoji}>🎯</Text>
          <Text style={styles.quizStartTitle}>Quiz Nouchi</Text>
          <Text style={styles.quizStartDesc}>
            10 questions · L'IA prononce un mot, tu choisis la bonne traduction.{'\n'}
            C'est go ?
          </Text>
          <TouchableOpacity style={styles.quizStartBtn} onPress={startQuiz}>
            <LinearGradient colors={[C.orange, '#FF3B30']} style={styles.quizStartBtnGrad}>
              <Text style={styles.quizStartBtnText}>Commencer le Quiz 🚀</Text>
            </LinearGradient>
          </TouchableOpacity>
          {progress > 0 && (
            <Text style={styles.quizSubNote}>Tu connais déjà {progress} mots sur 20</Text>
          )}
        </View>
      );
    }

    return (
      <Animated.View style={[styles.quizContainer, { transform: [{ translateX: shakeAnim }] }]}>
        {/* Score */}
        <View style={styles.quizScore}>
          <Text style={styles.quizScoreText}>{quizScore} / {quizCount} ✅</Text>
          <Text style={styles.quizCountText}>Question {quizCount + 1} / 10</Text>
        </View>

        {/* Mot */}
        <LinearGradient colors={['#1E1E1E', '#2A2A2A']} style={styles.quizWordCard}>
          <Text style={styles.quizWordEmoji}>{quizWord?.emoji}</Text>
          <Text style={styles.quizWord}>{quizWord?.mot}</Text>
          <Text style={styles.quizPrononciation}>{quizWord?.prononciation}</Text>
          <TouchableOpacity onPress={() => speakWord(quizWord?.mot)} style={styles.quizSpeakBtn}>
            <Ionicons name="volume-high" size={20} color={C.orange} />
            <Text style={styles.quizSpeakText}>Écouter</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Options */}
        <Text style={styles.quizQuestion}>Que signifie ce mot ?</Text>
        {quizOptions.map((option, idx) => {
          let bg = styles.quizOption;
          if (quizResult && option === quizWord.sens) bg = styles.quizOptionCorrect;
          else if (quizResult === 'wrong' && option === quizOptions.find(o => quizResult && o !== quizWord.sens)) bg = styles.quizOptionWrong;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.quizOption,
                quizResult && option === quizWord.sens && styles.quizOptionCorrect,
              ]}
              onPress={() => !quizResult && answerQuiz(option)}
              disabled={!!quizResult}
            >
              <Text style={[
                styles.quizOptionText,
                quizResult && option === quizWord.sens && { color: C.bg, fontWeight: 'bold' },
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}

        {quizResult && (
          <Text style={[
            styles.quizFeedback,
            { color: quizResult === 'correct' ? C.green : C.red },
          ]}>
            {quizResult === 'correct'
              ? '✅ Gbê ! Bonne réponse !'
              : `❌ C'est "${quizWord?.sens}"`}
          </Text>
        )}
      </Animated.View>
    );
  };

  // ── Render word card ───────────────────────────────────────────────────────
  const renderWordCard = ({ item }) => {
    const known = knownIds.has(item.id);
    const expanded = expandedId === item.id;
    return (
      <TouchableOpacity
        style={[styles.wordCard, known && styles.wordCardKnown]}
        onPress={() => setExpandedId(expanded ? null : item.id)}
        activeOpacity={0.85}
      >
        <View style={styles.wordCardTop}>
          <Text style={styles.wordEmoji}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.wordMot, { color: known ? C.green : C.white }]}>{item.mot}</Text>
            <Text style={styles.wordPrononciation}>{item.prononciation}</Text>
          </View>
          <View style={styles.wordTagContainer}>
            <Text style={styles.wordTag}>#{item.tag}</Text>
          </View>
        </View>

        {expanded && (
          <View style={styles.wordExpanded}>
            <Text style={styles.wordSens}>📖 {item.sens}</Text>
            <View style={styles.wordExempleRow}>
              <Text style={styles.wordExemple}>💬 "{item.exemple}"</Text>
              <TouchableOpacity onPress={() => speakExample(item.exemple)} style={{ padding: 4 }}>
                <Ionicons name="volume-medium-outline" size={18} color={C.blue} />
              </TouchableOpacity>
            </View>
            <View style={styles.wordActions}>
              <TouchableOpacity style={styles.wordSpeakBtn} onPress={() => speakWord(item.mot)}>
                <Ionicons name="volume-high" size={16} color={C.orange} />
                <Text style={styles.wordSpeakText}>Prononcer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.wordKnownBtn, known && styles.wordKnownBtnActive]}
                onPress={() => toggleKnown(item.id)}
              >
                <Ionicons
                  name={known ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={16}
                  color={known ? C.bg : C.green}
                />
                <Text style={[styles.wordKnownText, known && { color: C.bg }]}>
                  {known ? 'Connu ✓' : 'Marquer comme connu'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ── Modal choix tuteur ─────────────────────────────────────────────────────
  const renderTuteurModal = () => (
    <Modal visible={tuteurModal} transparent animationType="slide" onRequestClose={() => setTuteurModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>🎙️ Choisir ton guide</Text>
          {Object.entries(TUTEURS).map(([key, tv]) => (
            <TouchableOpacity
              key={key}
              style={[styles.tuteurOption, tuteur === key && { borderColor: tv.gradient[0], borderWidth: 2 }]}
              onPress={async () => {
                setTuteur(key);
                await AsyncStorage.setItem(STORAGE_KEYS.tuteur, key);
                setTuteurModal(false);
              }}
            >
              {getAvatar(tv.nom, 'neutre') ? (
                <Image source={getAvatar(tv.nom, 'neutre')} style={styles.tuteurOptionAvatarImg} />
              ) : (
                <LinearGradient colors={tv.gradient} style={styles.tuteurOptionEmoji}>
                  <Text style={{ fontSize: 28 }}>{tv.emoji}</Text>
                </LinearGradient>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.tuteurOptionNom}>{tv.nom}</Text>
                <Text style={styles.tuteurOptionDesc}>{tv.description}</Text>
              </View>
              {tuteur === key && <Ionicons name="checkmark-circle" size={24} color={tv.gradient[0]} />}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.modalClose} onPress={() => setTuteurModal(false)}>
            <Text style={styles.modalCloseText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {renderTuteurModal()}

      {/* Header graffiti */}
      <Animated.View style={{ opacity: graffAnim }}>
        <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.header}>
          {/* Ligne titre + tuteur compacte */}
          <View style={styles.headerTopRow}>
            {/* Titre graffiti compact */}
            <View>
              <Text style={styles.graffitiTag}>NOUCHI</Text>
              <Text style={styles.graffitiSub}>ABIDJAN 225</Text>
            </View>

            {/* Tuteur — avatar + nom + son */}
            <TouchableOpacity style={styles.tuteurRow} onPress={() => setTuteurModal(true)} activeOpacity={0.8}>
              {getAvatar(t.nom, 'neutre') ? (
                <Image source={getAvatar(t.nom, 'neutre')} style={styles.tuteurAvatarImg} />
              ) : (
                <LinearGradient colors={t.gradient} style={styles.tuteurAvatar}>
                  <Text style={{ fontSize: 22 }}>{t.emoji}</Text>
                </LinearGradient>
              )}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.tuteurNom}>{t.nom}</Text>
                  <Ionicons name="chevron-down" size={12} color={C.grey} />
                </View>
                <Text style={styles.tuteurDesc} numberOfLines={1}>{t.description}</Text>
              </View>
              <TouchableOpacity onPress={() => speakWord(t.phrase)} style={{ padding: 4 }}>
                <Ionicons name="volume-high-outline" size={18} color={C.orange} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* Phrase du tuteur compacte */}
          <View style={styles.tuteurBubble}>
            <Text style={styles.tuteurPhrase} numberOfLines={2}>"{t.phrase}"</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>📚 Mots connus : {progress}/20</Text>
            <Text style={styles.progressPercent}>{Math.round((progress / 20) * 100)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[C.orange, C.yellow]}
              style={[styles.progressFill, { width: `${(progress / 20) * 100}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Onglets */}
      <View style={styles.tabs}>
        {[
          { key: 'apprendre', label: '📖 Apprendre', icon: 'book' },
          { key: 'quiz', label: '🎯 Quiz', icon: 'trophy' },
          { key: 'badges', label: '🏆 Badges', icon: 'ribbon' },
        ].map(tab_ => (
          <TouchableOpacity
            key={tab_.key}
            style={[styles.tab, tab === tab_.key && styles.tabActive]}
            onPress={() => { setTab(tab_.key); if (tab_.key !== 'quiz') setQuizActive(false); }}
          >
            <Text style={[styles.tabText, tab === tab_.key && styles.tabTextActive]}>
              {tab_.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenu */}
      {tab === 'apprendre' && (
        <FlatList
          data={MOTS_NOUCHI}
          renderItem={renderWordCard}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.wordList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                🗺️ 20 mots essentiels du Nouchi — la langue de la rue abidjanaise
              </Text>
            </View>
          }
        />
      )}
      {tab === 'quiz' && (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {renderQuiz()}
        </ScrollView>
      )}
      {tab === 'badges' && renderBadges()}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // Header
  header: { paddingTop: 12, paddingHorizontal: 16, paddingBottom: 10 },
  graffitiDeco: { marginBottom: 8 },
  headerTopRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6,
  },
  graffitiTag: {
    fontSize: 20, fontWeight: '900', color: C.orange,
    letterSpacing: 3, textShadowColor: 'rgba(255,107,53,0.5)',
    textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 8,
  },
  graffitiSub: { fontSize: 11, fontWeight: '700', color: C.yellow, letterSpacing: 3, marginTop: -2 },

  tuteurRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  tuteurAvatar: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },
  tuteurAvatarImg: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  tuteurNom: { fontSize: 14, fontWeight: '700', color: C.white },
  tuteurDesc: { fontSize: 11, color: C.grey, marginTop: 1 },
  tuteurBubble: {
    backgroundColor: 'rgba(255,107,53,0.12)', borderRadius: 10, borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.3)', padding: 8, marginBottom: 8,
  },
  tuteurPhrase: { fontSize: 12, color: C.orange, fontStyle: 'italic', lineHeight: 17 },

  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 13, color: C.white, fontWeight: '600' },
  progressPercent: { fontSize: 13, color: C.yellow, fontWeight: '700' },
  progressBar: { height: 6, backgroundColor: '#2A2A2A', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },

  // Onglets
  tabs: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: C.orange },
  tabText: { fontSize: 13, color: C.grey, fontWeight: '600' },
  tabTextActive: { color: C.orange },

  // Liste de mots
  wordList: { padding: 12 },
  listHeader: {
    backgroundColor: '#1E1E1E', borderRadius: 10, padding: 12,
    marginBottom: 12, borderLeftWidth: 3, borderLeftColor: C.purple,
  },
  listHeaderText: { fontSize: 13, color: C.grey, lineHeight: 18 },

  wordCard: {
    backgroundColor: C.card, borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: C.cardBorder, overflow: 'hidden',
  },
  wordCardKnown: { borderColor: 'rgba(57,211,83,0.4)' },
  wordCardTop: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  wordEmoji: { fontSize: 28, width: 40, textAlign: 'center' },
  wordMot: { fontSize: 17, fontWeight: '700', color: C.white },
  wordPrononciation: { fontSize: 12, color: C.grey, marginTop: 2 },
  wordTagContainer: {
    backgroundColor: '#2A2A2A', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  wordTag: { fontSize: 11, color: C.purple, fontWeight: '600' },

  wordExpanded: {
    padding: 14, paddingTop: 0, borderTopWidth: 1, borderTopColor: '#2A2A2A',
    marginTop: 4,
  },
  wordSens: { fontSize: 15, color: C.white, fontWeight: '600', marginBottom: 8 },
  wordExempleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 12 },
  wordExemple: { flex: 1, fontSize: 13, color: C.grey, fontStyle: 'italic', lineHeight: 18 },
  wordActions: { flexDirection: 'row', gap: 10 },
  wordSpeakBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#2A2A2A', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7,
  },
  wordSpeakText: { fontSize: 12, color: C.orange, fontWeight: '600' },
  wordKnownBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#2A2A2A', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(57,211,83,0.4)',
  },
  wordKnownBtnActive: { backgroundColor: C.green, borderColor: C.green },
  wordKnownText: { fontSize: 12, color: C.green, fontWeight: '600' },

  // Quiz
  quizStart: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  quizStartEmoji: { fontSize: 64, marginBottom: 12 },
  quizStartTitle: { fontSize: 26, fontWeight: '900', color: C.white, marginBottom: 8 },
  quizStartDesc: { fontSize: 15, color: C.grey, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  quizStartBtn: { borderRadius: 16, overflow: 'hidden', width: '80%' },
  quizStartBtnGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: 16 },
  quizStartBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  quizSubNote: { fontSize: 13, color: C.green, marginTop: 16 },

  quizContainer: { padding: 16 },
  quizScore: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16,
  },
  quizScoreText: { fontSize: 16, fontWeight: '700', color: C.green },
  quizCountText: { fontSize: 14, color: C.grey },
  quizWordCard: {
    borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: C.cardBorder,
  },
  quizWordEmoji: { fontSize: 52, marginBottom: 8 },
  quizWord: { fontSize: 30, fontWeight: '900', color: C.white, marginBottom: 4 },
  quizPrononciation: { fontSize: 14, color: C.grey, marginBottom: 12 },
  quizSpeakBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 },
  quizSpeakText: { fontSize: 13, color: C.orange, fontWeight: '600' },
  quizQuestion: { fontSize: 16, color: C.grey, marginBottom: 12, textAlign: 'center' },
  quizOption: {
    backgroundColor: '#1E1E1E', borderRadius: 12, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#2A2A2A',
  },
  quizOptionCorrect: { backgroundColor: C.green, borderColor: C.green },
  quizOptionWrong: { backgroundColor: '#C62828', borderColor: '#C62828' },
  quizOptionText: { fontSize: 15, color: C.white, textAlign: 'center' },
  quizFeedback: { fontSize: 16, fontWeight: '700', textAlign: 'center', marginTop: 8 },

  // Badges
  badgesTitle: { fontSize: 20, fontWeight: '800', color: C.white, marginBottom: 4 },
  badgesSubtitle: { fontSize: 14, color: C.grey, marginBottom: 16 },
  badgeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: C.cardBorder, marginBottom: 12,
  },
  badgeEmoji: { fontSize: 36, width: 44, textAlign: 'center' },
  badgeTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  badgeDesc: { fontSize: 13, color: C.grey },
  badgeProgress: {
    height: 4, backgroundColor: '#2A2A2A', borderRadius: 2, marginTop: 8, overflow: 'hidden',
  },
  badgeProgressFill: { height: '100%', borderRadius: 2 },
  emptyText: { fontSize: 14, color: C.grey, textAlign: 'center', marginTop: 12 },
  knownGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  knownChip: {
    backgroundColor: 'rgba(57,211,83,0.15)', borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(57,211,83,0.4)', paddingHorizontal: 12, paddingVertical: 6,
  },
  knownChipText: { fontSize: 13, color: C.green, fontWeight: '600' },

  // Modal tuteur
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: '#1A1A1A', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 40,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: C.white, marginBottom: 16, textAlign: 'center' },
  tuteurOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#2A2A2A', borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#333',
  },
  tuteurOptionEmoji: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center',
  },
  tuteurOptionAvatarImg: { width: 52, height: 52, borderRadius: 26 },
  tuteurOptionNom: { fontSize: 16, fontWeight: '700', color: C.white, marginBottom: 2 },
  tuteurOptionDesc: { fontSize: 12, color: C.grey },
  modalClose: {
    marginTop: 8, paddingVertical: 14, alignItems: 'center',
    backgroundColor: '#2A2A2A', borderRadius: 12,
  },
  modalCloseText: { fontSize: 15, color: C.grey, fontWeight: '600' },
});
