import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { progressAPI } from '../services/api';
import { offlineLessonsAPI as lessonsAPI } from '../services/offlineApi';
import AudioButton from '../components/AudioButton';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

export default function LessonDetailScreen({ route, navigation }) {
  const { languageId, languageCode, languageName } = route.params;
  const insets = useSafeAreaInsets();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonSteps, setLessonSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [view, setView] = useState('list'); // 'list' | 'lesson'

  useEffect(() => {
    navigation.setOptions({ title: languageName });
    lessonsAPI.getByLanguage(languageCode)
      .then(({ data }) => setLessons(data))
      .catch(() => Alert.alert('Erreur', 'Impossible de charger les leçons.'))
      .finally(() => setLoading(false));
  }, []);

  const openLesson = async (lesson) => {
    try {
      const { data } = await lessonsAPI.getLesson(lesson.id);
      setActiveLesson(data);
      setLessonSteps(data.steps || []);
      setCurrentStep(0);
      setView('lesson');
    } catch {
      Alert.alert('Erreur', 'Impossible de charger la leçon.');
    }
  };

  const completeLesson = async () => {
    try {
      const { data } = await progressAPI.completeLesson(activeLesson.id, { score: 100 });
      Alert.alert(
        'Félicitations ! 🎉',
        `Leçon terminée !\n+${activeLesson.pointsXp} XP gagnés\nStreak : ${data.streak} jours`,
        [{ text: 'OK', onPress: () => { setView('list'); setActiveLesson(null); } }]
      );
    } catch {
      setView('list');
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={COLORS.accent} size="large" />;

  // Vue LEÇON active
  if (view === 'lesson' && activeLesson) {
    const step = lessonSteps[currentStep];
    const isLast = currentStep === lessonSteps.length - 1;

    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        {/* Barre de progression */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentStep + 1) / lessonSteps.length) * 100}%` }]} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
          <Text style={styles.stepIndicator}>Étape {currentStep + 1} / {lessonSteps.length}</Text>
          <Text style={styles.stepType}>{step?.type?.replace('_', ' ') || 'Contenu'}</Text>

          {/* Contenu de l'étape */}
          <View style={styles.stepCard}>
            {step?.contenu?.titre && <Text style={styles.stepTitle}>{step.contenu.titre}</Text>}

            {step?.contenu?.mots && step.contenu.mots.map((mot, i) => (
              <View key={i} style={styles.vocabRow}>
                <View style={styles.vocabRowLeft}>
                  <Text style={styles.vocabMot}>{mot.mot}</Text>
                  {mot.transcription ? <Text style={styles.vocabPhon}>[{mot.transcription}]</Text> : null}
                  <Text style={styles.vocabTrad}>{mot.traduction}</Text>
                </View>
                {/* Boutons audio : langue locale + français */}
                <View style={styles.vocabAudioCol}>
                  <AudioButton
                    audioUrl={mot.audioUrl}
                    text={mot.mot}
                    langCode={languageCode}
                    size={18}
                  />
                  {mot.traduction ? (
                    <AudioButton
                      text={mot.traduction}
                      langCode="fr"
                      size={18}
                      color="#0B3D2E"
                    />
                  ) : null}
                </View>
              </View>
            ))}

            {step?.contenu?.texte && (
              <Text style={styles.stepText}>{step.contenu.texte}</Text>
            )}

            {/* Exercices */}
            {step?.exercises?.map((ex, i) => (
              <ExerciseCard key={i} exercise={ex} />
            ))}
          </View>
        </ScrollView>

        <View style={[styles.navButtons, { paddingBottom: insets.bottom + 16 }]}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.btnSecondary} onPress={() => setCurrentStep(s => s - 1)}>
              <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
              <Text style={styles.btnSecondaryText}>Précédent</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.btnPrimary, currentStep === 0 && { flex: 1 }]}
            onPress={isLast ? completeLesson : () => setCurrentStep(s => s + 1)}
          >
            <Text style={styles.btnPrimaryText}>{isLast ? 'Terminer ✓' : 'Suivant'}</Text>
            {!isLast && <Ionicons name="arrow-forward" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Vue LISTE des leçons
  const byLevel = lessons.reduce((acc, l) => {
    if (!acc[l.niveau]) acc[l.niveau] = [];
    acc[l.niveau].push(l);
    return acc;
  }, {});

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 16 }}>
      {Object.entries(byLevel).map(([niveau, items]) => (
        <View key={niveau} style={{ marginBottom: 20 }}>
          <Text style={styles.levelHeader}>Niveau {niveau}</Text>
          {items.map(lesson => {
            const done = lesson.progress?.statut === 'completed';
            return (
              <TouchableOpacity key={lesson.id} style={[styles.lessonCard, done && styles.lessonDone]}
                onPress={() => openLesson(lesson)}>
                <View style={styles.lessonLeft}>
                  <View style={[styles.lessonIcon, done && { backgroundColor: '#4CAF50' }]}>
                    <Ionicons name={done ? 'checkmark' : 'play'} size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.lessonTitle}>{lesson.titre}</Text>
                    <Text style={styles.lessonMeta}>{lesson._count?.steps ?? 0} étapes · {lesson.pointsXp} XP</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#ccc" />
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const ExerciseCard = ({ exercise }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const choix = exercise.donnees?.choix || [];
  const correct = exercise.solution?.reponse;

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.exQuestion}>{exercise.donnees?.question}</Text>
      {choix.map((c, i) => {
        let bg = '#F5F5F5';
        if (submitted) {
          if (c === correct) bg = '#E8F5E9';
          else if (c === selected) bg = '#FFEBEE';
        } else if (c === selected) bg = '#E3F2FD';
        return (
          <TouchableOpacity key={i} style={[styles.choixBtn, { backgroundColor: bg }]}
            onPress={() => !submitted && setSelected(c)}>
            <Text style={styles.choixText}>{c}</Text>
          </TouchableOpacity>
        );
      })}
      {!submitted && selected && (
        <TouchableOpacity style={styles.submitBtn} onPress={() => setSubmitted(true)}>
          <Text style={styles.submitBtnText}>Valider</Text>
        </TouchableOpacity>
      )}
      {submitted && exercise.explication && (
        <Text style={styles.explication}>{exercise.explication}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: { height: 4, backgroundColor: '#E0E0E0' },
  progressFill: { height: 4, backgroundColor: COLORS.accent },
  stepIndicator: { fontSize: 12, color: '#999', textAlign: 'center', marginBottom: 4 },
  stepType: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 16, textTransform: 'capitalize' },
  stepCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20,
              shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  stepTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 16 },
  vocabRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
              paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  vocabRowLeft: { flex: 1, marginRight: 10 },
  vocabAudioCol: { flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 2 },
  vocabMot: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  vocabPhon: { fontSize: 13, color: '#888', fontStyle: 'italic' },
  vocabTrad: { fontSize: 15, color: '#444', marginTop: 2 },
  stepText: { fontSize: 15, lineHeight: 24, color: '#333' },
  navButtons: { flexDirection: 'row', paddingTop: 16, paddingHorizontal: 16, gap: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  btnPrimary: { flex: 1, backgroundColor: COLORS.accent, borderRadius: 12,
                paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16,
                  borderRadius: 12, borderWidth: 1, borderColor: COLORS.primary, paddingVertical: 14 },
  btnSecondaryText: { color: COLORS.primary, fontWeight: '600' },
  levelHeader: { fontSize: 16, fontWeight: 'bold', color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  lessonCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
                shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  lessonDone: { borderLeftWidth: 3, borderLeftColor: '#4CAF50' },
  lessonLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  lessonIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.accent,
                justifyContent: 'center', alignItems: 'center' },
  lessonTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  lessonMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  exQuestion: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 },
  choixBtn: { borderRadius: 10, padding: 14, marginBottom: 8 },
  choixText: { fontSize: 15, color: '#1A1A1A' },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontWeight: 'bold' },
  explication: { fontSize: 13, color: '#555', fontStyle: 'italic', marginTop: 8, lineHeight: 20 },
});
