/**
 * MarcheScreen — Négociation au Marché
 * Mini-jeu de négociation : faire baisser le prix en utilisant
 * les bonnes formules de politesse dans la langue choisie.
 * Récompense : +15 XP + badge "Fils du Marché" selon perf.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Dimensions, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { useFocusEffect } from '@react-navigation/native';
import { progressAPI } from '../services/api';

const { width: W } = Dimensions.get('window');

const C = {
  bg:       '#FFF8F0',
  primary:  '#0B3D2E',
  accent:   '#F47920',
  yellow:   '#FFD600',
  green:    '#2E7D32',
  red:      '#C62828',
  card:     '#fff',
  border:   '#E0D5C8',
  text:     '#1A1A1A',
  grey:     '#888',
  sand:     '#F5E6D0',
};

// ── Produits du marché ────────────────────────────────────────────────────────
const PRODUITS = [
  { id: 'pagne',   emoji: '🧣', nom: 'Pagne',    prixDepart: 8000, prixCible: 3500 },
  { id: 'mangues', emoji: '🥭', nom: 'Mangues',  prixDepart: 2000, prixCible:  800 },
  { id: 'poterie', emoji: '🏺', nom: 'Poterie',  prixDepart: 5000, prixCible: 2000 },
];

// ── Langues & formules de politesse ──────────────────────────────────────────
const LANGUES = [
  {
    code: 'dioula', nom: 'Dioula', flag: '🌿',
    vendeur: 'Amara',
    vendeurDesc: 'Commerçant de Bouaké',
    salutation: 'I ni ce !',
    repliques: [
      {
        vendeurDit: 'Mɔgɔ diya ! Jɔli bɛ se ? (Bonjour ! Combien tu offres ?)',
        motJuste: { mot: 'I ni ce', sens: 'Bonjour (poli)', effet: -600 },
        leurres: ['Nɔɔ !', 'Sigi aw ye', 'Tɛmɛ'],
        conseil: 'Toujours saluer d\'abord — c\'est la règle d\'or du marché.',
      },
      {
        vendeurDit: 'A ka cher kojugu… (C\'est vraiment cher…)',
        motJuste: { mot: 'A ka nɔgɔn', sens: 'C\'est raisonnable', effet: -400 },
        leurres: ['Nɔɔ', 'Ka tɔgɔ', 'Bɛɛ'],
        conseil: '"A ka nɔgɔn" — dire que le prix est raisonnable flatte le vendeur.',
      },
      {
        vendeurDit: 'Ni wari tɛ, tɛ se ka sɔrɔ. (Sans argent, pas de marchandise.)',
        motJuste: { mot: 'Hali dɔ', sens: 'Un peu au moins (s\'il vous plaît)', effet: -500 },
        leurres: ['Ɔɔni', 'Bɛɛ ye', 'Kɔrɔ'],
        conseil: '"Hali dɔ" exprime une demande humble et touchante.',
      },
      {
        vendeurDit: 'Ah, i ye dɔ fɔ... (Tu dis quelque chose…)',
        motJuste: { mot: 'I ni baara', sens: 'Merci pour ton travail', effet: -700 },
        leurres: ['Tɔgɔ', 'Mɔgɔ', 'Kɔnɔ'],
        conseil: 'Remercier le travail du vendeur crée un lien de confiance.',
      },
      {
        vendeurDit: 'Yala i bɛ se ka dɔ fara? (Peux-tu ajouter un peu ?)',
        motJuste: { mot: 'Diya yɛlɛma', sens: 'Fais un effort / baisse un peu', effet: -600 },
        leurres: ['Ɔɔni cɛ', 'Kɛ kɛ', 'Fɔ fɔ'],
        conseil: '"Diya yɛlɛma" est la formule magique pour négocier poliment.',
      },
      {
        vendeurDit: 'Kɔni k\'a ta! (Allez, prends-le !)',
        motJuste: { mot: 'Aw ni ce kosɛbɛ', sens: 'Merci beaucoup à vous', effet: -400 },
        leurres: ['Yɔrɔ', 'Bɛɛ bɛ', 'Fa tɛ'],
        conseil: 'Conclure avec chaleur garantit de bonnes affaires futures !',
      },
    ],
  },
  {
    code: 'baoule', nom: 'Baoulé', flag: '🌺',
    vendeur: 'Koffi',
    vendeurDesc: 'Tisseur de Bouaflé',
    salutation: 'Mɔ ficɛ !',
    repliques: [
      {
        vendeurDit: 'Akwaba ! Sɛ wla? (Bienvenue ! Que cherches-tu ?)',
        motJuste: { mot: 'Mɔ ficɛ', sens: 'Bonjour (poli)', effet: -600 },
        leurres: ['Bla bla', 'Mian', 'Sɔnlɛ'],
        conseil: 'Saluer en Baoulé ouvre toutes les portes au marché.',
      },
      {
        vendeurDit: 'Nzuɛ ka... (Le prix est…)',
        motJuste: { mot: 'A ka fɛ', sens: 'C\'est beau / de qualité', effet: -500 },
        leurres: ['Lɔnlɔn', 'Kɔkɔ', 'Yɛ mian'],
        conseil: 'Complimenter l\'article montre que tu es sérieux.',
      },
      {
        vendeurDit: 'Mian, nzuɛ kpli! (Non, le prix est fixe !)',
        motJuste: { mot: 'Ɔh ba', sens: 'Oh père (terme de respect)', effet: -600 },
        leurres: ['Bla wɛ', 'Yɛ kɔ', 'Nan nɛ'],
        conseil: 'Appeler quelqu\'un "ba" (père/mère) est un signe de profond respect.',
      },
      {
        vendeurDit: 'Yɛ ndɛ kpli ɔ? (Tu veux vraiment ça ?)',
        motJuste: { mot: 'N wla ɔ', sens: 'Je le veux vraiment', effet: -400 },
        leurres: ['Lɔ bla', 'Kpa kpa', 'Yɛ mɔ'],
        conseil: 'Montrer son désir sincère aide à conclure la vente.',
      },
      {
        vendeurDit: 'Fa nzuɛ siɛn... (Le prix baisse un peu…)',
        motJuste: { mot: 'Yɛ sran wa', sens: 'Tu es une bonne personne', effet: -700 },
        leurres: ['Bla wla', 'Kɔ lɔ', 'Nan sɔ'],
        conseil: 'Un compliment sincère peut valoir plus qu\'une longue négociation.',
      },
      {
        vendeurDit: 'Yɛ ta ɔ! (Prends-le !)',
        motJuste: { mot: 'Aw ni yalɛ', sens: 'Merci beaucoup', effet: -300 },
        leurres: ['Mian mian', 'Bla kɔ', 'Lɔ wɛ'],
        conseil: 'Toujours remercier : tu reviendras et seras bien accueilli.',
      },
    ],
  },
  {
    code: 'bete', nom: 'Bété', flag: '🌿',
    vendeur: 'Yoro',
    vendeurDesc: 'Conteur de Gagnoa',
    salutation: 'Gbou gbou !',
    repliques: [
      {
        vendeurDit: 'Eeh! Gbou gbou! Hein tu veux quoi? (Bienvenue !)',
        motJuste: { mot: 'Gbou gbou', sens: 'Bonjour / salut respectueux', effet: -600 },
        leurres: ['Boh boh', 'Hé hé', 'Yao yao'],
        conseil: 'Répéter "gbou gbou" montre que tu connais les usages locaux.',
      },
      {
        vendeurDit: 'Prix là, c\'est vrai prix... (Le prix est juste…)',
        motJuste: { mot: 'Nyɔ', sens: 'C\'est bien / parfait', effet: -500 },
        leurres: ['Boh', 'Ko ko', 'Hé wè'],
        conseil: '"Nyɔ" approuve la qualité du produit sans s\'engager sur le prix.',
      },
      {
        vendeurDit: 'Ah vraiment? Tu veux marchander? (Tu veux négocier ?)',
        motJuste: { mot: 'Wɔ tɔ', sens: 'Fais un geste / aide-moi', effet: -600 },
        leurres: ['Bla bla', 'Zo zo', 'Pa pa'],
        conseil: '"Wɔ tɔ" est une demande polie d\'aide ou de geste commercial.',
      },
      {
        vendeurDit: 'Bon... peut-être je peux faire quelque chose...',
        motJuste: { mot: 'Nya nya', sens: 'Mère mère (respect féminin)', effet: -500 },
        leurres: ['Ko wè', 'Boh yao', 'Tch tch'],
        conseil: 'S\'adresser à une vendeuse avec "nya" est une marque de respect.',
      },
      {
        vendeurDit: 'Tu fais trop de problème hein! (Tu compliques !)',
        motJuste: { mot: 'Kpli kpli', sens: 'Doucement doucement / soyons raisonnables', effet: -700 },
        leurres: ['Boh boh', 'Yo yo', 'Nè nè'],
        conseil: '"Kpli kpli" apaise la tension et invite au calme.',
      },
      {
        vendeurDit: 'Bon ok, prix là, prends! (Accord !)',
        motJuste: { mot: 'Asè', sens: 'Merci / accord (poli)', effet: -300 },
        leurres: ['Boh wè', 'Ko ko', 'Hé hé'],
        conseil: 'Conclure avec "Asè" valide l\'accord avec dignité.',
      },
    ],
  },
  {
    code: 'senoufo', nom: 'Sénoufo', flag: '🦅',
    vendeur: 'Dolourou',
    vendeurDesc: 'Sculpteur de Korhogo',
    salutation: 'Karamɔgɔ !',
    repliques: [
      {
        vendeurDit: 'Nɛ ! Fo kɔ? (Hé ! Ça va, père ?)',
        motJuste: { mot: 'Karamɔgɔ', sens: 'Maître / sage (terme de respect)', effet: -700 },
        leurres: ['Fo fo', 'Na tyen', 'Kolo bê'],
        conseil: 'Appeler quelqu\'un "Karamɔgɔ" est le plus grand des respects au Nord.',
      },
      {
        vendeurDit: 'Kɔlɔ ka ɲi... (La pièce est belle…)',
        motJuste: { mot: 'A ka ɲi kosɛbɛ', sens: 'C\'est vraiment très beau', effet: -500 },
        leurres: ['Na fo', 'Tyen woni', 'Bê lê'],
        conseil: 'Les Sénoufo sont fiers de leur artisanat — le complimenter ouvre le cœur.',
      },
      {
        vendeurDit: 'Nii, tɔgɔ tɛ kɛ... (Non, le nom ne change pas…)',
        motJuste: { mot: 'Fo kɔrɔ', sens: 'Mon père aîné (appellatif respectueux)', effet: -600 },
        leurres: ['Na kolo', 'Woni fo', 'Bê nê'],
        conseil: '"Fo kɔrɔ" reconnaît l\'ancienneté et la sagesse du vendeur.',
      },
      {
        vendeurDit: 'I bɛ se ka kɛ dɔ? (Peux-tu faire quelque chose ?)',
        motJuste: { mot: 'Hɛrɛ', sens: 'La paix / sérénité (vœu de bien)', effet: -500 },
        leurres: ['Kolo tyen', 'Na bê', 'Fo woni'],
        conseil: 'Souhaiter la paix ("Hɛrɛ") crée une atmosphère de confiance mutuelle.',
      },
      {
        vendeurDit: 'Wari kelen... jɔli bɛ sɔrɔ? (Le prix est unique… combien ?)',
        motJuste: { mot: 'Dɔ dɔ kɛ', sens: 'Fais juste un petit geste', effet: -600 },
        leurres: ['Tyen bê', 'Na fo kolo', 'Woni lê'],
        conseil: '"Dɔ dɔ kɛ" — petite demande, grand effet sur un vendeur bienveillant.',
      },
      {
        vendeurDit: 'Ayiwa! Sɔrɔ! (D\'accord ! Prends-le !)',
        motJuste: { mot: 'Aw ni ce', sens: 'Merci à vous tous', effet: -300 },
        leurres: ['Fo kɔ', 'Na tyen', 'Bê woni'],
        conseil: 'Remercier en pluriel inclut toute la famille du vendeur — geste magnifique.',
      },
    ],
  },
];

const STORAGE_BADGE_MARCHE = 'badge_fils_du_marche';
const XP_REWARD = 15;

export default function MarcheScreen({ navigation }) {
  const [phase, setPhase]           = useState('intro');    // intro | jeu | result
  const [langIdx, setLangIdx]       = useState(0);
  const [produitIdx, setProduitIdx] = useState(0);
  const [round, setRound]           = useState(0);
  const [prix, setPrix]             = useState(0);
  const [prixAnim, setPrixAnim]     = useState(0);
  const [score, setScore]           = useState(0);         // bonnes réponses
  const [feedback, setFeedback]     = useState(null);      // null | 'correct' | 'wrong'
  const [selectedOption, setSelectedOption] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [badgeAlreadyOwned, setBadgeAlreadyOwned] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);

  // Animations
  const priceAnim   = useRef(new Animated.Value(1)).current;
  const barWidth    = useRef(new Animated.Value(1)).current;   // 0..1
  const shakeAnim   = useRef(new Animated.Value(0)).current;
  const vendeurAnim = useRef(new Animated.Value(0)).current;

  const lang    = LANGUES[langIdx];
  const produit = PRODUITS[produitIdx];
  const replique = lang.repliques[round] || lang.repliques[lang.repliques.length - 1];

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_BADGE_MARCHE).then(v => {
      if (v === 'true') setBadgeAlreadyOwned(true);
    });
  }, []);

  useFocusEffect(useCallback(() => {
    return () => Speech.stop();
  }, []));

  // Préparer les options mélangées au changement de round
  useEffect(() => {
    if (phase === 'jeu' && replique) {
      const opts = shuffle([
        { mot: replique.motJuste.mot, isCorrect: true },
        ...replique.leurres.map(l => ({ mot: l, isCorrect: false })),
      ]);
      setShuffledOptions(opts);
      setFeedback(null);
      setSelectedOption(null);
      // Animation entrée vendeur
      vendeurAnim.setValue(0);
      Animated.spring(vendeurAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
    }
  }, [round, phase]);

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  const startGame = () => {
    const p = produit.prixDepart;
    setPrix(p);
    setPrixAnim(p);
    setRound(0);
    setScore(0);
    setFeedback(null);
    setPhase('jeu');
    barWidth.setValue(1);
  };

  const animatePrice = (newPrice) => {
    // Pulse animation sur le prix
    Animated.sequence([
      Animated.timing(priceAnim, { toValue: 1.3, duration: 200, useNativeDriver: true }),
      Animated.timing(priceAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    // Barre de progression
    const ratio = Math.max(0, (newPrice - produit.prixCible) / (produit.prixDepart - produit.prixCible));
    Animated.timing(barWidth, { toValue: ratio, duration: 600, useNativeDriver: false }).start();
  };

  const shakeVendeur = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleOption = (opt) => {
    if (feedback) return;
    setSelectedOption(opt.mot);

    if (opt.isCorrect) {
      const effet    = replique.motJuste.effet;
      const newPrix  = Math.max(produit.prixCible, prix + effet);
      setPrix(newPrix);
      setPrixAnim(newPrix);
      animatePrice(newPrix);
      setScore(s => s + 1);
      setFeedback('correct');
      Speech.speak(replique.motJuste.mot, { language: 'fr-FR', rate: 0.75 });

      // Avancer ou terminer
      setTimeout(() => {
        const nextRound = round + 1;
        if (nextRound >= lang.repliques.length || newPrix <= produit.prixCible) {
          endGame(newPrix, score + 1);
        } else {
          setRound(nextRound);
        }
      }, 1400);
    } else {
      // Mauvaise réponse — prix remonte un peu
      const penalty  = Math.round((produit.prixDepart - produit.prixCible) * 0.05);
      const newPrix  = Math.min(produit.prixDepart, prix + penalty);
      setPrix(newPrix);
      setPrixAnim(newPrix);
      animatePrice(newPrix);
      shakeVendeur();
      setFeedback('wrong');
      setTimeout(() => {
        const nextRound = round + 1;
        if (nextRound >= lang.repliques.length) {
          endGame(newPrix, score);
        } else {
          setRound(nextRound);
        }
      }, 1600);
    }
  };

  const endGame = async (finalPrix, finalScore) => {
    setPhase('result');
    // XP
    try { await progressAPI.addXp({ xp: XP_REWARD, source: 'marche_negociation' }); } catch (_) {}
    // Badge si bon score
    if (finalScore >= 4 && !badgeAlreadyOwned) {
      await AsyncStorage.setItem(STORAGE_BADGE_MARCHE, 'true');
      setBadgeEarned(true);
      setBadgeAlreadyOwned(true);
    }
  };

  const progPercent = Math.max(0, Math.min(100,
    Math.round(100 - (prix - produit.prixCible) / (produit.prixDepart - produit.prixCible) * 100)
  ));

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={['#D84315', '#F47920', '#FFD600']} style={styles.introHeader}>
          <Text style={styles.introEmoji}>🛒</Text>
          <Text style={styles.introTitle}>Au Marché !</Text>
          <Text style={styles.introSubtitle}>Négocie le meilleur prix</Text>
        </LinearGradient>

        <View style={styles.introBody}>
          <View style={styles.introBubble}>
            <Text style={styles.introBubbleText}>
              Utilise les bonnes formules de politesse pour faire baisser le prix.
              Chaque mot juste = réduction. Mauvaise réponse = le vendeur se braque ! 🤝
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Choisir le produit</Text>
          <View style={styles.produitRow}>
            {PRODUITS.map((p, i) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.produitCard, produitIdx === i && styles.produitCardActive]}
                onPress={() => setProduitIdx(i)}
              >
                <Text style={styles.produitEmoji}>{p.emoji}</Text>
                <Text style={styles.produitNom}>{p.nom}</Text>
                <Text style={styles.produitPrix}>{p.prixDepart.toLocaleString()} FCFA</Text>
                <Text style={styles.produitCible}>→ {p.prixCible.toLocaleString()} FCFA</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Choisir la langue</Text>
          {LANGUES.map((l, idx) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.langOption, langIdx === idx && styles.langOptionActive]}
              onPress={() => setLangIdx(idx)}
            >
              <Text style={styles.langFlag}>{l.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.langNom, langIdx === idx && { color: C.primary }]}>{l.nom}</Text>
                <Text style={styles.langVendeur}>{l.vendeur} — {l.vendeurDesc}</Text>
              </View>
              {langIdx === idx && <Ionicons name="checkmark-circle" size={22} color={C.primary} />}
            </TouchableOpacity>
          ))}

          <View style={styles.rewardRow}>
            <View style={styles.chip}><Text style={styles.chipText}>⭐ +{XP_REWARD} XP</Text></View>
            {!badgeAlreadyOwned
              ? <View style={styles.chip}><Text style={styles.chipText}>🏅 Badge "Fils du Marché"</Text></View>
              : <View style={[styles.chip, { backgroundColor: '#E8F5E9' }]}><Text style={[styles.chipText, { color: C.green }]}>✅ Badge déjà obtenu</Text></View>
            }
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={startGame}>
            <LinearGradient colors={['#D84315', '#F47920']} style={styles.startBtnGrad}>
              <Text style={styles.startBtnText}>Ouvrir le Marché 🛒</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── Résultat ──────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const success = prix <= produit.prixCible + (produit.prixDepart - produit.prixCible) * 0.25;
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
        <LinearGradient
          colors={success ? ['#2E7D32', '#4CAF50'] : ['#D84315', '#F47920']}
          style={styles.resultHeader}
        >
          <Text style={{ fontSize: 64 }}>{success ? '🏆' : '😅'}</Text>
          <Text style={styles.resultTitle}>{success ? 'Affaire conclue !' : 'Presque...'}</Text>
          <Text style={styles.resultSub}>
            {success
              ? `Tu as obtenu le ${produit.nom} à ${prix.toLocaleString()} FCFA !`
              : `Prix final : ${prix.toLocaleString()} FCFA. Réessaie !`}
          </Text>
        </LinearGradient>

        <View style={{ padding: 20, width: '100%', alignItems: 'center' }}>
          {/* Score */}
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Bonnes formules</Text>
            <Text style={styles.scoreValue}>{score} / {lang.repliques.length}</Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${(score / lang.repliques.length) * 100}%` }]} />
            </View>
          </View>

          {/* Badge */}
          {badgeEarned && (
            <View style={styles.badgeBox}>
              <Text style={{ fontSize: 44 }}>🏅</Text>
              <Text style={styles.badgeTitle}>Badge débloqué !</Text>
              <Text style={styles.badgeName}>"Fils du Marché"</Text>
            </View>
          )}

          {/* XP */}
          <View style={styles.xpBox}>
            <Text style={styles.xpText}>+{XP_REWARD} XP gagnés 🌟</Text>
          </View>

          {/* Mots appris */}
          <Text style={[styles.sectionLabel, { alignSelf: 'flex-start', marginTop: 8 }]}>
            📖 Formules de politesse — {lang.nom}
          </Text>
          {lang.repliques.map((r, i) => (
            <View key={i} style={styles.recapRow}>
              <Text style={styles.recapMot}>{r.motJuste.mot}</Text>
              <Text style={styles.recapSens}>{r.motJuste.sens}</Text>
              <Text style={styles.recapEffet}>{r.motJuste.effet} FCFA</Text>
            </View>
          ))}

          <View style={styles.resultBtns}>
            <TouchableOpacity style={styles.retryBtn} onPress={startGame}>
              <Ionicons name="refresh" size={18} color={C.primary} />
              <Text style={styles.retryBtnText}>Rejouer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeBtn} onPress={() => setPhase('intro')}>
              <Ionicons name="home" size={18} color="#fff" />
              <Text style={styles.homeBtnText}>Accueil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ── Jeu ───────────────────────────────────────────────────────────────────
  const barRatio = Math.max(0, (prix - produit.prixCible) / (produit.prixDepart - produit.prixCible));

  return (
    <View style={styles.container}>
      {/* Barre de marché en haut */}
      <LinearGradient colors={['#D84315', '#F47920']} style={styles.gameHeader}>
        <View style={styles.gameHeaderTop}>
          <Text style={styles.gameHeaderLang}>{lang.flag} {lang.nom}</Text>
          <Text style={styles.gameRound}>Étape {round + 1}/{lang.repliques.length}</Text>
        </View>

        {/* Produit + prix animé */}
        <View style={styles.prixRow}>
          <Text style={styles.produitEmojiGame}>{produit.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.produitNomGame}>{produit.nom}</Text>
            <Text style={styles.prixCibleLabel}>Objectif : {produit.prixCible.toLocaleString()} FCFA</Text>
          </View>
          <Animated.Text style={[styles.prixActuel, { transform: [{ scale: priceAnim }] }]}>
            {prix.toLocaleString()}
            <Text style={styles.prixFcfa}> FCFA</Text>
          </Animated.Text>
        </View>

        {/* Barre de progression de négociation */}
        <View style={styles.negocBar}>
          <Text style={styles.negocBarLabel}>Négociation</Text>
          <View style={styles.negocBarTrack}>
            <Animated.View style={[
              styles.negocBarFill,
              { width: barWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
            ]} />
          </View>
          <Text style={styles.negocBarPct}>{progPercent}%</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
        {/* Vendeur + bulle de dialogue */}
        <Animated.View style={[styles.vendeurSection, {
          opacity: vendeurAnim,
          transform: [{ translateY: vendeurAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }, { translateX: shakeAnim }],
        }]}>
          <View style={styles.vendeurAvatar}>
            <Text style={styles.vendeurEmoji}>🧑‍🤝‍🧑</Text>
            <Text style={styles.vendeurNom}>{lang.vendeur}</Text>
          </View>
          <View style={styles.vendeurBulle}>
            <Text style={styles.vendeurTexte}>{replique.vendeurDit}</Text>
          </View>
        </Animated.View>

        {/* Feedback */}
        {feedback && (
          <View style={[styles.feedbackBanner, { backgroundColor: feedback === 'correct' ? '#E8F5E9' : '#FFEBEE' }]}>
            <Text style={[styles.feedbackText, { color: feedback === 'correct' ? C.green : C.red }]}>
              {feedback === 'correct'
                ? `✅ Parfait ! "${replique.motJuste.mot}" — ${replique.motJuste.sens}`
                : `❌ Pas tout à fait... Le prix remonte un peu !`}
            </Text>
            {feedback === 'correct' && (
              <Text style={styles.conseilText}>💡 {replique.conseil}</Text>
            )}
          </View>
        )}

        {/* Choix de mots */}
        <Text style={styles.choixLabel}>💬 Quelle formule utiliser ?</Text>
        {shuffledOptions.map((opt, i) => {
          let bg = styles.optionCard;
          if (feedback && opt.mot === replique.motJuste.mot) bg = styles.optionCorrect;
          else if (feedback === 'wrong' && opt.mot === selectedOption) bg = styles.optionWrong;
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.optionCard,
                feedback && opt.mot === replique.motJuste.mot && styles.optionCorrect,
                feedback === 'wrong' && opt.mot === selectedOption && styles.optionWrong,
              ]}
              onPress={() => handleOption(opt)}
              disabled={!!feedback}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.optionText,
                feedback && opt.mot === replique.motJuste.mot && { color: '#fff', fontWeight: '800' },
                feedback === 'wrong' && opt.mot === selectedOption && { color: '#fff' },
              ]}>
                {opt.mot}
              </Text>
              {feedback && opt.isCorrect && (
                <View style={styles.optionBadge}>
                  <Text style={styles.optionBadgeText}>{replique.motJuste.effet} FCFA</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Hint */}
        {!feedback && (
          <View style={styles.hintRow}>
            <Ionicons name="bulb-outline" size={16} color={C.accent} />
            <Text style={styles.hintText}>
              Salutation en {lang.nom} : "{lang.salutation}"
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // Intro
  introHeader: {
    paddingTop: 56, paddingBottom: 28, alignItems: 'center',
  },
  introEmoji: { fontSize: 60, marginBottom: 8 },
  introTitle: { fontSize: 30, fontWeight: '900', color: '#fff' },
  introSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  introBody: { padding: 20 },
  introBubble: {
    backgroundColor: '#FFF3E0', borderRadius: 14, padding: 14,
    borderLeftWidth: 4, borderLeftColor: C.accent, marginBottom: 20,
  },
  introBubbleText: { fontSize: 14, color: C.text, lineHeight: 21 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: C.primary, marginBottom: 10 },

  produitRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  produitCard: {
    flex: 1, backgroundColor: C.card, borderRadius: 14, padding: 12,
    alignItems: 'center', borderWidth: 1.5, borderColor: C.border,
  },
  produitCardActive: { borderColor: C.accent, backgroundColor: '#FFF8F0' },
  produitEmoji: { fontSize: 30, marginBottom: 4 },
  produitNom: { fontSize: 12, fontWeight: '700', color: C.text, textAlign: 'center' },
  produitPrix: { fontSize: 11, color: C.red, fontWeight: '600', marginTop: 4, textDecorationLine: 'line-through' },
  produitCible: { fontSize: 11, color: C.green, fontWeight: '700' },

  langOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.card, borderRadius: 12, padding: 14,
    borderWidth: 1.5, borderColor: C.border, marginBottom: 10,
  },
  langOptionActive: { borderColor: C.primary, backgroundColor: '#E8F5E9' },
  langFlag: { fontSize: 22 },
  langNom: { fontSize: 15, fontWeight: '700', color: '#333' },
  langVendeur: { fontSize: 12, color: C.grey, marginTop: 1 },

  rewardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 16 },
  chip: {
    backgroundColor: '#FFF8E1', borderRadius: 20, borderWidth: 1,
    borderColor: C.yellow, paddingHorizontal: 12, paddingVertical: 6,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: '#795548' },
  startBtn: { borderRadius: 16, overflow: 'hidden' },
  startBtnGrad: { paddingVertical: 16, alignItems: 'center' },
  startBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },

  // Game header
  gameHeader: { paddingTop: 52, paddingHorizontal: 16, paddingBottom: 14 },
  gameHeaderTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  gameHeaderLang: { fontSize: 14, fontWeight: '700', color: '#fff' },
  gameRound: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  prixRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  produitEmojiGame: { fontSize: 36 },
  produitNomGame: { fontSize: 16, fontWeight: '700', color: '#fff' },
  prixCibleLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  prixActuel: { fontSize: 26, fontWeight: '900', color: '#fff' },
  prixFcfa: { fontSize: 14, fontWeight: '400' },
  negocBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  negocBarLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', width: 66 },
  negocBarTrack: {
    flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4, overflow: 'hidden',
  },
  negocBarFill: { height: '100%', backgroundColor: C.yellow, borderRadius: 4 },
  negocBarPct: { fontSize: 12, fontWeight: '700', color: '#fff', width: 36, textAlign: 'right' },

  // Game content
  gameContent: { padding: 16, paddingBottom: 40 },
  vendeurSection: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 16 },
  vendeurAvatar: { alignItems: 'center' },
  vendeurEmoji: { fontSize: 36, backgroundColor: C.sand, borderRadius: 24, padding: 4, overflow: 'hidden' },
  vendeurNom: { fontSize: 11, color: C.grey, marginTop: 4, fontWeight: '600' },
  vendeurBulle: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, borderTopLeftRadius: 4,
    padding: 12, borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  vendeurTexte: { fontSize: 14, color: C.text, lineHeight: 20, fontStyle: 'italic' },

  feedbackBanner: {
    borderRadius: 12, padding: 12, marginBottom: 14,
    borderLeftWidth: 4, borderLeftColor: C.green,
  },
  feedbackText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  conseilText: { fontSize: 12, color: C.grey, marginTop: 6, lineHeight: 17 },

  choixLabel: { fontSize: 14, fontWeight: '700', color: C.primary, marginBottom: 10 },
  optionCard: {
    backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1.5, borderColor: C.border, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  optionCorrect: { backgroundColor: C.green, borderColor: C.green },
  optionWrong:   { backgroundColor: C.red,   borderColor: C.red },
  optionText: { fontSize: 16, fontWeight: '600', color: C.text, flex: 1 },
  optionBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  optionBadgeText: { fontSize: 12, color: '#fff', fontWeight: '700' },

  hintRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF8E1', borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: '#FFE082', marginTop: 4,
  },
  hintText: { fontSize: 13, color: '#795548', flex: 1 },

  // Result
  resultHeader: {
    paddingTop: 60, paddingBottom: 32, alignItems: 'center',
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  resultTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: 8 },
  resultSub: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 6, textAlign: 'center', paddingHorizontal: 20 },
  scoreBox: {
    width: '100%', backgroundColor: C.card, borderRadius: 16,
    padding: 16, marginBottom: 16, borderWidth: 1, borderColor: C.border,
    alignItems: 'center',
  },
  scoreLabel: { fontSize: 13, color: C.grey, fontWeight: '600' },
  scoreValue: { fontSize: 32, fontWeight: '900', color: C.primary, marginVertical: 6 },
  scoreBarBg: { width: '100%', height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' },
  scoreBarFill: { height: '100%', backgroundColor: C.accent, borderRadius: 4 },
  badgeBox: {
    width: '100%', alignItems: 'center', backgroundColor: '#FFF8E1',
    borderRadius: 16, padding: 20, marginBottom: 14,
    borderWidth: 2, borderColor: C.yellow,
  },
  badgeTitle: { fontSize: 18, fontWeight: '800', color: '#795548', marginTop: 6 },
  badgeName: { fontSize: 15, color: C.accent, fontWeight: '600', marginTop: 2 },
  xpBox: {
    backgroundColor: '#E8F5E9', borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 10, marginBottom: 20,
  },
  xpText: { fontSize: 15, fontWeight: '700', color: C.green },
  recapRow: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    gap: 8, backgroundColor: C.card, borderRadius: 10,
    padding: 10, marginBottom: 6, borderWidth: 1, borderColor: C.border,
  },
  recapMot: { fontSize: 14, fontWeight: '700', color: C.primary, flex: 1 },
  recapSens: { fontSize: 12, color: C.grey, flex: 2 },
  recapEffet: { fontSize: 12, fontWeight: '700', color: C.green },
  resultBtns: { flexDirection: 'row', gap: 12, marginTop: 20, width: '100%' },
  retryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#E8F5E9', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: C.primary,
  },
  retryBtnText: { fontSize: 15, fontWeight: '700', color: C.primary },
  homeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: C.primary, borderRadius: 12, padding: 14,
  },
  homeBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
