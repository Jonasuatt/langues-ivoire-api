/**
 * MuseeScreen — Musée des Trésors
 * Collection virtuelle d'objets culturels débloquables par ethnie.
 * Les pièces se déverrouillent selon l'XP total accumulé.
 * Chaque pièce raconte une histoire culturelle ivoirienne.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Animated, Dimensions, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { progressAPI } from '../services/api';

const { width: W } = Dimensions.get('window');

const C = {
  bg:      '#0D0D1A',
  card:    '#1A1A2E',
  border:  '#2A2A4A',
  gold:    '#FFD600',
  silver:  '#C0C0C0',
  bronze:  '#CD7F32',
  accent:  '#F47920',
  white:   '#F0F0F0',
  grey:    '#666',
  locked:  '#2A2A2A',
};

// ── Palettes par ethnie ────────────────────────────────────────────────────────
const ETHNIES = [
  {
    code: 'baoule', nom: 'Baoulé', flag: '🌺',
    gradient: ['#AD1457', '#E91E63'],
    region: 'Centre — Vallée du Bandama',
    description: 'Peuple Akan réputé pour la finesse de son artisanat textile et la beauté de ses masques sculptés.',
    tresors: [
      { id: 'b1', nom: 'Masque Goli', emoji: '🎭', seuil: 0,
        type: 'Masque cérémoniel', matiere: 'Bois de fromager peint',
        histoire: 'Le Goli est dansé lors des funérailles et fêtes. Ses cornes symbolisent la force vitale transmise aux vivants par les ancêtres.' },
      { id: 'b2', nom: 'Pagne Kita', emoji: '🧣', seuil: 80,
        type: 'Textile traditionnel', matiere: 'Coton tissé à la main',
        histoire: 'Le pagne Kita est tissé par les femmes Baoulé en bandes étroites puis assemblé. Chaque motif géométrique porte un proverbe.' },
      { id: 'b3', nom: 'Statuette Blolo', emoji: '🗿', seuil: 200,
        type: 'Sculpture rituelle', matiere: 'Bois et pigments naturels',
        histoire: 'La Blolo Bian (époux de l\'au-delà) est une statuette gardée chez soi pour entretenir une relation spirituelle avec son conjoint céleste.' },
      { id: 'b4', nom: 'Pendentif Akan', emoji: '📿', seuil: 400,
        type: 'Joaillerie royale', matiere: 'Or fondu à la cire perdue',
        histoire: 'Fondu selon la technique de la cire perdue héritée des Ashanti, ce bijou royal ne pouvait être porté que par les chefs et leurs épouses.' },
    ],
  },
  {
    code: 'dioula', nom: 'Dioula', flag: '🌿',
    gradient: ['#1565C0', '#1976D2'],
    region: 'Nord & National — Kong, Bouaké',
    description: 'Peuple commerçant par excellence, les Dioula ont tissé un réseau commercial sur toute l\'Afrique de l\'Ouest.',
    tresors: [
      { id: 'd1', nom: 'Balance de Kong', emoji: '⚖️', seuil: 0,
        type: 'Outil de commerce', matiere: 'Laiton et cuir tanné',
        histoire: 'Kong, capitale commerciale du XVIIIe siècle, rayonnait jusqu\'au Sahara. Cette balance en laiton mesurait l\'or et les noix de kola avec une précision remarquable.' },
      { id: 'd2', nom: 'Calebasse sculptée', emoji: '🪬', seuil: 80,
        type: 'Récipient cérémoniel', matiere: 'Cucurbitacée gravée',
        histoire: 'Les motifs géométriques gravés à la pointe de fer racontent les routes commerciales empruntées par le porteur, véritable carte de ses voyages.' },
      { id: 'd3', nom: 'Boubou brodé', emoji: '👘', seuil: 200,
        type: 'Vêtement de prestige', matiere: 'Bazin riche et fil d\'or',
        histoire: 'Le grand boubou à broderie "teinture" est le signe de la réussite du commerçant. Plus les broderies sont fines, plus le statut social est élevé.' },
      { id: 'd4', nom: 'Kora miniature', emoji: '🎸', seuil: 400,
        type: 'Instrument sacré', matiere: 'Calebasse, peau et cordes',
        histoire: 'La kora à 21 cordes est l\'instrument des griots Mandé, gardiens de la mémoire orale. Chaque mélodie est une page d\'histoire transmise de maître à disciple.' },
    ],
  },
  {
    code: 'bete', nom: 'Bété', flag: '🌳',
    gradient: ['#2E7D32', '#388E3C'],
    region: 'Ouest — Gagnoa, Soubré',
    description: 'Peuple guerrier et cultivateur, les Bété sont connus pour la richesse de leurs masques et la puissance de leurs danses rituelles.',
    tresors: [
      { id: 'bt1', nom: 'Masque Zo', emoji: '😤', seuil: 0,
        type: 'Masque de guerre', matiere: 'Bois de résineux et fibres',
        histoire: 'Le Zo est porté par les guerriers avant la bataille. Son visage grimaçant est censé terrifier l\'ennemi et appeler la protection des esprits ancestraux.' },
      { id: 'bt2', nom: 'Lance cérémonielle', emoji: '🗡️', seuil: 80,
        type: 'Arme rituelle', matiere: 'Fer forgé et bois de palissandre',
        histoire: 'La lance du chef Bété n\'est pas une arme de guerre mais un sceptre de justice. Sa lame ajourée symbolise la transparence du pouvoir.' },
      { id: 'bt3', nom: 'Mortier à igname', emoji: '🪵', seuil: 200,
        type: 'Outil quotidien sacré', matiere: 'Tronc de fromager creusé',
        histoire: 'Le "Pilage de l\'igname" est un rituel social : les femmes Bété pilent ensemble en chantant, les rythmes alternés tissant la cohésion du village.' },
      { id: 'bt4', nom: 'Bracelet de chef', emoji: '💎', seuil: 400,
        type: 'Insigne de pouvoir', matiere: 'Ivoire sculpté et cuivre',
        histoire: 'Ce bracelet en ivoire ne peut être transmis que du chef sortant au successeur, lors d\'un rituel nocturne gardé secret par les anciens du clan.' },
    ],
  },
  {
    code: 'senoufo', nom: 'Sénoufo', flag: '🦅',
    gradient: ['#E65100', '#F57C00'],
    region: 'Nord — Korhogo, Ferkessédougou',
    description: 'Agriculteurs et sculpteurs de génie, les Sénoufo organisent leur société autour du Poro, société initiatique masculine de sept ans.',
    tresors: [
      { id: 's1', nom: 'Masque Kpélié', emoji: '🎪', seuil: 0,
        type: 'Masque de divertissement', matiere: 'Bois léger et peinture blanche',
        histoire: 'Le Kpélié accompagne les rites funéraires pour divertir l\'âme du défunt et l\'aider à quitter le monde des vivants sans regrets.' },
      { id: 's2', nom: 'Tambour sacré', emoji: '🥁', seuil: 80,
        type: 'Instrument de communication', matiere: 'Bois et peau de léopard',
        histoire: 'Le tambour parlant Sénoufo peut transmettre des messages codés sur plusieurs kilomètres. Seuls les initiés du Poro connaissent le langage du tambour.' },
      { id: 's3', nom: 'Figurine Deblé', emoji: '🧍', seuil: 200,
        type: 'Sculpture initiatique', matiere: 'Bois de karité sculpté',
        histoire: 'La Deblé est portée à bras tendu pendant des heures lors des courses initiatiques du Poro. Sa légèreté apparente cache un poids symbolique immense.' },
      { id: 's4', nom: 'Chapeau de Poro', emoji: '🪖', seuil: 400,
        type: 'Coiffe initiatique', matiere: 'Fibres tressées et cauris',
        histoire: 'Ce chapeau conique n\'est porté qu\'une seule fois dans la vie : le jour de la sortie du bois sacré après les sept années d\'initiation au Poro.' },
    ],
  },
  {
    code: 'agni', nom: 'Agni', flag: '👑',
    gradient: ['#880E4F', '#C2185B'],
    region: 'Est — Abengourou, Agnibilékrou',
    description: 'Royauté Akan de l\'Est ivoirien, les Agni ont maintenu une aristocratie raffinée avec une culture de cour sophistiquée.',
    tresors: [
      { id: 'a1', nom: 'Tabouret royal', emoji: '🪑', seuil: 0,
        type: 'Insigne suprême du pouvoir', matiere: 'Bois noir et feuilles d\'or',
        histoire: 'Le tabouret royal Agni est recouvert de feuilles d\'or lors de l\'intronisation. Il ne touche jamais le sol seul — un serviteur le porte en permanence.' },
      { id: 'a2', nom: 'Anneau Baoulé-Agni', emoji: '💍', seuil: 80,
        type: 'Joaillerie royale', matiere: 'Or massif 22 carats',
        histoire: 'Fondu dans la forêt sacrée par un orfèvre initié, cet anneau porte des inscriptions en langue secrète des rois. Chaque souverain en possède un unique.' },
      { id: 'a3', nom: 'Éventail de cour', emoji: '🪭', seuil: 200,
        type: 'Accessoire cérémoniel', matiere: 'Plumes et ivoire',
        histoire: 'L\'agitateur de cour ventile le roi lors des audiences publiques. Sa présence signifie que le roi est en séance officielle et ses paroles ont force de loi.' },
      { id: 'a4', nom: 'Couronne Akan', emoji: '👑', seuil: 400,
        type: 'Coiffe de souverain', matiere: 'Or, perles royales et plumes',
        histoire: 'Cette couronne est l\'objet le plus sacré du royaume. Elle est montrée une seule fois par an lors de la fête de l\'igname nouvelle. La toucher est passible de mort.' },
    ],
  },
  {
    code: 'gouro', nom: 'Gouro', flag: '🦁',
    gradient: ['#00695C', '#00897B'],
    region: 'Centre-Ouest — Zuénoula, Daloa',
    description: 'Maîtres du masque Zaouli, l\'un des plus beaux masques d\'Afrique, les Gouro sont des agriculteurs paisibles à la créativité artistique exceptionnelle.',
    tresors: [
      { id: 'g1', nom: 'Masque Zamblé', emoji: '🐆', seuil: 0,
        type: 'Masque masculin', matiere: 'Bois de cerisier africain',
        histoire: 'Le Zamblé représente le léopard stylisé. Seuls les hommes circoncis peuvent le porter. Son apparition dans le village annonce une décision importante des anciens.' },
      { id: 'g2', nom: 'Masque Zaouli', emoji: '🌸', seuil: 80,
        type: 'Chef-d\'œuvre de l\'art Gouro', matiere: 'Bois léger et pigments naturels',
        histoire: 'Le Zaouli est le masque le plus photographié de Côte d\'Ivoire. Il représente une femme idéale et sa danse acrobatique sur la pointe des pieds dure parfois 6 heures.' },
      { id: 'g3', nom: 'Flûte Gu', emoji: '🎵', seuil: 200,
        type: 'Instrument sacré', matiere: 'Bambou et fibres végétales',
        histoire: 'La flûte Gu est jouée lors des rites agricoles pour appeler la pluie. Sa mélodie particulière est censée communiquer avec les esprits de la forêt.' },
      { id: 'g4', nom: 'Métier à tisser', emoji: '🧵', seuil: 400,
        type: 'Outil patrimonial', matiere: 'Bois et fibres de palmier',
        histoire: 'Les femmes Gouro tissent des pagnes à motifs géométriques complexes. Le métier à tisser est transmis de mère en fille avec les motifs propres à chaque lignage.' },
    ],
  },
  {
    code: 'guere', nom: 'Guéré', flag: '🌊',
    gradient: ['#1A237E', '#283593'],
    region: 'Ouest — Forêt de Taï, Man',
    description: 'Gardiens de la grande forêt tropicale de Taï, les Guéré ont développé une culture intense autour du rapport à la nature et de la chasse sacrée.',
    tresors: [
      { id: 'gu1', nom: 'Masque à cornes', emoji: '🦬', seuil: 0,
        type: 'Masque de puissance', matiere: 'Bois et cornes de buffle',
        histoire: 'Ce masque à cornes de buffle est réservé aux guerriers ayant tué un éléphant. Il symbolise la force brute canalisée au service de la communauté.' },
      { id: 'gu2', nom: 'Bouclier de la forêt', emoji: '🛡️', seuil: 80,
        type: 'Équipement de guerre', matiere: 'Cuir d\'hippopotame tendu',
        histoire: 'Tressé avec le cuir d\'hippopotame séché, ce bouclier est quasi indestructible. Sa fabrication prend trois mois et implique des rituels de protection nocturnes.' },
      { id: 'gu3', nom: 'Sifflet de chasseur', emoji: '🎺', seuil: 200,
        type: 'Outil de chasse rituel', matiere: 'Corne et os sculpté',
        histoire: 'Le sifflet en corne permet au chasseur de communiquer avec les autres sans alerter le gibier. Chaque clan possède un code de sifflets inimitable.' },
      { id: 'gu4', nom: 'Statue de forêt', emoji: '🌿', seuil: 400,
        type: 'Sculpture protectrice', matiere: 'Bois sacré de Taï et résines',
        histoire: 'Placée à l\'entrée du village, cette statue est badigeonnée de sang animal et d\'huile rouge pour être "activée". Elle veille sur les habitants la nuit.' },
    ],
  },
  {
    code: 'nouchi', nom: 'Nouchi', flag: '🎧',
    gradient: ['#212121', '#FF6B35'],
    region: 'Abidjan — Yopougon, Cocody, Abobo',
    description: 'Culture urbaine née dans les rues d\'Abidjan, le Nouchi est la fusion créative de toutes les ethnies dans le creuset de la capitale économique.',
    tresors: [
      { id: 'n1', nom: 'Casquette retournée', emoji: '🧢', seuil: 0,
        type: 'Icône de la rue', matiere: 'Coton brodé et visière plate',
        histoire: 'La casquette retournée est le symbole universel du jeune Abidjanais branché. Portée à l\'envers, elle signifie "je fais les choses à ma façon" — l\'essence du Nouchi.' },
      { id: 'n2', nom: 'Micro de DJ', emoji: '🎤', seuil: 80,
        type: 'Outil du Coupé-Décalé', matiere: 'Acier chromé et mousse',
        histoire: 'Le Coupé-Décalé, né à Paris dans les années 2000 dans les cercles de la diaspora ivoirienne, a conquis l\'Afrique entière grâce à ce micro et ses créateurs abidjanais.' },
      { id: 'n3', nom: 'Sneakers collector', emoji: '👟', seuil: 200,
        type: 'Objet de désir urbain', matiere: 'Cuir synthétique et semelle air',
        histoire: 'Les "Gao Gao" (chaussures de luxe) sont le Saint-Graal du jeune Nouchi. Certains économisent pendant des mois pour "porter le logo" et afficher leur réussite.' },
      { id: 'n4', nom: 'Trophée Décalé', emoji: '🏆', seuil: 400,
        type: 'Récompense suprême', matiere: 'Résine dorée et base en bois',
        histoire: 'Ce trophée imaginaire récompense le "Roi du Gbê" — celui qui maîtrise le Nouchi mieux que tous. Seuls les véritables "Connaisseurs" méritent de l\'exposer.' },
    ],
  },
];

const STORAGE_KEYS = {
  xp: 'musee_cached_xp',
};

// ── Calcul des pièces débloquées ──────────────────────────────────────────────
function countUnlocked(totalXp) {
  let count = 0;
  ETHNIES.forEach(e => e.tresors.forEach(t => { if (totalXp >= t.seuil) count++; }));
  return count;
}

const TOTAL_PIECES = ETHNIES.reduce((s, e) => s + e.tresors.length, 0);

// ── Composant principal ────────────────────────────────────────────────────────
export default function MuseeScreen({ navigation }) {
  const [totalXp, setTotalXp]       = useState(0);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);    // trésor sélectionné pour modal
  const [activeEthnie, setActiveEthnie] = useState(null); // code ethnie filtrée (null = tous)

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const modalAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadXp();
    Animated.timing(headerAnim, { toValue: 1, duration: 900, useNativeDriver: true }).start();
  }, []);

  const loadXp = async () => {
    // Cache local d'abord pour affichage immédiat
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.xp);
    if (cached) setTotalXp(parseInt(cached, 10));
    // Puis API
    try {
      const res = await progressAPI.get();
      const xp  = res.data?.stats?.totalXp ?? 0;
      setTotalXp(xp);
      await AsyncStorage.setItem(STORAGE_KEYS.xp, String(xp));
    } catch (_) {}
    setLoading(false);
  };

  const openTresor = (tresor, ethnie) => {
    if (totalXp < tresor.seuil) return; // verrouillé
    setSelected({ ...tresor, ethnie });
    modalAnim.setValue(0);
    Animated.spring(modalAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }).start();
  };

  const closeTresor = () => {
    Animated.timing(modalAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setSelected(null));
  };

  const unlocked = countUnlocked(totalXp);
  const percent  = Math.round((unlocked / TOTAL_PIECES) * 100);

  // Prochaine pièce à débloquer
  const allTresors = ETHNIES.flatMap(e => e.tresors.map(t => ({ ...t, ethnie: e })));
  const nextToUnlock = allTresors
    .filter(t => t.seuil > totalXp)
    .sort((a, b) => a.seuil - b.seuil)[0];

  const ethniesAffichees = activeEthnie
    ? ETHNIES.filter(e => e.code === activeEthnie)
    : ETHNIES;

  // ── Modal détail trésor ──────────────────────────────────────────────────────
  const renderModal = () => {
    if (!selected) return null;
    const e = selected.ethnie;
    return (
      <Modal visible transparent animationType="none" onRequestClose={closeTresor}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeTresor}>
          <Animated.View style={[styles.modalBox, {
            opacity: modalAnim,
            transform: [{ scale: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) }],
          }]}>
            <TouchableOpacity activeOpacity={1}>
              {/* En-tête ethnie */}
              <LinearGradient colors={e.gradient} style={styles.modalHeader}>
                <Text style={styles.modalEmoji}>{selected.emoji}</Text>
                <Text style={styles.modalTitre}>{selected.nom}</Text>
                <View style={styles.modalBadge}>
                  <Text style={styles.modalBadgeText}>{e.flag} {e.nom}</Text>
                </View>
              </LinearGradient>

              {/* Infos */}
              <View style={styles.modalBody}>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="construct-outline" size={16} color={C.gold} />
                  <Text style={styles.modalInfoLabel}>Type</Text>
                  <Text style={styles.modalInfoVal}>{selected.type}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="leaf-outline" size={16} color={C.gold} />
                  <Text style={styles.modalInfoLabel}>Matière</Text>
                  <Text style={styles.modalInfoVal}>{selected.matiere}</Text>
                </View>

                <View style={styles.modalDivider} />

                <Text style={styles.modalHistoireLabel}>📜 Histoire & signification</Text>
                <Text style={styles.modalHistoire}>{selected.histoire}</Text>
              </View>

              <TouchableOpacity style={styles.modalClose} onPress={closeTresor}>
                <Text style={styles.modalCloseText}>Refermer le livre</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  // ── Rendu d'une pièce ────────────────────────────────────────────────────────
  const renderTresor = (tresor, ethnie) => {
    const isUnlocked = totalXp >= tresor.seuil;
    const isFree     = tresor.seuil === 0;
    const tierLabel  = isFree ? 'Starter' : tresor.seuil <= 100 ? 'Bronze' : tresor.seuil <= 250 ? 'Argent' : 'Or';
    const tierColor  = isFree ? '#4CAF50' : tresor.seuil <= 100 ? C.bronze : tresor.seuil <= 250 ? C.silver : C.gold;

    return (
      <TouchableOpacity
        key={tresor.id}
        style={[styles.tresorCard, !isUnlocked && styles.tresorCardLocked]}
        onPress={() => openTresor(tresor, ethnie)}
        activeOpacity={isUnlocked ? 0.8 : 1}
      >
        {/* Emoji / Silhouette */}
        <View style={[styles.tresorEmojiWrap, !isUnlocked && { backgroundColor: C.locked }]}>
          {isUnlocked
            ? <Text style={styles.tresorEmoji}>{tresor.emoji}</Text>
            : <Ionicons name="lock-closed" size={22} color="#444" />
          }
        </View>

        {/* Infos */}
        <Text
          style={[styles.tresorNom, !isUnlocked && { color: '#444' }]}
          numberOfLines={1}
        >
          {isUnlocked ? tresor.nom : '???'}
        </Text>

        {/* Badge de tier */}
        <View style={[styles.tresorTier, { borderColor: isUnlocked ? tierColor : '#333' }]}>
          <Text style={[styles.tresorTierText, { color: isUnlocked ? tierColor : '#444' }]}>
            {isUnlocked ? tierLabel : `${tresor.seuil} XP`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderModal()}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header animé */}
        <Animated.View style={{ opacity: headerAnim }}>
          <LinearGradient colors={['#0D0D1A', '#1A1A2E', '#0D0D1A']} style={styles.header}>
            <Text style={styles.headerMusee}>🏛 MUSÉE DES TRÉSORS</Text>
            <Text style={styles.headerSub}>Patrimoine culturel ivoirien</Text>

            {/* Progression globale */}
            <View style={styles.progBox}>
              <View style={styles.progRow}>
                <Text style={styles.progLabel}>Collection : {unlocked} / {TOTAL_PIECES} pièces</Text>
                <Text style={styles.progPct}>{percent}%</Text>
              </View>
              <View style={styles.progTrack}>
                <LinearGradient
                  colors={[C.bronze, C.gold]}
                  style={[styles.progFill, { width: `${percent}%` }]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                />
              </View>
            </View>

            {/* XP actuel */}
            <View style={styles.xpRow}>
              <Ionicons name="star" size={16} color={C.gold} />
              <Text style={styles.xpText}>{totalXp} XP accumulés</Text>
              {nextToUnlock && (
                <Text style={styles.nextUnlock}>
                  · Prochain : {nextToUnlock.nom} ({nextToUnlock.seuil - totalXp} XP manquants)
                </Text>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Filtre ethnies */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={styles.filterBar} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        >
          <TouchableOpacity
            style={[styles.filterChip, !activeEthnie && styles.filterChipActive]}
            onPress={() => setActiveEthnie(null)}
          >
            <Text style={[styles.filterChipText, !activeEthnie && styles.filterChipTextActive]}>
              Tous
            </Text>
          </TouchableOpacity>
          {ETHNIES.map(e => (
            <TouchableOpacity
              key={e.code}
              style={[styles.filterChip, activeEthnie === e.code && styles.filterChipActive]}
              onPress={() => setActiveEthnie(activeEthnie === e.code ? null : e.code)}
            >
              <Text style={styles.filterChipText}>{e.flag} {e.nom}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vitrines par ethnie */}
        {ethniesAffichees.map(ethnie => {
          const unlockedCount = ethnie.tresors.filter(t => totalXp >= t.seuil).length;
          return (
            <View key={ethnie.code} style={styles.vitrine}>
              {/* Header ethnie */}
              <LinearGradient colors={[...ethnie.gradient, 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.vitrineHeader}
              >
                <View style={styles.vitrineHeaderLeft}>
                  <Text style={styles.vitrineFlag}>{ethnie.flag}</Text>
                  <View>
                    <Text style={styles.vitrineNom}>{ethnie.nom}</Text>
                    <Text style={styles.vitrineRegion}>{ethnie.region}</Text>
                  </View>
                </View>
                <View style={styles.vitrineCount}>
                  <Text style={styles.vitrineCountText}>{unlockedCount}/{ethnie.tresors.length}</Text>
                </View>
              </LinearGradient>

              {/* Description */}
              <Text style={styles.vitrineDesc}>{ethnie.description}</Text>

              {/* Grille de trésors */}
              <View style={styles.tresorGrid}>
                {ethnie.tresors.map(t => renderTresor(t, ethnie))}
              </View>
            </View>
          );
        })}

        {/* Pied de musée */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🏛 Chaque trésor raconte l'histoire d'un peuple.{'\n'}
            Continue d'apprendre pour ouvrir de nouvelles vitrines.
          </Text>
          {percent === 100 && (
            <View style={styles.masterCollector}>
              <Text style={styles.masterEmoji}>👑</Text>
              <Text style={styles.masterText}>Maître Collectionneur</Text>
              <Text style={styles.masterSub}>Tu as découvert tout le patrimoine culturel ivoirien !</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const CARD_W = (W - 16 * 2 - 12) / 4;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // Header
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 20 },
  headerMusee: {
    fontSize: 22, fontWeight: '900', color: C.gold,
    letterSpacing: 2, textAlign: 'center',
    textShadowColor: 'rgba(255,214,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
  },
  headerSub: { fontSize: 13, color: C.grey, textAlign: 'center', marginTop: 2, marginBottom: 16 },
  progBox: { marginBottom: 10 },
  progRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progLabel: { fontSize: 13, color: C.white, fontWeight: '600' },
  progPct: { fontSize: 13, color: C.gold, fontWeight: '700' },
  progTrack: {
    height: 6, backgroundColor: '#2A2A2A', borderRadius: 3, overflow: 'hidden',
  },
  progFill: { height: '100%', borderRadius: 3 },
  xpRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  xpText: { fontSize: 13, color: C.gold, fontWeight: '600' },
  nextUnlock: { fontSize: 12, color: C.grey, flex: 1 },

  // Filtre
  filterBar: { maxHeight: 52, backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: C.border },
  filterChip: {
    borderRadius: 20, borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#1A1A2E',
    alignSelf: 'center',
  },
  filterChipActive: { backgroundColor: C.gold, borderColor: C.gold },
  filterChipText: { fontSize: 13, color: C.grey, fontWeight: '600' },
  filterChipTextActive: { color: '#000' },

  // Vitrine
  vitrine: { marginBottom: 4 },
  vitrineHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  vitrineHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  vitrineFlag: { fontSize: 28 },
  vitrineNom: { fontSize: 16, fontWeight: '800', color: '#fff' },
  vitrineRegion: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  vitrineCount: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  vitrineCountText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  vitrineDesc: { fontSize: 12, color: C.grey, paddingHorizontal: 16, paddingVertical: 8, lineHeight: 18 },

  // Grille trésors
  tresorGrid: {
    flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, gap: 10,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  tresorCard: {
    width: CARD_W, backgroundColor: C.card, borderRadius: 12,
    alignItems: 'center', padding: 8, borderWidth: 1, borderColor: C.border,
  },
  tresorCardLocked: { borderColor: '#222', opacity: 0.6 },
  tresorEmojiWrap: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#16213E',
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  tresorEmoji: { fontSize: 26 },
  tresorNom: { fontSize: 10, fontWeight: '700', color: C.white, textAlign: 'center', marginBottom: 6 },
  tresorTier: {
    borderRadius: 10, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2,
  },
  tresorTierText: { fontSize: 9, fontWeight: '700' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center',
    alignItems: 'center', paddingHorizontal: 20,
  },
  modalBox: {
    width: '100%', backgroundColor: C.card, borderRadius: 24, overflow: 'hidden',
    borderWidth: 1, borderColor: C.border,
  },
  modalHeader: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 16 },
  modalEmoji: { fontSize: 56, marginBottom: 8 },
  modalTitre: { fontSize: 22, fontWeight: '900', color: '#fff', textAlign: 'center' },
  modalBadge: {
    marginTop: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  modalBadgeText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  modalBody: { padding: 20 },
  modalInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  modalInfoLabel: { fontSize: 12, color: C.grey, width: 60 },
  modalInfoVal: { fontSize: 13, color: C.white, fontWeight: '600', flex: 1 },
  modalDivider: { height: 1, backgroundColor: C.border, marginVertical: 14 },
  modalHistoireLabel: { fontSize: 13, fontWeight: '700', color: C.gold, marginBottom: 10 },
  modalHistoire: { fontSize: 14, color: C.white, lineHeight: 22 },
  modalClose: {
    marginHorizontal: 20, marginBottom: 20, paddingVertical: 14, backgroundColor: '#2A2A2A',
    borderRadius: 14, alignItems: 'center',
  },
  modalCloseText: { fontSize: 15, color: C.grey, fontWeight: '600' },

  // Footer
  footer: { padding: 24, alignItems: 'center' },
  footerText: { fontSize: 13, color: C.grey, textAlign: 'center', lineHeight: 20 },
  masterCollector: {
    marginTop: 20, alignItems: 'center', backgroundColor: '#16213E',
    borderRadius: 16, padding: 20, borderWidth: 2, borderColor: C.gold,
    width: '100%',
  },
  masterEmoji: { fontSize: 48 },
  masterText: { fontSize: 20, fontWeight: '900', color: C.gold, marginTop: 8 },
  masterSub: { fontSize: 13, color: C.grey, textAlign: 'center', marginTop: 4 },
});
