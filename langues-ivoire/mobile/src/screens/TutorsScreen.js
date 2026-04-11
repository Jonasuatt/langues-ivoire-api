import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tutorsAPI } from '../services/api';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

const AVATAR_COLORS = ['#0B3D2E', '#1565C0', '#6A1B9A', '#E65100', '#00695C', '#AD1457', '#4E342E', '#37474F'];

export default function TutorsScreen({ navigation }) {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tutorsAPI.getAll()
      .then(({ data }) => setTutors(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const renderTutor = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TutorChat', { tutor: item })}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.avatarImage} />
      ) : (
        <LinearGradient colors={[AVATAR_COLORS[index % AVATAR_COLORS.length], AVATAR_COLORS[(index + 1) % AVATAR_COLORS.length]]}
          style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{item.nomAvatar.slice(0, 1)}</Text>
        </LinearGradient>
      )}

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
        <Text style={styles.lang}>{item.language?.nom}</Text>
        {item.personalite && (
          <Text style={styles.personalite} numberOfLines={2}>{item.personalite}</Text>
        )}
      </View>

      <View style={styles.arrow}>
        <Ionicons name="chatbubble-ellipses" size={22} color={COLORS.accent} />
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={COLORS.accent} size="large" />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.banner}>
        <Ionicons name="sparkles" size={20} color={COLORS.accent} />
        <Text style={styles.bannerText}>
          {tutors.length} Tuteurs Ethniques Virtuels — Choisissez votre guide culturel
        </Text>
      </View>

      <FlatList
        data={tutors}
        keyExtractor={i => i.id}
        renderItem={renderTutor}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>Tuteurs non disponibles pour l'instant.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF3E0',
            margin: 16, borderRadius: 12, padding: 12 },
  bannerText: { flex: 1, fontSize: 13, color: '#E65100', lineHeight: 18 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row',
          alignItems: 'center', gap: 14,
          shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 60, height: 60, borderRadius: 30 },
  avatarInitial: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  genderBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  genderM: { backgroundColor: '#DBEAFE' },
  genderF: { backgroundColor: '#FCE7F3' },
  genderText: { fontSize: 11, fontWeight: '600' },
  genderTextM: { color: '#2563EB' },
  genderTextF: { color: '#DB2777' },
  info: { flex: 1 },
  lang: { fontSize: 13, color: COLORS.accent, fontWeight: '600', marginTop: 2 },
  personalite: { fontSize: 12, color: '#666', marginTop: 4, lineHeight: 17 },
  arrow: {},
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 16 },
});
