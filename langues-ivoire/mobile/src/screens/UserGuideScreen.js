import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8', yellow: '#FFF3CD' };

// ─── Données du guide ────────────────────────────────────────────────────────
const MODULES = [
  {
    id: 1,
    icon: 'person-add-outline',
    color: '#1565C0',
    title: 'Inscription et Connexion',
    sections: [
      {
        subtitle: '1.1 Créer un compte',
        content: [
          '1. Ouvrez l\'application.',
          '2. Appuyez sur « S\'inscrire ».',
          '3. Remplissez : Prénom, Nom, E-mail, Mot de passe (min. 8 caractères).',
          '4. Appuyez sur « Créer mon compte ».',
          '5. Vous êtes automatiquement connecté.',
        ],
        tip: 'Choisissez un mot de passe sécurisé. Votre e-mail servira d\'identifiant unique.',
      },
      {
        subtitle: '1.2 Se connecter',
        content: [
          '1. Appuyez sur « Se connecter ».',
          '2. Entrez votre e-mail et mot de passe.',
          '3. Appuyez sur « Connexion ».',
        ],
      },
      {
        subtitle: '1.3 Sécurité et sessions',
        content: [
          '• Session active 24 h, renouvelée automatiquement jusqu\'à 7 jours.',
          '• Après déconnexion, ressaisissez vos identifiants.',
        ],
      },
      {
        subtitle: '1.4 Modifier son profil',
        content: [
          '• Prénom, nom, téléphone.',
          '• Photo de profil (appuyez sur l\'avatar).',
          '• Niveau préféré, langues favorites, notifications.',
        ],
      },
      {
        subtitle: '1.5 Changer de mot de passe',
        content: [
          '1. Allez dans Profil → Paramètres → Changer le mot de passe.',
          '2. Entrez votre mot de passe actuel.',
          '3. Entrez et confirmez le nouveau (min. 8 caractères).',
          '4. Appuyez sur « Enregistrer ».',
        ],
      },
    ],
  },
  {
    id: 2,
    icon: 'home-outline',
    color: COLORS.primary,
    title: 'Écran d\'Accueil',
    sections: [
      {
        subtitle: 'Tableau de bord',
        content: [
          '• Bannière de bienvenue avec votre prénom.',
          '• Progression du jour : cours complétés, exercices réalisés.',
          '• Langues favorites : accès rapide.',
          '• Recommandations selon votre niveau.',
          '• Activité récente : dernières langues consultées.',
        ],
        tip: 'Consultez l\'accueil chaque jour pour suivre votre progression et découvrir de nouveaux contenus.',
      },
    ],
  },
  {
    id: 3,
    icon: 'book-outline',
    color: '#6A1B9A',
    title: 'Dictionnaire',
    sections: [
      {
        subtitle: '3.1 Rechercher un mot',
        content: [
          '1. Accédez à l\'onglet « Dictionnaire ».',
          '2. Tapez un mot en français ou dans la langue locale.',
          '3. Les résultats apparaissent en temps réel.',
        ],
      },
      {
        subtitle: '3.2 Fiche d\'un mot',
        content: [
          '• Mot en langue locale.',
          '• Traduction en français.',
          '• Prononciation phonétique.',
          '• Exemple de phrase.',
          '• Bouton audio (langue locale + français).',
          '• Catégorie grammaticale et niveau de difficulté.',
        ],
      },
      {
        subtitle: '3.3 Filtres',
        content: [
          '• Par langue (Dioula, Baoulé, Bété, Guéré, Agni, Nouchi).',
          '• Par catégorie grammaticale.',
          '• Par niveau (Débutant / Intermédiaire / Avancé).',
          '• Par thème (Salutations, Famille, Nourriture…).',
        ],
        tip: 'Le dictionnaire fonctionne partiellement hors ligne si vous avez déjà consulté des mots.',
      },
    ],
  },
  {
    id: 4,
    icon: 'school-outline',
    color: '#00695C',
    title: 'Leçons',
    sections: [
      {
        subtitle: '4.1 Sélectionner une langue',
        content: [
          '1. Appuyez sur « Leçons » dans la navigation.',
          '2. Sélectionnez une langue parmi les 6 disponibles.',
          '3. Choisissez un thème ou un niveau.',
        ],
      },
      {
        subtitle: '4.2 Structure d\'une leçon',
        content: [
          '• Introduction : contexte culturel et objectifs.',
          '• Vocabulaire : mots avec deux boutons audio.',
          '  – Bouton 1 : prononciation en langue locale.',
          '  – Bouton 2 : traduction en français.',
          '• Phrases exemples : usage en contexte.',
          '• Quiz de révision avec score.',
        ],
        tip: 'Pratiquez chaque leçon au moins 3 fois avant de passer à la suivante.',
      },
    ],
  },
  {
    id: 5,
    icon: 'warning-outline',
    color: '#C62828',
    title: 'SOS Phrases',
    sections: [
      {
        subtitle: 'Catégories disponibles',
        content: [
          '• Salutations et politesse.',
          '• Santé et urgences.',
          '• Transport et orientation.',
          '• Commerce et négociation.',
          '• Famille et relations sociales.',
          '• Nourriture et restaurant.',
          '• Administration et formalités.',
        ],
      },
      {
        subtitle: 'Utiliser une phrase SOS',
        content: [
          '1. Sélectionnez une catégorie.',
          '2. Parcourez les phrases.',
          '3. Appuyez sur le bouton audio pour entendre la prononciation.',
          '4. Appuyez sur la phrase pour voir la traduction complète.',
        ],
        tip: 'Enregistrez vos phrases préférées en favoris pour y accéder sans connexion.',
      },
    ],
  },
  {
    id: 6,
    icon: 'people-outline',
    color: COLORS.accent,
    title: 'Tuteurs IA',
    sections: [
      {
        subtitle: '6.1 Présentation',
        content: [
          '• 16 tuteurs virtuels aux personnalités distinctes.',
          '• Chaque tuteur : nom, spécialité culturelle, avatar portrait.',
          '• Styles pédagogiques variés : patient, dynamique, traditionnel…',
        ],
      },
      {
        subtitle: '6.2 Démarrer une session',
        content: [
          '1. Allez dans « Tuteurs ».',
          '2. Parcourez la liste et lisez les descriptions.',
          '3. Appuyez sur un tuteur pour démarrer.',
        ],
      },
      {
        subtitle: '6.3 Contenu d\'une session',
        content: [
          '• Accueil personnalisé en français et en langue locale.',
          '• Conversation guidée sur un thème.',
          '• Corrections et encouragements.',
          '• Nouvelles expressions en contexte.',
          '• Résumé de fin de session.',
        ],
        tip: 'Variez les tuteurs pour découvrir différents styles pédagogiques et accents régionaux.',
      },
    ],
  },
  {
    id: 7,
    icon: 'brush-outline',
    color: '#37474F',
    title: 'Nouchi',
    sections: [
      {
        subtitle: 'La langue des rues d\'Abidjan',
        content: [
          '• Mélange créatif de français, dioula, anglais et langues locales.',
          '• Largement parlé par la jeunesse ivoirienne.',
        ],
      },
      {
        subtitle: 'L\'écran Nouchi',
        content: [
          '• « Mot du Jour » avec définition.',
          '• Tuteur Nouchi spécialisé.',
          '• Dictionnaire Nouchi.',
          '• Expressions populaires par thème (fête, travail, amour…).',
        ],
        tip: 'Le Nouchi évolue rapidement ! L\'app est mise à jour avec les nouvelles expressions.',
      },
    ],
  },
  {
    id: 8,
    icon: 'git-branch-outline',
    color: '#4527A0',
    title: 'Conjugaison',
    sections: [
      {
        subtitle: 'Utiliser le conjugueur',
        content: [
          '1. Accédez à « Conjugaison » depuis le menu.',
          '2. Sélectionnez une langue.',
          '3. Entrez un verbe ou choisissez dans la liste.',
          '4. Sélectionnez le temps ou l\'aspect.',
          '5. Consultez toutes les formes conjuguées.',
        ],
      },
      {
        subtitle: 'Particularités linguistiques',
        content: [
          '• Les langues ivoiriennes s\'adaptent à leurs propres structures.',
          '• Aspect accompli / inaccompli.',
          '• Marqueurs temporels et variations tonales.',
        ],
      },
    ],
  },
  {
    id: 9,
    icon: 'mic-outline',
    color: '#1565C0',
    title: 'Pratique IA',
    sections: [
      {
        subtitle: 'Mode Écouter & Répéter',
        content: [
          '• Un mot ou phrase est joué en audio.',
          '• Vous répétez à voix haute.',
          '• L\'application analyse votre prononciation.',
          '• Feedback immédiat : correct / à améliorer.',
          '• Navigation : mot précédent / suivant.',
        ],
      },
      {
        subtitle: 'Mode Parler librement',
        content: [
          '• Vous voyez un mot du dictionnaire.',
          '• Vous enregistrez librement votre prononciation.',
          '• Bouton « Réécouter » pour vérifier.',
          '• Bouton « Contribuer » pour soumettre.',
          '• Compteur de contributions de la session.',
        ],
        tip: 'Vos enregistrements enrichissent la base communautaire. Plus vous contribuez, meilleures sont les ressources pour tous !',
      },
      {
        subtitle: 'Conseils pour bien pratiquer',
        content: [
          '• Enregistrez-vous dans un endroit calme.',
          '• Tenez le téléphone à 15-20 cm de la bouche.',
          '• Parlez clairement et naturellement.',
          '• Pratiquez 10 à 15 minutes par jour.',
        ],
      },
    ],
  },
  {
    id: 10,
    icon: 'earth-outline',
    color: '#2E7D32',
    title: 'Contenu Culturel',
    sections: [
      {
        subtitle: 'Ce que vous trouverez',
        content: [
          '• Articles sur les traditions et coutumes.',
          '• Proverbes avec traduction et contexte.',
          '• Histoire des langues et des peuples.',
          '• Fiches sur les grandes régions culturelles.',
          '• Fêtes, gastronomie, musique, artisanat.',
        ],
      },
    ],
  },
  {
    id: 11,
    icon: 'add-circle-outline',
    color: '#E65100',
    title: 'Contribuer',
    sections: [
      {
        subtitle: 'Types de contributions',
        content: [
          '• Enregistrements audio : prononcez des mots.',
          '• Corrections : signalez une erreur.',
          '• Nouvelles entrées : proposez un mot manquant.',
          '• Évaluation : notez les enregistrements existants.',
        ],
      },
      {
        subtitle: 'Contribuer un enregistrement',
        content: [
          '1. Depuis le Dictionnaire, ouvrez la fiche d\'un mot.',
          '2. Appuyez sur « Contribuer un audio ».',
          '3. Autorisez le microphone.',
          '4. Enregistrez votre prononciation.',
          '5. Réécoutez puis appuyez sur « Soumettre ».',
        ],
        tip: 'Votre aide est précieuse pour préserver et valoriser les langues ivoiriennes !',
      },
    ],
  },
  {
    id: 12,
    icon: 'settings-outline',
    color: '#555',
    title: 'Profil et Paramètres',
    sections: [
      {
        subtitle: 'Informations personnelles',
        content: [
          '• Prénom, nom, téléphone, date de naissance.',
          '• Photo de profil : appuyez sur l\'avatar pour choisir une image.',
        ],
      },
      {
        subtitle: 'Préférences d\'apprentissage',
        content: [
          '• Niveau préféré : Débutant / Intermédiaire / Avancé.',
          '• Langues favorites (jusqu\'à 3).',
          '• Tuteur préféré parmi les 16 disponibles.',
          '• Rappels quotidiens et alertes de série.',
        ],
      },
      {
        subtitle: 'Compte Premium',
        content: [
          '• Accès illimité à tous les tuteurs IA.',
          '• Téléchargement hors ligne des leçons.',
          '• Statistiques avancées de progression.',
          '• Accès prioritaire aux nouveaux contenus.',
        ],
      },
    ],
  },
  {
    id: 13,
    icon: 'navigate-outline',
    color: COLORS.primary,
    title: 'Navigation',
    sections: [
      {
        subtitle: 'Barre principale (5 onglets)',
        content: [
          '• Accueil — tableau de bord.',
          '• Langues — sélection et leçons.',
          '• Vidéos — contenus vidéo.',
          '• Dictionnaire — recherche de mots.',
          '• Profil — paramètres et progression.',
        ],
      },
      {
        subtitle: 'Autres sections',
        content: [
          '• Tuteurs : depuis l\'accueil.',
          '• Nouchi : section spéciale depuis l\'accueil.',
          '• SOS Phrases : depuis l\'accueil.',
          '• Contribuer : depuis les fiches du dictionnaire.',
          '• Flèche retour ← ou bouton retour Android pour revenir.',
        ],
      },
    ],
  },
];

const FAQ = [
  {
    q: 'L\'application fonctionne-t-elle hors ligne ?',
    a: 'Le dictionnaire et certaines leçons sont accessibles partiellement hors ligne après une première consultation. Les tuteurs IA et la pratique avancée nécessitent une connexion.',
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: 'Oui. Vos données sont chiffrées et stockées de manière sécurisée. Les mots de passe ne sont jamais stockés en clair.',
  },
  {
    q: 'L\'application est-elle gratuite ?',
    a: 'L\'application est gratuite avec un accès de base. Un abonnement Premium débloque toutes les fonctionnalités.',
  },
  {
    q: 'Comment signaler un bug ?',
    a: 'Utilisez la section « Feedback » dans le profil, ou contactez : support@langues-ivoire.com.',
  },
  {
    q: 'Puis-je utiliser plusieurs langues en même temps ?',
    a: 'Oui, vous pouvez basculer entre les langues à tout moment depuis le dictionnaire et les leçons.',
  },
];

// ─── Composants ──────────────────────────────────────────────────────────────

function TipBox({ text }) {
  return (
    <View style={styles.tipBox}>
      <Ionicons name="bulb-outline" size={16} color="#7B4F00" style={{ marginTop: 1 }} />
      <Text style={styles.tipText}><Text style={{ fontWeight: '700' }}>Conseil : </Text>{text}</Text>
    </View>
  );
}

function ModuleCard({ mod }) {
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (idx) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <View style={styles.moduleCard}>
      {/* En-tête du module */}
      <TouchableOpacity style={styles.moduleHeader} onPress={() => setOpen(v => !v)} activeOpacity={0.8}>
        <View style={[styles.moduleIcon, { backgroundColor: mod.color + '22' }]}>
          <Ionicons name={mod.icon} size={22} color={mod.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.moduleNum}>MODULE {mod.id}</Text>
          <Text style={styles.moduleTitle}>{mod.title}</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#999" />
      </TouchableOpacity>

      {/* Contenu du module (sections) */}
      {open && (
        <View style={styles.moduleSections}>
          {mod.sections.map((sec, idx) => (
            <View key={idx} style={styles.sectionBlock}>
              {/* Sous-titre de la section */}
              <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(idx)} activeOpacity={0.8}>
                <View style={[styles.sectionDot, { backgroundColor: mod.color }]} />
                <Text style={[styles.sectionTitle, { color: mod.color }]}>{sec.subtitle}</Text>
                <Ionicons name={openSections[idx] ? 'remove' : 'add'} size={18} color={mod.color} />
              </TouchableOpacity>

              {openSections[idx] && (
                <View style={styles.sectionContent}>
                  {sec.content.map((line, li) => (
                    <Text key={li} style={styles.contentLine}>{line}</Text>
                  ))}
                  {sec.tip && <TipBox text={sec.tip} />}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.faqHeader} onPress={() => setOpen(v => !v)} activeOpacity={0.8}>
        <Ionicons name="help-circle-outline" size={18} color={COLORS.accent} style={{ marginTop: 1 }} />
        <Text style={styles.faqQ}>{item.q}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#999" />
      </TouchableOpacity>
      {open && <Text style={styles.faqA}>{item.a}</Text>}
    </View>
  );
}

// ─── Écran principal ─────────────────────────────────────────────────────────

export default function UserGuideScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>

      {/* Hero */}
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.hero}>
        <Ionicons name="book" size={42} color="rgba(255,255,255,0.9)" />
        <Text style={styles.heroTitle}>Guide d'utilisation</Text>
        <Text style={styles.heroSubtitle}>Application Mobile Langues Ivoire</Text>
        <Text style={styles.heroVersion}>Version 1.0 — Mai 2026</Text>
      </LinearGradient>

      {/* Introduction rapide */}
      <View style={styles.introBox}>
        <Text style={styles.introText}>
          Langues Ivoire vous permet d'apprendre les langues ethniques et urbaines de Côte d'Ivoire :
          Dioula, Baoulé, Bété, Guéré, Agni et Nouchi.
          Ce guide couvre tous les écrans et fonctionnalités de l'application.
        </Text>
      </View>

      {/* Modules */}
      <Text style={styles.sectionHeading}>📚 Les 13 Modules</Text>
      <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 8 }}>
        {MODULES.map(mod => <ModuleCard key={mod.id} mod={mod} />)}
      </View>

      {/* FAQ */}
      <Text style={styles.sectionHeading}>❓ Questions fréquentes</Text>
      <View style={styles.faqContainer}>
        {FAQ.map((item, i) => <FaqItem key={i} item={item} />)}
      </View>

      {/* Contact */}
      <View style={styles.contactBox}>
        <Text style={styles.contactTitle}>Assistance et Contact</Text>
        {[
          ['mail-outline', 'support@langues-ivoire.com'],
          ['globe-outline', 'www.langues-ivoire.com'],
          ['logo-instagram', '@LanguesIvoire'],
        ].map(([icon, val]) => (
          <View key={val} style={styles.contactRow}>
            <Ionicons name={icon} size={16} color={COLORS.accent} />
            <Text style={styles.contactVal}>{val}</Text>
          </View>
        ))}
        <Text style={styles.contactNote}>Réponse dans les 48 heures ouvrables.</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Hero
  hero: {
    alignItems: 'center', paddingTop: 36, paddingBottom: 32, gap: 6,
  },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  heroSubtitle: { fontSize: 15, color: '#c8e6c9' },
  heroVersion: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 },

  // Intro
  introBox: {
    backgroundColor: '#fff', margin: 16, borderRadius: 14, padding: 16,
    borderLeftWidth: 4, borderLeftColor: COLORS.accent,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  introText: { fontSize: 14, color: '#444', lineHeight: 21 },

  sectionHeading: {
    fontSize: 17, fontWeight: 'bold', color: '#1A1A1A',
    marginHorizontal: 16, marginTop: 8, marginBottom: 12,
  },

  // Module card
  moduleCard: {
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  moduleHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16,
  },
  moduleIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  moduleNum: { fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 1, textTransform: 'uppercase' },
  moduleTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginTop: 1 },

  // Sections du module
  moduleSections: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingHorizontal: 16, paddingBottom: 12 },
  sectionBlock: { marginTop: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionTitle: { flex: 1, fontSize: 14, fontWeight: '600' },
  sectionContent: { paddingLeft: 14, paddingTop: 6, gap: 4 },
  contentLine: { fontSize: 13.5, color: '#444', lineHeight: 20 },

  // Conseil
  tipBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: COLORS.yellow, borderRadius: 10, padding: 10, marginTop: 10,
    borderWidth: 1, borderColor: '#F5A623',
  },
  tipText: { flex: 1, fontSize: 12.5, color: '#7B4F00', lineHeight: 18 },

  // FAQ
  faqContainer: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  faqHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14 },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A1A', lineHeight: 20 },
  faqA: { fontSize: 13.5, color: '#555', lineHeight: 20, paddingHorizontal: 14, paddingBottom: 14 },

  // Contact
  contactBox: {
    backgroundColor: COLORS.primary, marginHorizontal: 16, marginBottom: 8,
    borderRadius: 16, padding: 20,
  },
  contactTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 14 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  contactVal: { fontSize: 14, color: '#c8e6c9' },
  contactNote: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 6, fontStyle: 'italic' },
});
