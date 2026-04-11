import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'earth',
    title: 'Bienvenue sur\nLANGUES IVOIRE',
    subtitle: 'Découvrez et apprenez les langues ethniques de Côte d\'Ivoire.',
    gradient: ['#0B3D2E', '#1a5c45'],
  },
  {
    id: '2',
    icon: 'school',
    title: '8 Langues dès\nle lancement',
    subtitle: 'Baoulé, Dioula, Bété, Senoufo, Agni, Gouro, Guéré et Nouchi — avec des leçons structurées.',
    gradient: ['#1565C0', '#1976D2'],
  },
  {
    id: '3',
    icon: 'person',
    title: 'Tuteurs Ethniques\nVirtuels (TEV)',
    subtitle: '8 tuteurs IA avec une identité culturelle forte pour vous guider dans votre apprentissage.',
    gradient: ['#6A1B9A', '#7B1FA2'],
  },
  {
    id: '4',
    icon: 'trophy',
    title: 'Apprenez en\nJouant',
    subtitle: 'Exercices, badges, défis et classements pour rendre l\'apprentissage addictif.',
    gradient: ['#E65100', '#F47920'],
  },
];

export default function OnboardingScreen({ navigation }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(i => i + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const renderSlide = ({ item, index }) => (
    <LinearGradient colors={item.gradient} style={styles.slide}>
      {index === 0 ? (
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <Ionicons name={item.icon} size={100} color="rgba(255,255,255,0.9)" />
      )}
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
    </LinearGradient>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={i => i.id}
        renderItem={renderSlide}
        onMomentumScrollEnd={e => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
      />

      {/* Indicateurs */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={next}>
          <Text style={styles.btnText}>
            {currentIndex === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.skip}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { width, flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 24 },
  logo: { width: 200, height: 200 },
  slideTitle: { fontSize: 30, fontWeight: 'bold', color: '#fff', textAlign: 'center', lineHeight: 38 },
  slideSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24 },
  footer: { position: 'absolute', bottom: 60, left: 0, right: 0, alignItems: 'center', gap: 20 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { width: 24, backgroundColor: '#fff' },
  btn: { flexDirection: 'row', backgroundColor: '#F47920', borderRadius: 50,
         paddingVertical: 14, paddingHorizontal: 36, alignItems: 'center', gap: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  skip: { marginTop: -4 },
  skipText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
});
