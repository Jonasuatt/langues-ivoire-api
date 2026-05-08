/**
 * ArbresScreen — Arbre à Palabres
 * Exercice de vocabulaire familial : associer les mots de la langue
 * aux membres de la famille sur un arbre généalogique.
 * Récompense : +10 XP + badge "Fils/Fille du pays"
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Alert, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { progressAPI } from '../services/api';

const { width: W } = Dimensions.get('window');

const C = {
  bg:      '#FAFAF8',
  primary: '#0B3D2E',
  accent:  '#F47920',
  green:   '#2E7D32',
  red:     '#C62828',
  gold:    '#FFD600',
  card:    '#fff',
  grey:    '#888',
  light:   '#f5f5f5',
  border:  '#E0E0E0',
};

// ── Données : 8 membres × 4 langues ──────────────────────────────────────────
const FAMILLE = [
  { id: 'grand_pere', fr: 'Grand-père', emoji: '👴', tier: 0, col: 0 },
  { id: 'grand_mere', fr: 'Grand-mère', emoji: '👵', tier: 0, col: 1 },
  { id: 'pere',       fr: 'Père',       emoji: '👨', tier: 1, col: 0 },
  { id: 'mere',       fr: 'Mère',       emoji: '👩', tier: 1, col: 1 },
  { id: 'oncle',      fr: 'Oncle',      emoji: '🧔', tier: 1, col: 2 },
  { id: 'tante',      fr: 'Tante',      emoji: '👩‍🦱', tier: 1, col: 3 },
  { id: 'frere',      fr: 'Frère',      emoji: '👦', tier: 2, col: 0 },
  { id: 'soeur',      fr: 'Sœur',       emoji: '👧', tier: 2, col: 1 },
];

const LANGUES = [
  { code: 'dioula',  nom: 'Dioula',  flag: '🌿',
    mots: {
      grand_pere: { mot: 'Kɔkɔ',     prononc: '[kɔ-kɔ]' },
      grand_mere: { mot: 'Muso kɔrɔ', prononc: '[mu-so kɔ-rɔ]' },
      pere:       { mot: 'Fa',        prononc: '[fa]' },
      mere:       { mot: 'Ba',        prononc: '[ba]' },
      oncle:      { mot: 'Tonton',    prononc: '[ton-ton]' },
      tante:      { mot: 'Tata',      prononc: '[ta-ta]' },
      frere:      { mot: 'Dɔgɔkɛ',   prononc: '[dɔ-gɔ-kɛ]' },
      soeur:      { mot: 'Dɔgɔmuso', prononc: '[dɔ-gɔ-mu-so]' },
    },
  },
  { code: 'baoule', nom: 'Baoulé', flag: '🌺',
    mots: {
      grand_pere: { mot: 'Papa kɔkɔ', prononc: '[pa-pa kɔ-kɔ]' },
      grand_mere: { mot: 'Nina kɔkɔ', prononc: '[ni-na kɔ-kɔ]' },
      pere:       { mot: 'Ba',         prononc: '[ba]' },
      mere:       { mot: 'Nina',       prononc: '[ni-na]' },
      oncle:      { mot: 'Papa kpân',  prononc: '[pa-pa kpan]' },
      tante:      { mot: 'Nina kpân',  prononc: '[ni-na kpan]' },
      frere:      { mot: 'Wawa',       prononc: '[wa-wa]' },
      soeur:      { mot: 'Wawoua',     prononc: '[wa-wou-a]' },
    },
  },
  { code: 'bete', nom: 'Bété', flag: '🌿',
    mots: {
      grand_pere: { mot: 'Baba',    prononc: '[ba-ba]' },
      grand_mere: { mot: 'Nyanya',  prononc: '[nya-nya]' },
      pere:       { mot: 'Ba',      prononc: '[ba]' },
      mere:       { mot: 'Nya',     prononc: '[nya]' },
      oncle:      { mot: 'Tonton',  prononc: '[ton-ton]' },
      tante:      { mot: 'Tata',    prononc: '[ta-ta]' },
      frere:      { mot: 'Blo',     prononc: '[blo]' },
      soeur:      { mot: 'Blo blo', prononc: '[blo blo]' },
    },
  },
  { code: 'senoufo', nom: 'Sénoufo', flag: '🦅',
    mots: {
      grand_pere: { mot: 'Kolo bêlê',  prononc: '[ko-lo bê-lê]' },
      grand_mere: { mot: 'Nalo bêlê',  prononc: '[na-lo bê-lê]' },
      pere:       { mot: 'Fo',          prononc: '[fo]' },
      mere:       { mot: 'Na',          prononc: '[na]' },
      oncle:      { mot: 'Fo kolo',     prononc: '[fo ko-lo]' },
      tante:      { mot: 'Na kolo',     prononc: '[na ko-lo]' },
      frere:      { mot: 'Tyen',        prononc: '[tyen]' },
      soeur:      { mot: 'Woni',        prononc: '[wo-ni]' },
    },
  },
];

const STORAGE_BADGE = 'badge_fils_du_pays';
const XP_REWARD = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function ArbresScreen({ navigation }) {
  const [langIdx, setLangIdx]       = useState(0);
  const [phase, setPhase]           = useState('intro');    // intro | play | result
  const [slots, setSlots]           = useState({});         // { memberId: mot | null }
  const [bank, setBank]             = useState([]);         // mots restants dans la banque
  const [selected, setSelected]     = useState(null);       // mot sélectionné depuis la banque
  const [results, setResults]       = useState({});         // { memberId: 'correct'|'wrong' }
  const [score, setScore]           = useState(0);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [badgeAlreadyOwned, setBadgeAlreadyOwned] = useState(false);

  // Animations flash sur slot
  const flashAnims = useRef(
    Object.fromEntries(FAMILLE.map(m => [m.id, new Animated.Value(1)]))
  ).current;

  const lang = LANGUES[langIdx];

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_BADGE).then(v => {
      if (v === 'true') setBadgeAlreadyOwned(true);
    });
  }, []);

  const startGame = useCallback(() => {
    const emptySlots = Object.fromEntries(FAMILLE.map(m => [m.id, null]));
    const motsList = shuffle(FAMILLE.map(m => ({
      key: `${m.id}_${Math.random()}`,
      memberId: m.id,
      mot: lang.mots[m.id].mot,
      prononc: lang.mots[m.id].prononc,
    })));
    setSlots(emptySlots);
    setBank(motsList);
    setSelected(null);
    setResults({});
    setScore(0);
    setPhase('play');
  }, [lang]);

  const handleBankTap = (item) => {
    if (results[item.memberId]) return; // déjà validé
    setSelected(selected?.key === item.key ? null : item);
  };

  const handleSlotTap = (memberId) => {
    if (results[memberId] === 'correct') return; // slot déjà correct

    if (!selected) {
      // Si quelque chose est dans le slot, le remettre en banque
      if (slots[memberId]) {
        const toReturn = bank.find(b => b.mot === slots[memberId]) ||
          { key: `${memberId}_ret_${Date.now()}`, memberId, mot: slots[memberId], prononc: lang.mots[memberId]?.prononc || '' };
        setSlots(s => ({ ...s, [memberId]: null }));
        setBank(b => [...b, toReturn]);
      }
      return;
    }

    // Placer le mot sélectionné dans le slot
    const prevSlotContent = slots[memberId];
    const newSlots = { ...slots, [memberId]: selected.mot };
    const newBank = bank.filter(b => b.key !== selected.key);

    // Si le slot avait déjà un mot, le remettre en banque
    if (prevSlotContent && prevSlotContent !== selected.mot) {
      newBank.push({
        key: `${memberId}_ret_${Date.now()}`,
        memberId,
        mot: prevSlotContent,
        prononc: lang.mots[memberId]?.prononc || '',
      });
    }

    setSlots(newSlots);
    setBank(newBank);
    setSelected(null);

    // Vérification automatique du slot
    const isCorrect = selected.memberId === memberId;
    const newResults = { ...results, [memberId]: isCorrect ? 'correct' : 'wrong' };
    setResults(newResults);

    // Flash animation
    Animated.sequence([
      Animated.timing(flashAnims[memberId], { toValue: isCorrect ? 1.08 : 0.92, duration: 120, useNativeDriver: true }),
      Animated.timing(flashAnims[memberId], { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    if (!isCorrect) {
      // Remettre le mot en banque après animation
      setTimeout(() => {
        setSlots(s => ({ ...s, [memberId]: null }));
        setBank(b => [...b, {
          key: `${memberId}_back_${Date.now()}`,
          memberId,
          mot: selected.mot,
          prononc: selected.prononc,
        }]);
        setResults(r => {
          const nr = { ...r };
          delete nr[memberId];
          return nr;
        });
      }, 700);
    } else {
      // Vérifier si tout est correct
      const newCorrect = Object.values(newResults).filter(v => v === 'correct').length;
      setScore(newCorrect);
      if (newCorrect === FAMILLE.length) {
        setTimeout(() => finishGame(), 400);
      }
    }
  };

  const finishGame = async () => {
    setPhase('result');
    // Ajouter XP
    try { await progressAPI.addXp({ xp: XP_REWARD, source: 'arbres_palabres' }); } catch (_) {}
    // Badge
    if (!badgeAlreadyOwned) {
      await AsyncStorage.setItem(STORAGE_BADGE, 'true');
      setBadgeEarned(true);
      setBadgeAlreadyOwned(true);
    }
  };

  // ── Rendu intro ─────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.introHeader}>
          <Text style={styles.introEmoji}>🌳</Text>
          <Text style={styles.introTitle}>Arbre à Palabres</Text>
          <Text style={styles.introSubtitle}>Exercice de la famille</Text>
        </LinearGradient>

        <View style={styles.introBody}>
          <View style={styles.introBubble}>
            <Ionicons name="information-circle" size={22} color={C.primary} />
            <Text style={styles.introBubbleText}>
              Associe chaque mot de la langue à son membre de la famille.
              Tape un mot, puis tape le bon emplacement sur l'arbre.
            </Text>
          </View>

          <Text style={styles.introSectionLabel}>Choisir la langue</Text>
          {LANGUES.map((l, idx) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.langOption, langIdx === idx && styles.langOptionActive]}
              onPress={() => setLangIdx(idx)}
            >
              <Text style={styles.langOptionFlag}>{l.flag}</Text>
              <Text style={[styles.langOptionNom, langIdx === idx && { color: C.primary }]}>{l.nom}</Text>
              {langIdx === idx && <Ionicons name="checkmark-circle" size={22} color={C.primary} />}
            </TouchableOpacity>
          ))}

          <View style={styles.rewardRow}>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardChipText}>⭐ +{XP_REWARD} XP</Text>
            </View>
            {!badgeAlreadyOwned ? (
              <View style={styles.rewardChip}>
                <Text style={styles.rewardChipText}>🏅 Badge "Fils/Fille du pays"</Text>
              </View>
            ) : (
              <View style={[styles.rewardChip, { backgroundColor: '#e8f5e9' }]}>
                <Text style={[styles.rewardChipText, { color: C.green }]}>✅ Badge déjà obtenu</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={startGame}>
            <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.startBtnGrad}>
              <Text style={styles.startBtnText}>Commencer 🌳</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── Rendu résultat ──────────────────────────────────────────────────────────
  if (phase === 'result') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 24 }}>
        <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.resultHeader}>
          <Text style={{ fontSize: 64 }}>🌳</Text>
          <Text style={styles.resultTitle}>Félicitations !</Text>
          <Text style={styles.resultScore}>Tu as complété l'arbre !</Text>
        </LinearGradient>

        <View style={styles.resultBody}>
          {badgeEarned && (
            <Animated.View style={styles.badgeWon}>
              <Text style={{ fontSize: 48 }}>🏅</Text>
              <Text style={styles.badgeWonTitle}>Badge débloqué !</Text>
              <Text style={styles.badgeWonName}>"Fils/Fille du pays"</Text>
            </Animated.View>
          )}

          <View style={styles.xpWon}>
            <Text style={styles.xpWonText}>+{XP_REWARD} XP gagnés 🌟</Text>
          </View>

          <Text style={styles.resultSectionLabel}>Les mots appris en {lang.nom}</Text>
          {FAMILLE.map(m => (
            <View key={m.id} style={styles.resultRow}>
              <Text style={styles.resultEmoji}>{m.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultFr}>{m.fr}</Text>
                <Text style={styles.resultMot}>{lang.mots[m.id].mot}</Text>
                <Text style={styles.resultPrononc}>{lang.mots[m.id].prononc}</Text>
              </View>
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

  // ── Rendu jeu ───────────────────────────────────────────────────────────────
  const tier0 = FAMILLE.filter(m => m.tier === 0);
  const tier1 = FAMILLE.filter(m => m.tier === 1);
  const tier2 = FAMILLE.filter(m => m.tier === 2);

  const renderSlot = (membre) => {
    const val      = slots[membre.id];
    const res      = results[membre.id];
    const prononc  = val ? lang.mots[membre.id]?.prononc : null;
    const bgColor  = res === 'correct' ? '#E8F5E9'
                   : res === 'wrong'   ? '#FFEBEE'
                   : selected          ? '#FFF8E1'
                   : '#fff';
    const border   = res === 'correct' ? C.green
                   : res === 'wrong'   ? C.red
                   : selected          ? C.accent
                   : C.border;

    return (
      <Animated.View key={membre.id} style={{ transform: [{ scale: flashAnims[membre.id] }] }}>
        <TouchableOpacity
          style={[styles.slot, { backgroundColor: bgColor, borderColor: border }]}
          onPress={() => handleSlotTap(membre.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.slotEmoji}>{membre.emoji}</Text>
          <Text style={styles.slotFr}>{membre.fr}</Text>
          {val ? (
            <>
              <Text style={[styles.slotMot, { color: res === 'correct' ? C.green : res === 'wrong' ? C.red : C.primary }]}>
                {val}
              </Text>
              {prononc && <Text style={styles.slotPrononc}>{prononc}</Text>}
            </>
          ) : (
            <Text style={styles.slotEmpty}>···</Text>
          )}
          {res === 'correct' && <Ionicons name="checkmark-circle" size={16} color={C.green} style={{ marginTop: 2 }} />}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.gameHeader}>
        <View style={styles.gameHeaderRow}>
          <Text style={styles.gameHeaderTitle}>🌳 Arbre à Palabres</Text>
          <View style={styles.gameScore}>
            <Text style={styles.gameScoreText}>{score}/{FAMILLE.length}</Text>
          </View>
        </View>
        <Text style={styles.gameHeaderLang}>{lang.flag} {lang.nom}</Text>
        {selected && (
          <View style={styles.selectedBanner}>
            <Text style={styles.selectedBannerText}>
              Mot sélectionné : <Text style={{ fontWeight: '700' }}>{selected.mot}</Text> — tape un membre de la famille
            </Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
        {/* Arbre généalogique */}
        <View style={styles.tree}>
          {/* Tier 0 : grands-parents */}
          <View style={styles.treeRow}>
            {tier0.map(renderSlot)}
          </View>
          {/* Connecteur */}
          <View style={styles.connector}>
            <View style={styles.connectorLine} />
          </View>
          {/* Tier 1 : parents + oncle/tante */}
          <View style={styles.treeRow}>
            {tier1.map(renderSlot)}
          </View>
          {/* Connecteur */}
          <View style={styles.connector}>
            <View style={styles.connectorLine} />
          </View>
          {/* Tier 2 : frère/sœur */}
          <View style={[styles.treeRow, { justifyContent: 'center' }]}>
            {tier2.map(renderSlot)}
          </View>
        </View>

        {/* Banque de mots */}
        <View style={styles.bankSection}>
          <Text style={styles.bankTitle}>
            {bank.length > 0 ? '👆 Tape un mot ci-dessous, puis un emplacement' : '🎉 Tous les mots sont placés !'}
          </Text>
          <View style={styles.bankGrid}>
            {bank.map(item => {
              const isSel = selected?.key === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.bankChip, isSel && styles.bankChipSelected]}
                  onPress={() => handleBankTap(item)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.bankChipMot, isSel && { color: '#fff' }]}>{item.mot}</Text>
                  <Text style={[styles.bankChipPrononc, isSel && { color: 'rgba(255,255,255,0.8)' }]}>
                    {item.prononc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const SLOT_W = (W - 48) / 2 - 4;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // Intro
  introHeader: {
    paddingTop: 56, paddingBottom: 32, alignItems: 'center',
  },
  introEmoji: { fontSize: 64, marginBottom: 8 },
  introTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
  introSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  introBody: { padding: 20 },
  introBubble: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: '#E8F5E9', borderRadius: 12, padding: 14, marginBottom: 20,
  },
  introBubbleText: { flex: 1, fontSize: 14, color: C.primary, lineHeight: 20 },
  introSectionLabel: { fontSize: 15, fontWeight: '700', color: C.primary, marginBottom: 10 },
  langOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 1.5, borderColor: C.border, marginBottom: 10,
  },
  langOptionActive: { borderColor: C.primary, backgroundColor: '#E8F5E9' },
  langOptionFlag: { fontSize: 22 },
  langOptionNom: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
  rewardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 16 },
  rewardChip: {
    backgroundColor: '#FFF8E1', borderRadius: 20, borderWidth: 1,
    borderColor: '#FFD600', paddingHorizontal: 12, paddingVertical: 6,
  },
  rewardChipText: { fontSize: 13, fontWeight: '600', color: '#795548' },
  startBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  startBtnGrad: { paddingVertical: 16, alignItems: 'center' },
  startBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },

  // Game header
  gameHeader: { paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12 },
  gameHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gameHeaderTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  gameScore: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  gameScoreText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  gameHeaderLang: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  selectedBanner: {
    marginTop: 8, backgroundColor: 'rgba(244,121,32,0.2)', borderRadius: 8, padding: 8,
  },
  selectedBannerText: { fontSize: 13, color: '#fff' },

  // Game content
  gameContent: { padding: 12, paddingBottom: 40 },

  // Tree
  tree: { marginBottom: 16 },
  treeRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    justifyContent: 'space-evenly', marginVertical: 4,
  },
  connector: { alignItems: 'center', marginVertical: 2 },
  connectorLine: { width: 2, height: 16, backgroundColor: '#C8E6C9', borderRadius: 1 },

  // Slot
  slot: {
    width: SLOT_W, borderRadius: 14, borderWidth: 1.5,
    padding: 10, alignItems: 'center', marginBottom: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
    minHeight: 90,
  },
  slotEmoji: { fontSize: 26, marginBottom: 2 },
  slotFr: { fontSize: 11, color: C.grey, fontWeight: '600', marginBottom: 2 },
  slotMot: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  slotPrononc: { fontSize: 10, color: C.grey, marginTop: 1 },
  slotEmpty: { fontSize: 18, color: '#DDD', marginTop: 4 },

  // Word bank
  bankSection: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.border,
  },
  bankTitle: { fontSize: 13, color: C.grey, marginBottom: 12, textAlign: 'center' },
  bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  bankChip: {
    backgroundColor: C.light, borderRadius: 20, borderWidth: 1.5,
    borderColor: C.border, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center',
  },
  bankChipSelected: {
    backgroundColor: C.primary, borderColor: C.primary,
  },
  bankChipMot: { fontSize: 14, fontWeight: '700', color: C.primary },
  bankChipPrononc: { fontSize: 10, color: C.grey, marginTop: 1 },

  // Result
  resultHeader: {
    paddingTop: 60, paddingBottom: 32, alignItems: 'center',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  resultTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: 8 },
  resultScore: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  resultBody: { padding: 20, width: '100%', alignItems: 'center' },
  badgeWon: {
    alignItems: 'center', backgroundColor: '#FFF8E1', borderRadius: 16,
    padding: 20, marginBottom: 16, borderWidth: 2, borderColor: C.gold,
    width: '100%',
  },
  badgeWonTitle: { fontSize: 18, fontWeight: '800', color: '#795548', marginTop: 6 },
  badgeWonName: { fontSize: 15, color: C.accent, fontWeight: '600', marginTop: 2 },
  xpWon: {
    backgroundColor: '#E8F5E9', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10,
    marginBottom: 20,
  },
  xpWonText: { fontSize: 16, fontWeight: '700', color: C.green },
  resultSectionLabel: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 12, alignSelf: 'flex-start' },
  resultRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: C.border, width: '100%',
  },
  resultEmoji: { fontSize: 28 },
  resultFr: { fontSize: 12, color: C.grey, fontWeight: '600' },
  resultMot: { fontSize: 16, fontWeight: '700', color: C.primary },
  resultPrononc: { fontSize: 11, color: C.grey, marginTop: 1 },
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
