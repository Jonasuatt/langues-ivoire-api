/**
 * SOSScreen — Module S.O.S. Langues
 *
 * Interface d'urgence : design rouge/blanc, ultra-lisible, 100% hors-ligne.
 * 10 phrases vitales + carte corporelle interactive + boucle audio.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Alert, Vibration,
  Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { phrasesAPI } from '../services/api';

// ─── Langues disponibles ────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'dioula',  name: 'Dioula',  flag: '🌍', speechLang: 'fr-FR' },
  { code: 'baoule',  name: 'Baoulé',  flag: '🌿', speechLang: 'fr-FR' },
  { code: 'bete',    name: 'Bété',    flag: '🌺', speechLang: 'fr-FR' },
  { code: 'senoufo', name: 'Sénoufo', flag: '🌾', speechLang: 'fr-FR' },
  { code: 'agni',    name: 'Agni',    flag: '👑', speechLang: 'fr-FR' },
  { code: 'gouro',   name: 'Gouro',   flag: '🎨', speechLang: 'fr-FR' },
  { code: 'guere',   name: 'Guéré',   flag: '🌳', speechLang: 'fr-FR' },
  { code: 'nouchi',  name: 'Nouchi',  flag: '🌆', speechLang: 'fr-FR' },
];

// ─── 10 Phrases vitales par langue ─────────────────────────────────────────
const SOS_PHRASES = {
  dioula: [
    { fr: 'Aidez-moi ! Au secours !',     local: 'A dɛmɛ n\'na ! Bɔ n\'ma !',         emoji: '🆘' },
    { fr: 'J\'ai mal ici.',               local: 'Dimi bɛ ne la.',                     emoji: '🤕' },
    { fr: 'Où est l\'hôpital ?',          local: 'Dɔkitisɔ be min ?',                  emoji: '🏥' },
    { fr: 'Appelez un docteur.',          local: 'Dɔkitiri wele.',                     emoji: '👨‍⚕️' },
    { fr: 'C\'est une urgence !',         local: 'Dɔgɔkun don !',                      emoji: '🚨' },
    { fr: 'J\'ai besoin d\'eau.',         local: 'Ji ka kan ne ye.',                   emoji: '💧' },
    { fr: 'Il y a eu un accident.',       local: 'Nafula kɛra.',                       emoji: '⚠️' },
    { fr: 'Je suis perdu(e).',            local: 'Ne tɛ sira lɔn.',                    emoji: '🗺️' },
    { fr: 'Appelez ma famille.',          local: 'N\' somɔgɔw wele.',                  emoji: '👨‍👩‍👧' },
    { fr: 'Je dois prendre mon remède.',  local: 'N\'ka furaw minɛ.',                  emoji: '💊' },
  ],
  baoule: [
    { fr: 'Aidez-moi ! Au secours !',     local: 'Boa mi ! Boa mi kpa !',              emoji: '🆘' },
    { fr: 'J\'ai mal ici.',               local: 'N\' wla wa ne yi.',                  emoji: '🤕' },
    { fr: 'Où est l\'hôpital ?',          local: 'Dɔkita fie lo fié ?',                emoji: '🏥' },
    { fr: 'Appelez un docteur.',          local: 'Flɛ dɔkita.',                        emoji: '👨‍⚕️' },
    { fr: 'C\'est une urgence !',         local: 'Aie, ɔ sa kpa !',                    emoji: '🚨' },
    { fr: 'J\'ai besoin d\'eau.',         local: 'N\' wla nzue.',                      emoji: '💧' },
    { fr: 'Il y a eu un accident.',       local: 'Asidã kɔe.',                         emoji: '⚠️' },
    { fr: 'Je suis perdu(e).',            local: 'N\' vua.',                           emoji: '🗺️' },
    { fr: 'Appelez ma famille.',          local: 'Flɛ n\' awlo.',                      emoji: '👨‍👩‍👧' },
    { fr: 'Je dois prendre mon remède.',  local: 'N\'ka n\' drɔ mɔ.',                  emoji: '💊' },
  ],
  bete: [
    { fr: 'Aidez-moi ! Au secours !',     local: 'A m\' gbɛ ! Boa m\' na !',           emoji: '🆘' },
    { fr: 'J\'ai mal ici.',               local: 'A kwin m\' na.',                     emoji: '🤕' },
    { fr: 'Où est l\'hôpital ?',          local: 'Asperu-wa ni o ?',                   emoji: '🏥' },
    { fr: 'Appelez un docteur.',          local: 'A dɔkta la.',                        emoji: '👨‍⚕️' },
    { fr: 'C\'est une urgence !',         local: 'A kwi gbɛ !',                        emoji: '🚨' },
    { fr: 'J\'ai besoin d\'eau.',         local: 'A nyu n\' dhi.',                     emoji: '💧' },
    { fr: 'Il y a eu un accident.',       local: 'Akisidã mɔ ɛ.',                      emoji: '⚠️' },
    { fr: 'Je suis perdu(e).',            local: 'A m\' vlu.',                         emoji: '🗺️' },
    { fr: 'Appelez ma famille.',          local: 'A n\' wlu la.',                      emoji: '👨‍👩‍👧' },
    { fr: 'Je dois prendre mon remède.',  local: 'A n\' drɔ n\' nu.',                  emoji: '💊' },
  ],
  senoufo: [
    { fr: 'Aidez-moi ! Au secours !',     local: 'Wabɛ ! M\' maga togo !',             emoji: '🆘' },
    { fr: 'J\'ai mal ici.',               local: 'Nahn bɛ n\' yɛ.',                    emoji: '🤕' },
    { fr: 'Où est l\'hôpital ?',          local: 'Dɔkitasogu bɛ min ?',                emoji: '🏥' },
    { fr: 'Appelez un docteur.',          local: 'Dɔkita yeri.',                       emoji: '👨‍⚕️' },
    { fr: 'C\'est une urgence !',         local: 'Wɔ ka fɔ kpa !',                     emoji: '🚨' },
    { fr: 'J\'ai besoin d\'eau.',         local: 'Dyɛ n\' kani.',                      emoji: '💧' },
    { fr: 'Il y a eu un accident.',       local: 'Asidã kɔ.',                          emoji: '⚠️' },
    { fr: 'Je suis perdu(e).',            local: 'N\' ye sira.',                       emoji: '🗺️' },
    { fr: 'Appelez ma famille.',          local: 'N\' family yeri.',                   emoji: '👨‍👩‍👧' },
    { fr: 'Je dois prendre mon remède.',  local: 'N\' ka n\' furaw.',                  emoji: '💊' },
  ],
  agni: [
    { fr: 'Aidez-moi ! Au secours !',     local: 'Boa me ! Wua me !',                  emoji: '🆘' },
    { fr: 'J\'ai mal ici.',               local: 'Owie wua me yi.',                    emoji: '🤕' },
    { fr: 'Où est l\'hôpital ?',          local: 'Dɔkita fie lo ?',                    emoji: '🏥' },
    { fr: 'Appelez un docteur.',          local: 'Flɛ dɔkita.',                        emoji: '👨‍⚕️' },
    { fr: 'C\'est une urgence !',         local: 'Ɔ sa kpa !',                         emoji: '🚨' },
    { fr: 'J\'ai besoin d\'eau.',         local: 'N\' wla nzue.',                      emoji: '💧' },
    { fr: 'Il y a eu un accident.',       local: 'Asidã kɔe.',                         emoji: '⚠️' },
    { fr: 'Je suis perdu(e).',            local: 'N\' vua.',                           emoji: '🗺️' },
    { fr: 'Appelez ma famille.',          local: 'Flɛ n\' awlo.',                      emoji: '👨‍👩‍👧' },
    { fr: 'Je dois prendre mon remède.',  local: 'N\' drɔ mɔ.',                        emoji: '💊' },
  ],
  gouro: [
    { fr: 'Aidez-moi ! Au secours !',     local: 'Wa m\' de ! Wa bua !',               emoji: '🆘' },
    { fr: 'J\'ai mal ici.',               local: 'Wla bɛ n\' yi.',                     emoji: '🤕' },
    { fr: 'Où est l\'hôpital ?',          local: 'Dɔkita lɔ le ?',                     emoji: '🏥' },
    { fr: 'Appelez un docteur.',          local: 'Dɔkita ya.',                         emoji: '👨‍⚕️' },
    { fr: 'C\'est une urgence !',         local: 'Kɔ gbɔ !',                           emoji: '🚨' },
    { fr: 'J\'ai besoin d\'eau.',         local: 'Yi n\' kani.',                       emoji: '💧' },
    { fr: 'Il y a eu un accident.',       local: 'Asidã kɔ.',                          emoji: '⚠️' },
    { fr: 'Je suis perdu(e).',            local: 'N\' sira tɛ.',                       emoji: '🗺️' },
    { fr: 'Appelez ma famille.',          local: 'N\' somow ya.',                      emoji: '👨‍👩‍👧' },
    { fr: 'Je dois prendre mon remède.',  local: 'N\' furaw mɛ.',                      emoji: '💊' },
  ],
  guere: [
    { fr: 'Aidez-moi ! Au secours !',     local: 'Bua mi ! Bua mi kpa !',              emoji: '🆘' },
    { fr: 'J\'ai mal ici.',               local: 'Wla bɛ ne yi.',                      emoji: '🤕' },
    { fr: 'Où est l\'hôpital ?',          local: 'Dɔkita bha le ?',                    emoji: '🏥' },
    { fr: 'Appelez un docteur.',          local: 'Dɔkita la.',                         emoji: '👨‍⚕️' },
    { fr: 'C\'est une urgence !',         local: 'Gbɔ kpa !',                          emoji: '🚨' },
    { fr: 'J\'ai besoin d\'eau.',         local: 'Iu n\' kani.',                       emoji: '💧' },
    { fr: 'Il y a eu un accident.',       local: 'Asidã kɔ.',                          emoji: '⚠️' },
    { fr: 'Je suis perdu(e).',            local: 'N\' sira bli.',                      emoji: '🗺️' },
    { fr: 'Appelez ma famille.',          local: 'N\' wlo la.',                        emoji: '👨‍👩‍👧' },
    { fr: 'Je dois prendre mon remède.',  local: 'N\' drɔ mɔ.',                        emoji: '💊' },
  ],
  nouchi: [
    { fr: 'Aidez-moi ! Au secours !',     local: 'Wôy ! Sauvetage là !',               emoji: '🆘' },
    { fr: 'J\'ai mal ici.',               local: 'Ici ça fait mal wêê !',              emoji: '🤕' },
    { fr: 'Où est l\'hôpital ?',          local: 'L\'hôpital i y\'a où ?',             emoji: '🏥' },
    { fr: 'Appelez un docteur.',          local: 'Appelle le docteur vite !',          emoji: '👨‍⚕️' },
    { fr: 'C\'est une urgence !',         local: 'C\'est gbê là ! Vite vite !',        emoji: '🚨' },
    { fr: 'J\'ai besoin d\'eau.',         local: 'Donne-moi l\'eau là !',              emoji: '💧' },
    { fr: 'Il y a eu un accident.',       local: 'Accident kɔ là !',                   emoji: '⚠️' },
    { fr: 'Je suis perdu(e).',            local: 'Je suis lost wêê !',                 emoji: '🗺️' },
    { fr: 'Appelez ma famille.',          local: 'Appelle ma famille vite !',          emoji: '👨‍👩‍👧' },
    { fr: 'Je dois prendre mon remède.',  local: 'Mon médicament là, vite !',          emoji: '💊' },
  ],
};

// ─── Parties du corps + traductions "J'ai mal à…" ──────────────────────────
const BODY_PARTS = {
  dioula:  [
    { id: 'tete',      label: 'Tête',          phrase: 'Dimi bɛ n\' kun na.',       fr: 'J\'ai mal à la tête.',    emoji: '🧠' },
    { id: 'gorge',     label: 'Gorge',          phrase: 'Dimi bɛ n\' da na.',        fr: 'J\'ai mal à la gorge.',   emoji: '🫁' },
    { id: 'poitrine',  label: 'Poitrine',       phrase: 'Dimi bɛ n\' faba la.',      fr: 'J\'ai mal à la poitrine.',emoji: '❤️' },
    { id: 'ventre',    label: 'Ventre',          phrase: 'Dimi bɛ n\' kɔnɔ.',        fr: 'J\'ai mal au ventre.',    emoji: '🫃' },
    { id: 'bras',      label: 'Bras',            phrase: 'Dimi bɛ n\' bolo la.',     fr: 'J\'ai mal au bras.',      emoji: '💪' },
    { id: 'dos',       label: 'Dos',             phrase: 'Dimi bɛ n\' kɔ la.',       fr: 'J\'ai mal au dos.',       emoji: '🫀' },
    { id: 'jambe',     label: 'Jambe',           phrase: 'Dimi bɛ n\' seen na.',     fr: 'J\'ai mal à la jambe.',   emoji: '🦵' },
    { id: 'pied',      label: 'Pied',            phrase: 'Dimi bɛ n\' sɛ la.',       fr: 'J\'ai mal au pied.',      emoji: '🦶' },
  ],
  baoule:  [
    { id: 'tete',      label: 'Tête',           phrase: 'N\' wla wa n\' ti.',        fr: 'J\'ai mal à la tête.',    emoji: '🧠' },
    { id: 'gorge',     label: 'Gorge',          phrase: 'N\' wla wa n\' anon.',      fr: 'J\'ai mal à la gorge.',   emoji: '🫁' },
    { id: 'poitrine',  label: 'Poitrine',       phrase: 'N\' wla wa n\' klun.',      fr: 'J\'ai mal à la poitrine.',emoji: '❤️' },
    { id: 'ventre',    label: 'Ventre',         phrase: 'N\' wla wa n\' wun.',       fr: 'J\'ai mal au ventre.',    emoji: '🫃' },
    { id: 'bras',      label: 'Bras',           phrase: 'N\' wla wa n\' ble.',       fr: 'J\'ai mal au bras.',      emoji: '💪' },
    { id: 'dos',       label: 'Dos',            phrase: 'N\' wla wa n\' ngua.',      fr: 'J\'ai mal au dos.',       emoji: '🫀' },
    { id: 'jambe',     label: 'Jambe',          phrase: 'N\' wla wa n\' nan.',       fr: 'J\'ai mal à la jambe.',   emoji: '🦵' },
    { id: 'pied',      label: 'Pied',           phrase: 'N\' wla wa n\' nan ase.',   fr: 'J\'ai mal au pied.',      emoji: '🦶' },
  ],
  bete: [
    { id: 'tete',     label: 'Tête',            phrase: 'A kwin m\' dre.',           fr: 'J\'ai mal à la tête.',    emoji: '🧠' },
    { id: 'gorge',    label: 'Gorge',           phrase: 'A kwin m\' la dre.',        fr: 'J\'ai mal à la gorge.',   emoji: '🫁' },
    { id: 'poitrine', label: 'Poitrine',        phrase: 'A kwin m\' piɛ dre.',       fr: 'J\'ai mal à la poitrine.',emoji: '❤️' },
    { id: 'ventre',   label: 'Ventre',          phrase: 'A kwin m\' bwu dre.',       fr: 'J\'ai mal au ventre.',    emoji: '🫃' },
    { id: 'bras',     label: 'Bras',            phrase: 'A kwin m\' nɛ dre.',        fr: 'J\'ai mal au bras.',      emoji: '💪' },
    { id: 'dos',      label: 'Dos',             phrase: 'A kwin m\' gba dre.',       fr: 'J\'ai mal au dos.',       emoji: '🫀' },
    { id: 'jambe',    label: 'Jambe',           phrase: 'A kwin m\' ke dre.',        fr: 'J\'ai mal à la jambe.',   emoji: '🦵' },
    { id: 'pied',     label: 'Pied',            phrase: 'A kwin m\' kle dre.',       fr: 'J\'ai mal au pied.',      emoji: '🦶' },
  ],
};
// Pour les autres langues, on utilise le Dioula comme fallback (le plus compris)
['senoufo', 'agni', 'gouro', 'guere', 'nouchi'].forEach(l => {
  BODY_PARTS[l] = BODY_PARTS.dioula;
});

// IDs des parties du corps dans l'ordre attendu par la carte corporelle
const BODY_PART_IDS = ['tete', 'gorge', 'poitrine', 'ventre', 'bras', 'dos', 'jambe', 'pied'];

// ─── Composant principal ────────────────────────────────────────────────────
export default function SOSScreen() {
  const navigation = useNavigation();
  const [selectedLang, setSelectedLang] = useState('dioula');
  const [activePhrase, setActivePhrase] = useState(null);
  const [isLooping, setIsLooping] = useState(false);
  const [activeTab, setActiveTab] = useState('phrases'); // 'phrases' | 'body'
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  // Phrases chargées depuis l'API (par code de langue)
  const [apiPhrases, setApiPhrases] = useState({});
  // Parties du corps chargées depuis l'API (par code de langue)
  const [apiBodyParts, setApiBodyParts] = useState({});

  const loopRef        = useRef(null);
  const isLoopingRef   = useRef(false);   // ref pour la boucle (évite les closures périmées)
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Charger les phrases SOS depuis l'API pour toutes les langues (urgence + corps)
  useEffect(() => {
    const fetchAll = async () => {
      const urgenceResult = {};
      const corpsResult   = {};

      await Promise.allSettled(
        LANGUAGES.map(async (l) => {
          try {
            // ── Phrases vitales (urgence) ──
            const urgRes = await phrasesAPI.getByLanguage(l.code, 'urgence');
            const urgData = urgRes.data?.data || [];
            if (urgData.length > 0) {
              urgenceResult[l.code] = urgData.map(p => ({
                fr:       p.traduction,
                local:    p.phrase,
                emoji:    p.contexte || '🆘',
                audioUrl: p.audioUrl || null,
              }));
            }
          } catch { /* fallback intégré */ }

          try {
            // ── Parties du corps (corps) ──
            const corpsRes = await phrasesAPI.getByLanguage(l.code, 'corps');
            const corpsData = corpsRes.data?.data || [];
            if (corpsData.length > 0) {
              // Convertir en map { bodyPartId → { phrase, fr, emoji, audioUrl } }
              // contexte = identifiant de la partie (tete, gorge, …)
              const map = {};
              corpsData.forEach(p => {
                if (p.contexte) {
                  map[p.contexte] = {
                    id:       p.contexte,
                    label:    BODY_PARTS[l.code]?.find(b => b.id === p.contexte)?.label || p.contexte,
                    phrase:   p.phrase,
                    fr:       p.traduction,
                    emoji:    BODY_PARTS[l.code]?.find(b => b.id === p.contexte)?.emoji || '🩺',
                    audioUrl: p.audioUrl || null,
                  };
                }
              });
              // Reconstruire le tableau dans l'ordre des 8 parties
              const ordered = BODY_PART_IDS.map(id =>
                map[id] || BODY_PARTS[l.code]?.find(b => b.id === id) || BODY_PARTS.dioula.find(b => b.id === id)
              ).filter(Boolean);
              if (ordered.length > 0) corpsResult[l.code] = ordered;
            }
          } catch { /* fallback intégré */ }
        })
      );

      if (Object.keys(urgenceResult).length > 0) setApiPhrases(urgenceResult);
      if (Object.keys(corpsResult).length > 0)   setApiBodyParts(corpsResult);
    };
    fetchAll();
  }, []);

  // Pulsation du bandeau SOS
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Nettoyer la boucle et le speech quand on quitte l'écran
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopLoop();
        Speech.stop();
      };
    }, [])
  );

  // Énonce d'abord la phrase EN LANGUE LOCALE, puis la traduction française
  // onDone : callback optionnel appelé quand les deux lectures sont terminées
  const speak = (local, fr, onDone) => {
    Speech.stop();
    Vibration.vibrate(80);
    Speech.speak(local, {
      language: 'fr-FR', // fallback : pas de locale dédiée pour les langues ivoiriennes
      rate: 0.70,
      pitch: 1.0,
      volume: 1.0,
      onDone: () => {
        // Courte pause entre langue locale et français
        setTimeout(() => {
          Speech.speak(fr, {
            language: 'fr-FR',
            rate: 0.75,
            pitch: 1.0,
            volume: 1.0,
            onDone,
          });
        }, 450);
      },
      onError: () => {
        // Si la lecture locale échoue, lire au moins le français
        Speech.speak(fr, { language: 'fr-FR', rate: 0.75, volume: 1.0, onDone });
      },
    });
  };

  // Planifie la prochaine répétition APRÈS la fin des deux lectures
  const scheduleLoop = (phrase) => {
    loopRef.current = setTimeout(() => {
      if (!isLoopingRef.current) return;
      speak(phrase.local, phrase.fr, () => scheduleLoop(phrase));
    }, 2500); // 2.5 s de silence entre chaque répétition
  };

  const startLoop = (phrase) => {
    isLoopingRef.current = true;
    setIsLooping(true);
    setActivePhrase(phrase);
    speak(phrase.local, phrase.fr, () => scheduleLoop(phrase));
  };

  const stopLoop = () => {
    isLoopingRef.current = false;
    setIsLooping(false);
    if (loopRef.current) {
      clearTimeout(loopRef.current);
      loopRef.current = null;
    }
    Speech.stop();
  };

  const handlePhrasePress = (phrase) => {
    if (isLooping && activePhrase?.fr === phrase.fr) {
      stopLoop();
    } else {
      stopLoop();
      speak(phrase.local, phrase.fr);
      setActivePhrase(phrase);
    }
  };

  const handleLoopPress = (phrase) => {
    if (isLooping && activePhrase?.fr === phrase.fr) {
      stopLoop();
    } else {
      stopLoop();
      startLoop(phrase);
    }
  };

  const handleBodyPartPress = (part) => {
    setSelectedBodyPart(part);
    speak(part.phrase, part.fr);
  };

  const lang = LANGUAGES.find(l => l.code === selectedLang);
  // Priorité : phrases API (gérées par les animateurs CMS) > hardcoded fallback
  const phrases = (apiPhrases[selectedLang]?.length > 0 ? apiPhrases[selectedLang] : null)
    || SOS_PHRASES[selectedLang] || SOS_PHRASES.dioula;
  // Pareil pour les parties du corps
  const bodyParts = (apiBodyParts[selectedLang]?.length > 0 ? apiBodyParts[selectedLang] : null)
    || BODY_PARTS[selectedLang] || BODY_PARTS.dioula;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#C62828" />

      {/* ── Header SOS ── */}
      <Animated.View style={[styles.header, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => { stopLoop(); navigation.goBack(); }} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <View style={styles.sosTitleWrap}>
            <Text style={styles.sosIcon}>🆘</Text>
            <Text style={styles.sosTitle}>S.O.S. LANGUES</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSub}>
          Montrez cet écran à quelqu'un qui parle {lang?.name}
        </Text>
      </Animated.View>

      {/* ── Sélecteur de langue ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.langBar} contentContainerStyle={styles.langBarContent}>
        {LANGUAGES.map(l => (
          <TouchableOpacity key={l.code}
            style={[styles.langChip, selectedLang === l.code && styles.langChipActive]}
            onPress={() => { stopLoop(); setSelectedLang(l.code); setActivePhrase(null); setSelectedBodyPart(null); }}>
            <Text style={styles.langChipFlag}>{l.flag}</Text>
            <Text style={[styles.langChipText, selectedLang === l.code && styles.langChipTextActive]}>
              {l.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Bandeau boucle active ── */}
      {isLooping && activePhrase && (
        <TouchableOpacity style={styles.loopBanner} onPress={stopLoop}>
          <Ionicons name="radio" size={18} color="#fff" />
          <Text style={styles.loopBannerText} numberOfLines={1}>
            Boucle : {activePhrase.fr}
          </Text>
          <Text style={styles.loopStop}>■ STOP</Text>
        </TouchableOpacity>
      )}

      {/* ── Onglets ── */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'phrases' && styles.tabActive]}
          onPress={() => setActiveTab('phrases')}>
          <Ionicons name="chatbubbles" size={18} color={activeTab === 'phrases' ? '#C62828' : '#999'} />
          <Text style={[styles.tabText, activeTab === 'phrases' && styles.tabTextActive]}>
            Phrases vitales
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'body' && styles.tabActive]}
          onPress={() => setActiveTab('body')}>
          <Ionicons name="body" size={18} color={activeTab === 'body' ? '#C62828' : '#999'} />
          <Text style={[styles.tabText, activeTab === 'body' && styles.tabTextActive]}>
            Où j'ai mal ?
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Contenu ── */}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>

        {activeTab === 'phrases' && (
          <>
            <Text style={styles.hint}>
              Appuyez : langue locale puis français · 🔁 pour répéter en boucle
            </Text>
            {phrases.map((phrase, idx) => {
              const isActive = activePhrase?.fr === phrase.fr;
              const looping = isLooping && isActive;
              return (
                <View key={idx} style={[styles.phraseCard, isActive && styles.phraseCardActive]}>
                  {/* Texte */}
                  <TouchableOpacity style={styles.phraseBody} onPress={() => handlePhrasePress(phrase)} activeOpacity={0.75}>
                    <Text style={styles.phraseEmoji}>{phrase.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.phraseFr}>{phrase.fr}</Text>
                      <Text style={styles.phraseLocal}>{phrase.local}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Boutons action */}
                  <View style={styles.phraseActions}>
                    {/* Bouton lire */}
                    <TouchableOpacity
                      style={[styles.speakBtn, isActive && !looping && styles.speakBtnActive]}
                      onPress={() => handlePhrasePress(phrase)}>
                      <Ionicons
                        name={isActive && !looping ? 'volume-high' : 'volume-medium-outline'}
                        size={22}
                        color={isActive && !looping ? '#fff' : '#C62828'}
                      />
                    </TouchableOpacity>
                    {/* Bouton boucle */}
                    <TouchableOpacity
                      style={[styles.loopBtn, looping && styles.loopBtnActive]}
                      onPress={() => handleLoopPress(phrase)}>
                      <Ionicons
                        name={looping ? 'radio' : 'repeat'}
                        size={20}
                        color={looping ? '#fff' : '#C62828'}
                      />
                      <Text style={[styles.loopBtnText, looping && { color: '#fff' }]}>
                        {looping ? 'STOP' : 'Boucle'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {activeTab === 'body' && (
          <>
            <Text style={styles.hint}>
              Touchez la partie douloureuse pour que l'app l'énonce dans la langue choisie
            </Text>

            {/* Corps humain schématique */}
            <View style={styles.bodyMapWrap}>
              {/* Silhouette stylisée avec zones cliquables */}
              <View style={styles.bodyFigure}>

                {/* Tête */}
                <TouchableOpacity style={[styles.bodyZone, styles.bodyHead,
                  selectedBodyPart?.id === 'tete' && styles.bodyZoneActive]}
                  onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'tete'))}>
                  <Text style={styles.bodyZoneEmoji}>🧠</Text>
                  <Text style={styles.bodyZoneLabel}>Tête</Text>
                </TouchableOpacity>

                {/* Gorge */}
                <TouchableOpacity style={[styles.bodyZone, styles.bodyNeck,
                  selectedBodyPart?.id === 'gorge' && styles.bodyZoneActive]}
                  onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'gorge'))}>
                  <Text style={styles.bodyZoneEmoji}>🫁</Text>
                  <Text style={styles.bodyZoneLabel}>Gorge</Text>
                </TouchableOpacity>

                {/* Rangée milieu : Bras G - Poitrine - Bras D */}
                <View style={styles.bodyRow}>
                  <TouchableOpacity style={[styles.bodyZone, styles.bodyArm,
                    selectedBodyPart?.id === 'bras' && styles.bodyZoneActive]}
                    onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'bras'))}>
                    <Text style={styles.bodyZoneEmoji}>💪</Text>
                    <Text style={styles.bodyZoneLabel}>Bras</Text>
                  </TouchableOpacity>

                  <View style={styles.bodyTorsoCol}>
                    <TouchableOpacity style={[styles.bodyZone, styles.bodyTorso,
                      selectedBodyPart?.id === 'poitrine' && styles.bodyZoneActive]}
                      onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'poitrine'))}>
                      <Text style={styles.bodyZoneEmoji}>❤️</Text>
                      <Text style={styles.bodyZoneLabel}>Poitrine</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.bodyZone, styles.bodyTorso,
                      selectedBodyPart?.id === 'ventre' && styles.bodyZoneActive]}
                      onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'ventre'))}>
                      <Text style={styles.bodyZoneEmoji}>🫃</Text>
                      <Text style={styles.bodyZoneLabel}>Ventre</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.bodyZone, styles.bodyTorso,
                      selectedBodyPart?.id === 'dos' && styles.bodyZoneActive]}
                      onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'dos'))}>
                      <Text style={styles.bodyZoneEmoji}>🫀</Text>
                      <Text style={styles.bodyZoneLabel}>Dos</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={[styles.bodyZone, styles.bodyArm,
                    selectedBodyPart?.id === 'bras' && styles.bodyZoneActive]}
                    onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'bras'))}>
                    <Text style={styles.bodyZoneEmoji}>💪</Text>
                    <Text style={styles.bodyZoneLabel}>Bras</Text>
                  </TouchableOpacity>
                </View>

                {/* Rangée jambes */}
                <View style={styles.bodyRow}>
                  <TouchableOpacity style={[styles.bodyZone, styles.bodyLeg,
                    selectedBodyPart?.id === 'jambe' && styles.bodyZoneActive]}
                    onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'jambe'))}>
                    <Text style={styles.bodyZoneEmoji}>🦵</Text>
                    <Text style={styles.bodyZoneLabel}>Jambe</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.bodyZone, styles.bodyLeg,
                    selectedBodyPart?.id === 'jambe' && styles.bodyZoneActive]}
                    onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'jambe'))}>
                    <Text style={styles.bodyZoneEmoji}>🦵</Text>
                    <Text style={styles.bodyZoneLabel}>Jambe</Text>
                  </TouchableOpacity>
                </View>

                {/* Rangée pieds */}
                <View style={styles.bodyRow}>
                  <TouchableOpacity style={[styles.bodyZone, styles.bodyFoot,
                    selectedBodyPart?.id === 'pied' && styles.bodyZoneActive]}
                    onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'pied'))}>
                    <Text style={styles.bodyZoneEmoji}>🦶</Text>
                    <Text style={styles.bodyZoneLabel}>Pied</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.bodyZone, styles.bodyFoot,
                    selectedBodyPart?.id === 'pied' && styles.bodyZoneActive]}
                    onPress={() => handleBodyPartPress(bodyParts.find(b => b.id === 'pied'))}>
                    <Text style={styles.bodyZoneEmoji}>🦶</Text>
                    <Text style={styles.bodyZoneLabel}>Pied</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Phrase prononcée */}
              {selectedBodyPart && (
                <View style={styles.bodyResult}>
                  <Text style={styles.bodyResultFr}>{selectedBodyPart.fr}</Text>
                  <Text style={styles.bodyResultLocal}>{selectedBodyPart.phrase}</Text>
                  <TouchableOpacity style={styles.bodyReplay}
                    onPress={() => handleBodyPartPress(selectedBodyPart)}>
                    <Ionicons name="volume-high" size={20} color="#fff" />
                    <Text style={styles.bodyReplayText}>Répéter</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF5F5' },

  // Header
  header: {
    backgroundColor: '#C62828',
    paddingTop: Platform.OS === 'ios' ? 50 : 36,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  sosTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sosIcon: { fontSize: 28 },
  sosTitle: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 8 },

  // Lang bar
  langBar: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#FFE0E0', maxHeight: 56 },
  langBarContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  langChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFF5F5', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1.5, borderColor: '#FFCDD2',
  },
  langChipActive: { backgroundColor: '#C62828', borderColor: '#C62828' },
  langChipFlag: { fontSize: 14 },
  langChipText: { fontSize: 13, fontWeight: '600', color: '#C62828' },
  langChipTextActive: { color: '#fff' },

  // Loop banner
  loopBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#B71C1C', paddingHorizontal: 16, paddingVertical: 10,
  },
  loopBannerText: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '600' },
  loopStop: { color: '#FFCDD2', fontSize: 13, fontWeight: 'bold' },

  // Tabs
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#FFE0E0' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#C62828' },
  tabText: { fontSize: 14, color: '#999', fontWeight: '600' },
  tabTextActive: { color: '#C62828' },

  // Content
  content: { flex: 1 },
  hint: { fontSize: 12, color: '#999', textAlign: 'center', margin: 12, marginBottom: 4 },

  // Phrase card
  phraseCard: {
    marginHorizontal: 14, marginVertical: 5,
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#FFCDD2',
    shadowColor: '#C62828', shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
    overflow: 'hidden',
  },
  phraseCardActive: { borderColor: '#C62828', backgroundColor: '#FFF5F5' },
  phraseBody: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  phraseEmoji: { fontSize: 28 },
  phraseFr: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  phraseLocal: { fontSize: 18, fontWeight: '600', color: '#C62828', fontStyle: 'italic' },
  phraseActions: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#FFE0E0',
    backgroundColor: '#FFF5F5',
  },
  speakBtn: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 10, gap: 6, borderRightWidth: 1, borderRightColor: '#FFE0E0',
  },
  speakBtnActive: { backgroundColor: '#C62828' },
  loopBtn: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 10, gap: 6,
  },
  loopBtnActive: { backgroundColor: '#B71C1C' },
  loopBtnText: { fontSize: 12, fontWeight: 'bold', color: '#C62828' },

  // Body map
  bodyMapWrap: { padding: 16 },
  bodyFigure: { alignItems: 'center', gap: 8 },
  bodyRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  bodyTorsoCol: { gap: 8 },
  bodyZone: {
    backgroundColor: '#fff', borderRadius: 14, padding: 10, alignItems: 'center', gap: 4,
    borderWidth: 2, borderColor: '#FFCDD2', minWidth: 80,
    shadowColor: '#C62828', shadowOpacity: 0.08, shadowRadius: 4, elevation: 1,
  },
  bodyZoneActive: { backgroundColor: '#C62828', borderColor: '#B71C1C' },
  bodyZoneEmoji: { fontSize: 24 },
  bodyZoneLabel: { fontSize: 11, fontWeight: '700', color: '#C62828', textAlign: 'center' },
  bodyHead: { minWidth: 100 },
  bodyNeck: { minWidth: 100 },
  bodyTorso: { minWidth: 100 },
  bodyArm: { minWidth: 75 },
  bodyLeg: { minWidth: 90 },
  bodyFoot: { minWidth: 90 },

  bodyResult: {
    marginTop: 20, backgroundColor: '#C62828', borderRadius: 16,
    padding: 18, alignItems: 'center', gap: 8,
  },
  bodyResultFr: { fontSize: 16, fontWeight: '700', color: '#fff' },
  bodyResultLocal: { fontSize: 20, fontWeight: '800', color: '#FFCDD2', fontStyle: 'italic', textAlign: 'center' },
  bodyReplay: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 18, paddingVertical: 8, marginTop: 4,
  },
  bodyReplayText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
