import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Alert, Image, Animated,
  Modal, KeyboardAvoidingView, TextInput, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { createAudioPlayer } from 'expo-audio';
import { audioContribAPI, languagesAPI, agentChatAPI, dictionaryAPI } from '../services/api';
import RecordButton from '../components/RecordButton';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8', text: '#1A1A1A' };

const AGENTS = {
  female: {
    name: 'Zélé',
    gender: 'F',
    personality: 'Douce et patiente, guide les débutants avec bienveillance',
    color: '#AD1457',
    gradient: ['#AD1457', '#E91E63'],
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    greeting: 'Bonjour ! Je suis Zélé. Écoutez ma prononciation et répétez après moi.',
    voice: { language: 'fr-FR', pitch: 1.25, rate: 0.88 },
  },
  male: {
    name: 'Kouadio',
    gender: 'M',
    personality: 'Dynamique et encourageant, rend l\'apprentissage amusant',
    color: '#1565C0',
    gradient: ['#0D47A1', '#1976D2'],
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    greeting: 'Salut ! Moi c\'est Kouadio. On va pratiquer ensemble, c\'est parti !',
    voice: { language: 'fr-FR', pitch: 0.82, rate: 1.0 },
  },
};

const MODES = [
  { key: 'listen_repeat', label: 'Écouter & Répéter', icon: 'ear',
    desc: 'L\'IA dit un mot ou une phrase, vous répétez' },
  { key: 'free_speak', label: 'Parler librement', icon: 'mic',
    desc: 'Enregistrez des mots pour enrichir la base de données' },
];

export default function PracticeScreen({ navigation }) {
  const [step, setStep]               = useState('select_agent');
  const [agent, setAgent]             = useState(null);
  const [mode, setMode]               = useState('listen_repeat');
  const [languages, setLanguages]     = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [words, setWords]             = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading]         = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [sessionStats, setSessionStats] = useState({ practiced: 0, correct: 0 });
  const [startTime]                   = useState(Date.now());
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [hasAudio, setHasAudio]       = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const soundRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // ── États spécifiques au mode "Parler librement" ──
  const [freeRecordingUri, setFreeRecordingUri] = useState(null);
  const [freeContribCount, setFreeContribCount] = useState(0);
  const [freeIsSubmitting, setFreeIsSubmitting] = useState(false);

  // ── Chat avec l'agent ──
  const [showChat, setShowChat]     = useState(false);
  const [chatInput, setChatInput]   = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    languagesAPI.getAll({ mvpOnly: 'true' })
      .then(({ data }) => setLanguages(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    Speech.stop();
    setIsSpeaking(false);
    if (soundRef.current) {
      try { soundRef.current.remove(); } catch (_) {}
      soundRef.current = null;
    }
    const word = words[currentIndex];
    setHasAudio(!!(word?.audioUrl));
  }, [currentIndex, step, words]);

  useEffect(() => {
    if (step === 'practice' && mode === 'listen_repeat' && agent && words[currentIndex]) {
      const timer = setTimeout(() => playCurrentWord(), 700);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, step]);

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }).start();
  }, [step]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Chargement des mots : contributions audio EN PRIORITÉ, dictionnaire en fallback
  // En mode "free_speak" : directement le dictionnaire (mots à enregistrer)
  // ─────────────────────────────────────────────────────────────────────────────
  const loadPracticeWords = useCallback(async (lang) => {
    setLoading(true);
    try {
      let wordsToLoad = [];
      let useFallback = false;

      if (mode === 'free_speak') {
        // Mode contribution : on charge le dictionnaire pour donner des mots à enregistrer
        const { data: dictData } = await dictionaryAPI.get(lang.code, { limit: 20 });
        const entries = dictData.data || dictData || [];
        wordsToLoad = entries.slice(0, 15).map(e => ({
          id: e.id,
          mot: e.mot,
          traduction: e.traduction,
          transcription: e.transcription,
          audioUrl: null,
        }));
        useFallback = false;
      } else {
        // Mode écouter & répéter : contributions audio avec voix humaine en priorité
        try {
          const { data } = await audioContribAPI.getPracticeWords(lang.code, {
            limit: 10,
            genreVoix: agent?.gender || undefined,
          });
          if (data.words && data.words.length > 0) {
            wordsToLoad = data.words;
          }
        } catch (_) {}

        if (wordsToLoad.length === 0) {
          // Fallback : dictionnaire de la langue + TTS
          const { data: dictData } = await dictionaryAPI.get(lang.code, { limit: 10 });
          const entries = dictData.data || dictData || [];
          wordsToLoad = entries.slice(0, 10).map(e => ({
            id: e.id,
            mot: e.mot,
            traduction: e.traduction,
            transcription: e.transcription,
            audioUrl: e.audioUrl || null,
          }));
          useFallback = true;
        }
      }

      if (wordsToLoad.length === 0) {
        Alert.alert('Pas encore de contenu',
          `Aucun mot disponible en ${lang.nom} pour l'instant. Revenez bientôt !`);
        return;
      }

      setWords(wordsToLoad);
      setIsFallbackMode(useFallback);
      setCurrentIndex(0);
      setFreeRecordingUri(null);
      setFreeContribCount(0);
      setStep('practice');
    } catch (_) {
      Alert.alert('Erreur', 'Impossible de charger les mots de pratique.');
    } finally {
      setLoading(false);
    }
  }, [agent, mode]);

  // ── Voix TTS du tuteur ──
  const speakWithTutorVoice = (text) => {
    if (!text || !agent) return;
    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(text, {
      language: agent.voice.language,
      pitch:    agent.voice.pitch,
      rate:     agent.voice.rate,
      onDone:    () => setIsSpeaking(false),
      onError:   () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const playCurrentWord = () => {
    const word = words[currentIndex];
    if (!word) return;
    stopPlayback();
    if (word.audioUrl) {
      try {
        setIsSpeaking(true);
        const player = createAudioPlayer({ uri: word.audioUrl });
        soundRef.current = player;
        player.play();
        const check = setInterval(() => {
          if (!player.playing) {
            clearInterval(check);
            setIsSpeaking(false);
            player.remove();
            soundRef.current = null;
          }
        }, 300);
      } catch (_) {
        setIsSpeaking(false);
        speakWithTutorVoice(word.mot);
      }
    } else {
      speakWithTutorVoice(word.mot);
    }
  };

  const stopPlayback = () => {
    Speech.stop();
    if (soundRef.current) {
      try { soundRef.current.remove(); } catch (_) {}
      soundRef.current = null;
    }
    setIsSpeaking(false);
  };

  // ── Soumettre un enregistrement libre comme contribution ──
  const submitFreeRecording = async (uri) => {
    const word = words[currentIndex];
    if (!uri || !word || !selectedLang) return;
    setFreeIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri,
        name: `contrib_${word.mot}_${Date.now()}.m4a`,
        type: 'audio/m4a',
      });
      formData.append('mot', word.mot);
      formData.append('traduction', word.traduction || '');
      formData.append('languageId', selectedLang.id);
      formData.append('langCode', selectedLang.code);

      await audioContribAPI.create(formData);
      setFreeContribCount(c => c + 1);
      setFreeRecordingUri(null);

      if (currentIndex < words.length - 1) {
        setCurrentIndex(i => i + 1);
        setShowTranslation(false);
      } else {
        finishSession();
      }
    } catch (_) {
      Alert.alert('Erreur', 'Impossible d\'envoyer l\'enregistrement. Vérifiez votre connexion.');
    } finally {
      setFreeIsSubmitting(false);
    }
  };

  // ── Réécouter l'enregistrement libre ──
  const playRecording = (uri) => {
    try {
      const player = createAudioPlayer({ uri });
      player.play();
      setTimeout(() => { try { player.remove(); } catch (_) {} }, 15000);
    } catch (_) {}
  };

  // ── Chat avec l'agent ──
  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || !selectedLang || !agent) return;
    const userMsg = { role: 'user', text };
    setChatHistory(h => [...h, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const { data } = await agentChatAPI.ask({
        message: text,
        langCode: selectedLang.code,
        agentName: agent.name,
        agentGender: agent.gender,
      });
      const agentMsg = {
        role: 'agent', text: data.response, audioUrl: data.audioUrl,
        mot: data.mot, traduction: data.traduction,
        source: data.source, estVoixOfficielle: data.estVoixOfficielle,
      };
      setChatHistory(h => [...h, agentMsg]);
      if (data.audioUrl) {
        try {
          const player = createAudioPlayer({ uri: data.audioUrl });
          player.play();
          setTimeout(() => { try { player.remove(); } catch (_) {} }, 8000);
        } catch (_) { speakWithTutorVoice(data.response); }
      } else {
        speakWithTutorVoice(data.response);
      }
    } catch (_) {
      setChatHistory(h => [...h, { role: 'agent', text: 'Désolé, je n\'ai pas pu répondre.', source: 'error' }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const nextWord = (correct = true) => {
    stopPlayback();
    setSessionStats(s => ({ practiced: s.practiced + 1, correct: s.correct + (correct ? 1 : 0) }));
    setShowTranslation(false);
    setHasRecorded(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    try {
      await audioContribAPI.saveSession({
        languageId: selectedLang.id, mode,
        wordsCount: mode === 'free_speak' ? freeContribCount : sessionStats.practiced + 1,
        correctCount: mode === 'free_speak' ? freeContribCount : sessionStats.correct + 1,
        duration,
      });
    } catch (_) {}

    const isFree = mode === 'free_speak';
    Alert.alert(
      '🎉 Session terminée !',
      isFree
        ? `Merci pour vos ${freeContribCount} contribution(s) en ${selectedLang.nom} !\nVotre voix aide l'IA à apprendre.`
        : `Vous avez pratiqué ${sessionStats.practiced + 1} mot(s) en ${selectedLang.nom}.\nBravo, continuez comme ça !`,
      [
        { text: 'Nouvelle session', onPress: () => { setStep('select_agent'); setSessionStats({ practiced: 0, correct: 0 }); } },
        { text: 'Quitter', onPress: () => navigation.goBack() },
      ]
    );
  };

  // ==================== ÉCRAN SÉLECTION AGENT ====================
  if (step === 'select_agent') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Choisissez votre tuteur IA</Text>
        <Text style={styles.subtitle}>Votre agent vous guidera dans la prononciation des langues ivoiriennes</Text>

        {Object.entries(AGENTS).map(([key, ag]) => (
          <TouchableOpacity key={key} style={styles.agentCard} activeOpacity={0.8}
            onPress={() => {
              setAgent(ag);
              setStep('select_lang');
              Speech.stop();
              Speech.speak(ag.greeting, { language: ag.voice.language, pitch: ag.voice.pitch, rate: ag.voice.rate });
            }}>
            <Image source={{ uri: ag.image }} style={styles.agentAvatarImg} />
            <View style={styles.agentInfo}>
              <View style={styles.agentNameRow}>
                <Text style={styles.agentName}>{ag.name}</Text>
                <View style={[styles.genderBadge, { backgroundColor: ag.gender === 'F' ? '#FCE7F3' : '#DBEAFE' }]}>
                  <Text style={{ fontSize: 12, color: ag.gender === 'F' ? '#DB2777' : '#2563EB' }}>
                    {ag.gender === 'F' ? '♀' : '♂'}
                  </Text>
                </View>
              </View>
              <Text style={styles.agentPersonality}>{ag.personality}</Text>
              <Text style={styles.agentCta}>Pratiquer avec {ag.name} →</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[styles.title, { marginTop: 24 }]}>Mode de pratique</Text>
        {MODES.map(m => (
          <TouchableOpacity key={m.key}
            style={[styles.modeCard, mode === m.key && styles.modeCardActive]}
            onPress={() => setMode(m.key)}>
            <Ionicons name={m.icon} size={24} color={mode === m.key ? '#fff' : COLORS.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.modeLabel, mode === m.key && { color: '#fff' }]}>{m.label}</Text>
              <Text style={[styles.modeDesc, mode === m.key && { color: 'rgba(255,255,255,0.8)' }]}>{m.desc}</Text>
            </View>
            {mode === m.key && <Ionicons name="checkmark-circle" size={22} color="#fff" />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // ==================== ÉCRAN SÉLECTION LANGUE ====================
  if (step === 'select_lang') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={agent.gradient} style={styles.agentBanner}>
          <Image source={{ uri: agent.image }} style={styles.agentBannerImg} />
          <Text style={styles.agentBannerName}>{agent.name}</Text>
          <Text style={styles.agentBannerText}>{agent.greeting}</Text>
        </LinearGradient>

        <Text style={[styles.title, { marginTop: 20 }]}>Quelle langue voulez-vous pratiquer ?</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.accent} size="large" style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.langGrid}>
            {languages.map(lang => (
              <TouchableOpacity key={lang.id} style={styles.langCard} activeOpacity={0.7}
                onPress={() => { setSelectedLang(lang); loadPracticeWords(lang); }}>
                <LinearGradient colors={[COLORS.primary, '#1a5c45']} style={styles.langIcon}>
                  <Text style={styles.langEmoji}>{lang.imageDrapeau || '🇨🇮'}</Text>
                </LinearGradient>
                <Text style={styles.langName}>{lang.nom}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.backBtn} onPress={() => setStep('select_agent')}>
          <Ionicons name="arrow-back" size={18} color="#666" />
          <Text style={styles.backBtnText}>Changer de tuteur</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ==================== ÉCRAN PRATIQUE ====================
  const currentWord = words[currentIndex];

  // ── En-tête commun aux deux modes ──
  const PracticeHeader = ({ subtitle }) => (
    <LinearGradient colors={agent.gradient} style={styles.practiceHeader}>
      <View style={styles.practiceHeaderRow}>
        <Image source={{ uri: agent.image }} style={styles.practiceAvatarImg} />
        <View style={{ flex: 1 }}>
          <Text style={styles.practiceAgentName}>{agent.name}</Text>
          <Text style={styles.practiceProgress}>{subtitle}</Text>
        </View>
        {mode === 'listen_repeat' && (
          <TouchableOpacity onPress={() => setShowChat(true)} style={[styles.closeBtn, { marginRight: 6 }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={finishSession} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, {
          width: `${((currentIndex + 1) / words.length) * 100}%`
        }]} />
      </View>
    </LinearGradient>
  );

  // ==================== VUE : PARLER LIBREMENT ====================
  if (mode === 'free_speak') {
    return (
      <View style={styles.container}>
        <PracticeHeader
          subtitle={`Contribution ${currentIndex + 1} / ${words.length} · ${selectedLang.nom}`}
        />

        <ScrollView contentContainerStyle={styles.practiceContent}>
          {/* Bannière mode contribution */}
          <View style={styles.contribBanner}>
            <Ionicons name="mic-circle" size={22} color={agent.color} />
            <Text style={styles.contribBannerText}>
              Prononcez le mot ci-dessous — votre voix enrichit la base de données Langues Ivoire
            </Text>
          </View>

          {/* Mot à enregistrer */}
          <Animated.View style={[styles.wordBubble, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.agentSays}>Enregistrez votre voix :</Text>
            <Text style={styles.wordText}>{currentWord?.mot}</Text>
            {currentWord?.transcription && (
              <Text style={styles.wordTranscription}>[{currentWord.transcription}]</Text>
            )}
            <View style={styles.translationBox}>
              <Ionicons name="language" size={16} color={COLORS.primary} />
              <Text style={styles.translationText}>{currentWord?.traduction}</Text>
            </View>
          </Animated.View>

          {/* Zone d'enregistrement */}
          <View style={styles.actionsSection}>
            <Text style={styles.stepLabel}>🎙️ Maintenez pour enregistrer</Text>
            <RecordButton
              onRecordingComplete={(uri) => { setFreeRecordingUri(uri); setHasRecorded(true); }}
              maxDuration={10}
              size={80}
              color={agent.color}
            />

            {freeRecordingUri && (
              <View style={styles.freeActionsRow}>
                {/* Réécouter */}
                <TouchableOpacity
                  style={[styles.freeActionBtn, { backgroundColor: '#555' }]}
                  onPress={() => playRecording(freeRecordingUri)}>
                  <Ionicons name="play-circle-outline" size={20} color="#fff" />
                  <Text style={styles.freeActionBtnText}>Réécouter</Text>
                </TouchableOpacity>

                {/* Soumettre */}
                <TouchableOpacity
                  style={[styles.freeActionBtn, { backgroundColor: agent.color }]}
                  onPress={() => submitFreeRecording(freeRecordingUri)}
                  disabled={freeIsSubmitting}>
                  {freeIsSubmitting
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <>
                        <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                        <Text style={styles.freeActionBtnText}>Contribuer</Text>
                      </>
                  }
                </TouchableOpacity>
              </View>
            )}

            {!freeRecordingUri && !hasRecorded && (
              <Text style={styles.freeHint}>
                Maintenez le bouton et prononcez le mot clairement
              </Text>
            )}
          </View>

          {/* Compteur contributions */}
          {freeContribCount > 0 && (
            <View style={styles.contribCounter}>
              <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
              <Text style={styles.contribCounterText}>
                {freeContribCount} contribution{freeContribCount > 1 ? 's' : ''} cette session — Merci ! 🙏
              </Text>
            </View>
          )}

          {/* Navigation */}
          <View style={[styles.navRow, { marginTop: 20 }]}>
            <TouchableOpacity
              style={[styles.navBtn, styles.navBtnSkip]}
              onPress={() => { setFreeRecordingUri(null); setHasRecorded(false); nextWord(false); }}>
              <Ionicons name="play-skip-forward" size={18} color="#666" />
              <Text style={styles.navBtnSkipText}>Passer ce mot</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ==================== VUE : ÉCOUTER & RÉPÉTER ====================
  return (
    <View style={styles.container}>
      <PracticeHeader
        subtitle={`Mot ${currentIndex + 1} / ${words.length} · ${selectedLang.nom}`}
      />

      <ScrollView contentContainerStyle={styles.practiceContent}>
        {/* Bannière fallback dictionnaire */}
        {isFallbackMode && (
          <View style={styles.fallbackBanner}>
            <Ionicons name="information-circle-outline" size={18} color="#d97706" />
            <Text style={styles.fallbackBannerText}>
              Aucun enregistrement humain disponible pour cette langue — {agent.name} lit les mots (TTS approximatif)
            </Text>
          </View>
        )}

        {/* Bulle mot */}
        <Animated.View style={[styles.wordBubble, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.agentSays}>{agent.name} dit :</Text>
          <Text style={styles.wordText}>{currentWord?.mot}</Text>
          {currentWord?.transcription && (
            <Text style={styles.wordTranscription}>[{currentWord.transcription}]</Text>
          )}
          {showTranslation ? (
            <View style={styles.translationBox}>
              <Ionicons name="language" size={16} color={COLORS.primary} />
              <Text style={styles.translationText}>{currentWord?.traduction}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.showTransBtn} onPress={() => setShowTranslation(true)}>
              <Ionicons name="eye-outline" size={16} color="#999" />
              <Text style={styles.showTransText}>Voir la traduction</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Écouter */}
        <View style={styles.actionsSection}>
          <Text style={styles.stepLabel}>1. Écoutez</Text>
          <TouchableOpacity
            style={[styles.listenBtn, { backgroundColor: isSpeaking ? '#555' : agent.color }]}
            onPress={isSpeaking ? stopPlayback : playCurrentWord}
            activeOpacity={0.8}>
            <Ionicons name={isSpeaking ? 'stop-circle' : 'volume-high'} size={28} color="#fff" />
            <Text style={styles.listenBtnText}>
              {isSpeaking
                ? 'Appuyer pour arrêter'
                : hasAudio
                  ? '🎙️ Écouter la vraie prononciation'
                  : `🔊 Écouter ${agent.name} (TTS)`
              }
            </Text>
          </TouchableOpacity>
          <View style={styles.audioSourceRow}>
            <Ionicons
              name={hasAudio
                ? (words[currentIndex]?.estVoixOfficielle ? 'star' : 'checkmark-circle')
                : 'warning-outline'}
              size={14}
              color={hasAudio ? (words[currentIndex]?.estVoixOfficielle ? '#7c3aed' : '#16a34a') : '#d97706'}
            />
            <Text style={[styles.audioSourceText, {
              color: hasAudio ? (words[currentIndex]?.estVoixOfficielle ? '#7c3aed' : '#16a34a') : '#d97706',
            }]}>
              {hasAudio
                ? words[currentIndex]?.estVoixOfficielle
                  ? `Voix officielle — locuteur professionnel ${words[currentIndex]?.genreVoix === 'F' ? '♀' : words[currentIndex]?.genreVoix === 'M' ? '♂' : ''}`
                  : 'Prononciation authentique — enregistrement humain validé'
                : `Synthèse vocale (approximative) — aidez-nous en contribuant votre voix !`
              }
            </Text>
          </View>
        </View>

        {/* Répéter */}
        <View style={styles.actionsSection}>
          <Text style={styles.stepLabel}>2. Répétez</Text>
          <RecordButton
            onRecordingComplete={() => setHasRecorded(true)}
            maxDuration={10}
            size={70}
            color={agent.color}
          />
          {hasRecorded && (
            <View style={styles.recordedFeedback}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.recordedText}>Enregistrement capturé !</Text>
            </View>
          )}
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <TouchableOpacity style={[styles.navBtn, styles.navBtnSkip]} onPress={() => nextWord(false)}>
            <Ionicons name="play-skip-forward" size={18} color="#666" />
            <Text style={styles.navBtnSkipText}>Passer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnNext, { backgroundColor: agent.color }]}
            onPress={() => nextWord(true)}>
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.navBtnNextText}>
              {currentIndex < words.length - 1 ? 'Suivant' : 'Terminer'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── MODAL CHAT ── */}
      <Modal visible={showChat} animationType="slide" transparent onRequestClose={() => setShowChat(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chatOverlay}>
          <View style={styles.chatContainer}>
            <LinearGradient colors={agent.gradient} style={styles.chatHeader}>
              <Image source={{ uri: agent.image }} style={styles.chatAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.chatAgentName}>{agent.name}</Text>
                <Text style={styles.chatSubtitle}>Posez-moi une question sur le {selectedLang?.nom}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowChat(false)} style={styles.chatCloseBtn}>
                <Ionicons name="chevron-down" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView ref={chatScrollRef} style={styles.chatMessages}
              contentContainerStyle={{ padding: 16, gap: 12 }}
              onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}>
              {chatHistory.length === 0 && (
                <View style={[styles.chatBubble, styles.chatBubbleAgent]}>
                  <Text style={styles.chatBubbleText}>
                    Bonjour ! Je suis {agent.name}. Demandez-moi la traduction d'un mot en {selectedLang?.nom}. Par exemple : "Comment dit-on 'merci' ?"
                  </Text>
                </View>
              )}
              {chatHistory.map((msg, i) => (
                <View key={i} style={[styles.chatBubble, msg.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleAgent]}>
                  <Text style={[styles.chatBubbleText, msg.role === 'user' && { color: '#fff' }]}>{msg.text}</Text>
                  {msg.role === 'agent' && msg.source && (
                    <View style={styles.chatSourceRow}>
                      {msg.source === 'ai' && <Text style={styles.chatSourceBadge}>🤖 Réponse IA</Text>}
                      {msg.source === 'database' && msg.estVoixOfficielle && <Text style={[styles.chatSourceBadge, { color: '#7c3aed' }]}>⭐ Voix officielle</Text>}
                      {msg.source === 'database' && !msg.estVoixOfficielle && <Text style={[styles.chatSourceBadge, { color: '#16a34a' }]}>✓ Base de données</Text>}
                      {msg.audioUrl && (
                        <TouchableOpacity onPress={() => {
                          try {
                            const p = createAudioPlayer({ uri: msg.audioUrl });
                            p.play();
                            setTimeout(() => { try { p.remove(); } catch (_) {} }, 8000);
                          } catch (_) {}
                        }} style={styles.chatPlayBtn}>
                          <Ionicons name="volume-high" size={14} color="#fff" />
                          <Text style={styles.chatPlayBtnText}>Écouter</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              ))}
              {chatLoading && (
                <View style={[styles.chatBubble, styles.chatBubbleAgent]}>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={agent.color} />
                    <Text style={[styles.chatBubbleText, { color: '#999' }]}>{agent.name} réfléchit…</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput style={styles.chatTextInput} value={chatInput} onChangeText={setChatInput}
                placeholder={`Demandez à ${agent.name}…`} placeholderTextColor="#999"
                multiline maxLength={200} onSubmitEditing={sendChatMessage} returnKeyType="send" />
              <TouchableOpacity
                style={[styles.chatSendBtn, { backgroundColor: chatInput.trim() ? agent.color : '#e5e7eb' }]}
                onPress={sendChatMessage} disabled={!chatInput.trim() || chatLoading}>
                <Ionicons name="send" size={20} color={chatInput.trim() ? '#fff' : '#9ca3af'} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 20, paddingBottom: 40 },

  title:    { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },

  // Agents
  agentCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 16,
    marginBottom: 14, gap: 14, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  agentAvatarImg:  { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  agentInfo:       { flex: 1 },
  agentNameRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  agentName:       { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  genderBadge:     { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  agentPersonality:{ fontSize: 13, color: '#666', marginTop: 4, lineHeight: 18 },
  agentCta:        { fontSize: 13, fontWeight: '600', color: COLORS.accent, marginTop: 6 },

  // Modes
  modeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1.5, borderColor: '#e0e0e0',
  },
  modeCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  modeLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  modeDesc:  { fontSize: 12, color: '#888', marginTop: 2 },

  // Lang
  agentBanner:    { borderRadius: 20, padding: 20, alignItems: 'center' },
  agentBannerImg: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  agentBannerName:{ fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  agentBannerText:{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6, textAlign: 'center', lineHeight: 20 },
  langGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  langCard:   { width: '30%', backgroundColor: '#fff', borderRadius: 16, padding: 14, alignItems: 'center',
                shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  langIcon:   { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  langEmoji:  { fontSize: 22 },
  langName:   { fontSize: 12, fontWeight: '600', color: COLORS.text, marginTop: 8, textAlign: 'center' },
  backBtn:    { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', marginTop: 24 },
  backBtnText:{ fontSize: 14, color: '#666' },

  // Practice header
  practiceHeader:    { paddingTop: 12, paddingBottom: 16, paddingHorizontal: 16 },
  practiceHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  practiceAvatarImg: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  practiceAgentName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  practiceProgress:  { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  closeBtn:          { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16 },
  progressBar:       { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 12 },
  progressFill:      { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  practiceContent:   { padding: 20, alignItems: 'center', paddingBottom: 40 },

  // Banners
  fallbackBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12,
    marginBottom: 16, width: '100%',
  },
  fallbackBannerText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 18 },
  contribBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#F0FDF4', borderRadius: 12, padding: 12,
    marginBottom: 16, width: '100%', borderWidth: 1, borderColor: '#86EFAC',
  },
  contribBannerText: { flex: 1, fontSize: 12, color: '#166534', lineHeight: 18 },

  // Mot
  wordBubble: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%',
    alignItems: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  agentSays:        { fontSize: 13, color: '#999', marginBottom: 8 },
  wordText:         { fontSize: 32, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  wordTranscription:{ fontSize: 16, color: '#888', fontStyle: 'italic', marginTop: 4 },
  translationBox:   { flexDirection: 'row', alignItems: 'center', gap: 6,
                      backgroundColor: '#E8F5E9', borderRadius: 12, padding: 10, marginTop: 14 },
  translationText:  { fontSize: 15, color: COLORS.primary, fontWeight: '500' },
  showTransBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 14 },
  showTransText:    { fontSize: 13, color: '#999' },

  // Actions
  actionsSection: { alignItems: 'center', marginBottom: 24, width: '100%' },
  stepLabel:      { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  listenBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30,
  },
  listenBtnText:   { fontSize: 15, fontWeight: '600', color: '#fff' },
  audioSourceRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8, paddingHorizontal: 12 },
  audioSourceText: { fontSize: 11, lineHeight: 16, flex: 1 },

  recordedFeedback:{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  recordedText:    { fontSize: 14, color: '#4CAF50', fontWeight: '600' },

  // Free speak
  freeActionsRow: {
    flexDirection: 'row', gap: 12, marginTop: 20, width: '100%',
  },
  freeActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 16,
  },
  freeActionBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  freeHint:   { fontSize: 12, color: '#999', marginTop: 12, textAlign: 'center' },
  contribCounter: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F0FDF4', borderRadius: 12, padding: 10,
    marginTop: 4, width: '100%', justifyContent: 'center',
  },
  contribCounterText: { fontSize: 13, color: '#166534', fontWeight: '600' },

  // Navigation
  navRow:         { flexDirection: 'row', gap: 12, width: '100%' },
  navBtn:         { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: 8, paddingVertical: 16, borderRadius: 16 },
  navBtnSkip:     { backgroundColor: '#F0F0F0' },
  navBtnSkipText: { fontSize: 15, fontWeight: '600', color: '#666' },
  navBtnNext:     {},
  navBtnNextText: { fontSize: 15, fontWeight: '600', color: '#fff' },

  // Chat
  chatOverlay:    { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  chatContainer:  { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
                    maxHeight: '85%', overflow: 'hidden' },
  chatHeader:     { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  chatAvatar:     { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  chatAgentName:  { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  chatSubtitle:   { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  chatCloseBtn:   { padding: 4 },
  chatMessages:   { maxHeight: 380 },
  chatBubble:     { maxWidth: '80%', borderRadius: 18, padding: 12,
                    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  chatBubbleUser: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  chatBubbleAgent:{ alignSelf: 'flex-start', backgroundColor: '#F3F4F6', borderBottomLeftRadius: 4 },
  chatBubbleText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  chatSourceRow:  { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chatSourceBadge:{ fontSize: 11, color: '#6B7280' },
  chatPlayBtn:    { flexDirection: 'row', alignItems: 'center', gap: 4,
                    backgroundColor: COLORS.accent, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  chatPlayBtnText:{ fontSize: 11, color: '#fff', fontWeight: '600' },
  chatInputRow:   { flexDirection: 'row', alignItems: 'flex-end', gap: 10,
                    paddingHorizontal: 16, paddingVertical: 12,
                    borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff' },
  chatTextInput:  { flex: 1, borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 20,
                    paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: COLORS.text,
                    maxHeight: 100, backgroundColor: '#FAFAFA' },
  chatSendBtn:    { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
