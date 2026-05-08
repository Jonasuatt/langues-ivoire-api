import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Image, SectionList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { tutorsAPI } from '../services/api';
import { getAvatar } from '../data/avatars';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

// Noms des agents IA linguistiques transversaux
const IA_NAMES = new Set(['Zélé', 'Kouadio']);

export default function TutorsScreen({ navigation }) {
  const [allTutors, setAllTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tutorsAPI.getAll()
      .then(({ data }) => setAllTutors(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Séparer IA linguistiques (dédupliqués) et tuteurs culturels
  const iaAgents = [...new Map(
    allTutors.filter(t => IA_NAMES.has(t.nomAvatar)).map(t => [t.nomAvatar, t])
  ).values()];

  const culturalTutors = allTutors.filter(t => !IA_NAMES.has(t.nomAvatar));

  const renderTutorCard = (item, isIA = false) => {
    const localPortrait = getAvatar(item.nomAvatar, 'portrait');

    return (
      <TouchableOpacity
        style={[styles.card, isIA && styles.cardIA]}
        onPress={() => navigation.navigate('TutorChat', { tutor: item })}
        activeOpacity={0.85}
      >
        {/* Portrait */}
        <View style={[styles.portraitWrapper, isIA && styles.portraitWrapperIA]}>
          {localPortrait ? (
            <Image source={localPortrait} style={styles.portrait} resizeMode="cover" />
          ) : item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.portrait} resizeMode="cover" />
          ) : (
            <View style={[styles.portrait, styles.portraitFallback,
              isIA && { backgroundColor: item.genre === 'F' ? '#DB2777' : '#2563EB' }]}>
              <Text style={styles.portraitInitial}>{item.nomAvatar.slice(0, 1)}</Text>
            </View>
          )}
          {isIA && (
            <View style={styles.iaBadgeOnPortrait}>
              <Text style={styles.iaBadgeText}>IA</Text>
            </View>
          )}
        </View>

        {/* Infos */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.nomAvatar}</Text>
            {item.genre && (
              <View style={[styles.genderBadge, item.genre === 'F' ? styles.genderF : styles.genderM]}>
                <Text style={[styles.genderText, item.genre === 'F' ? styles.genderTextF : styles.genderTextM]}>
                  {item.genre === 'F' ? '♀' : '♂'}
                </Text>
              </View>
            )}
          </View>
          {isIA ? (
            <Text style={styles.iaSubtitle}>Toutes les langues</Text>
          ) : (
            <Text style={styles.lang}>{item.language?.nom}</Text>
          )}
          {item.personalite && (
            <Text style={styles.personalite} numberOfLines={2}>{item.personalite}</Text>
          )}
        </View>

        {/* Action */}
        <View style={styles.chatBtn}>
          <Ionicons name="chatbubble-ellipses" size={22} color={COLORS.accent} />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={COLORS.accent} size="large" />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <SectionList
        sections={[
          { title: 'ia', data: iaAgents },
          { title: 'cultural', data: culturalTutors },
        ]}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        renderSectionHeader={({ section }) => {
          if (section.title === 'ia') return (
            <LinearGradient
              colors={['#0B3D2E', '#1a5c45']}
              style={styles.sectionHeaderIA}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sectionHeaderIAIcon}>🤖</Text>
              <View>
                <Text style={styles.sectionHeaderIATitle}>Agents IA Linguistiques</Text>
                <Text style={styles.sectionHeaderIASub}>Présents dans toutes les langues</Text>
              </View>
            </LinearGradient>
          );
          return (
            <View style={styles.sectionHeaderCultural}>
              <Ionicons name="people" size={16} color={COLORS.accent} />
              <Text style={styles.sectionHeaderCulturalText}>
                {culturalTutors.length} Tuteurs Ethniques Culturels
              </Text>
            </View>
          );
        }}
        renderItem={({ item, section }) => (
          <View style={{ marginBottom: 12 }}>
            {renderTutorCard(item, section.title === 'ia')}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Tuteurs non disponibles pour l'instant.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Section headers
  sectionHeaderIA: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, padding: 14, marginBottom: 12,
  },
  sectionHeaderIAIcon: { fontSize: 28 },
  sectionHeaderIATitle: { fontSize: 14, fontWeight: '800', color: '#fff' },
  sectionHeaderIASub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 },

  sectionHeaderCultural: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFF3E0', borderRadius: 10, padding: 10,
    marginTop: 8, marginBottom: 12,
  },
  sectionHeaderCulturalText: { fontSize: 13, color: '#E65100', fontWeight: '600' },

  // Carte
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    flexDirection: 'row', alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  cardIA: {
    borderWidth: 1.5, borderColor: '#0B3D2E',
  },

  // Portrait
  portraitWrapper: {
    width: 80, height: 100, backgroundColor: '#f0ede8',
  },
  portraitWrapperIA: {
    backgroundColor: '#e8f4f0',
  },
  portrait: {
    width: 80, height: 100,
  },
  portraitFallback: {
    justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary,
  },
  portraitInitial: { fontSize: 32, fontWeight: 'bold', color: '#fff' },

  iaBadgeOnPortrait: {
    position: 'absolute', bottom: 4, left: 4,
    backgroundColor: COLORS.primary, borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 1,
  },
  iaBadgeText: { fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },

  // Infos
  info: { flex: 1, paddingHorizontal: 14, paddingVertical: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  name: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  genderBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  genderM: { backgroundColor: '#DBEAFE' },
  genderF: { backgroundColor: '#FCE7F3' },
  genderText: { fontSize: 11, fontWeight: '600' },
  genderTextM: { color: '#2563EB' },
  genderTextF: { color: '#DB2777' },
  lang: { fontSize: 13, color: COLORS.accent, fontWeight: '600', marginBottom: 4 },
  iaSubtitle: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  personalite: { fontSize: 12, color: '#666', lineHeight: 17 },

  // Bouton chat
  chatBtn: { paddingRight: 16, paddingLeft: 4 },

  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 16 },
});
