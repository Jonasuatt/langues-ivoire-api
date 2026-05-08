import React, { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import useNetworkStore from '../store/networkStore';
import OfflineIndicator from '../components/OfflineIndicator';
import { initNotifications } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LanguagesScreen from '../screens/LanguagesScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import DictionaryScreen from '../screens/DictionaryScreen';
import TutorsScreen from '../screens/TutorsScreen';
import TutorChatScreen from '../screens/TutorChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import CulturalScreen from '../screens/CulturalScreen';
import ContributeScreen from '../screens/ContributeScreen';
import ConjugationScreen from '../screens/ConjugationScreen';
import ImagesScreen from '../screens/ImagesScreen';
import OfflineSettingsScreen from '../screens/OfflineSettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import BadgesScreen from '../screens/BadgesScreen';
import VideosScreen from '../screens/VideosScreen';
import PracticeScreen from '../screens/PracticeScreen';
import SearchScreen from '../screens/SearchScreen';
import PremiumScreen from '../screens/PremiumScreen';
import SOSScreen from '../screens/SOSScreen';
import NouchiScreen from '../screens/NouchiScreen';
import UserGuideScreen from '../screens/UserGuideScreen';
import ContactScreen from '../screens/ContactScreen';
import MyCertificatesScreen from '../screens/MyCertificatesScreen';
import TextContentScreen from '../screens/TextContentScreen';
import TextContentDetailScreen from '../screens/TextContentDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Accueil: focused ? 'home' : 'home-outline',
            Langues: focused ? 'earth' : 'earth-outline',
            Vidéos: focused ? 'videocam' : 'videocam-outline',
            Dictionnaire: focused ? 'book' : 'book-outline',
            Profil: focused ? 'person-circle' : 'person-circle-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#eee', paddingBottom: 4 },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Langues" component={LanguagesScreen} />
      <Tab.Screen name="Vidéos" component={VideosScreen} />
      <Tab.Screen name="Dictionnaire" component={DictionaryScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, hydrate } = useAuthStore();
  const initNetwork = useNetworkStore((s) => s.initialize);
  const [onboardingDone, setOnboardingDone] = React.useState(null); // null = chargement

  useEffect(() => {
    hydrate();
    const unsubscribe = initNetwork();
    initNotifications().catch(() => {});
    // Vérifier si l'onboarding a déjà été vu
    AsyncStorage.getItem('onboarding_done').then(v => setOnboardingDone(v === 'true'));
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  // Attendre la résolution de l'état d'onboarding
  if (onboardingDone === null) return null;

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <OfflineIndicator />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            {/* Afficher l'onboarding uniquement lors de la première ouverture */}
            {!onboardingDone && (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="LessonDetail" component={LessonDetailScreen}
              options={{ headerShown: true, title: 'Leçon', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
            <Stack.Screen name="TutorChat" component={TutorChatScreen}
              options={{ headerShown: true, title: 'Tuteur', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Cultural" component={CulturalScreen}
              options={{ headerShown: true, title: 'Culture & Traditions', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Contribute" component={ContributeScreen}
              options={{ headerShown: true, title: 'Contribuer', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Conjugaison" component={ConjugationScreen}
              options={{ headerShown: true, title: 'Conjugaison', headerStyle: { backgroundColor: '#00695C' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Images" component={ImagesScreen}
              options={{ headerShown: true, title: 'Apprendre par l\'Image', headerStyle: { backgroundColor: '#AD1457' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="OfflineSettings" component={OfflineSettingsScreen}
              options={{ headerShown: true, title: 'Mode Hors-ligne', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen}
              options={{ headerShown: true, title: 'Notifications', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Badges" component={BadgesScreen}
              options={{ headerShown: true, title: 'Mes Badges & Progression', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Practice" component={PracticeScreen}
              options={{ headerShown: true, title: 'Pratiquer avec l\'IA', headerStyle: { backgroundColor: '#1565C0' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Search" component={SearchScreen}
              options={{ headerShown: false, animation: 'slide_from_top' }} />
            <Stack.Screen name="Premium" component={PremiumScreen}
              options={{ headerShown: false, animation: 'slide_from_bottom', presentation: 'modal' }} />
            <Stack.Screen name="SOS" component={SOSScreen}
              options={{ headerShown: true, title: 'Phrases SOS', headerStyle: { backgroundColor: '#C62828' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Tuteurs" component={TutorsScreen}
              options={{ headerShown: true, title: 'Tuteurs', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Nouchi" component={NouchiScreen}
              options={{ headerShown: true, title: 'Nouchi', headerStyle: { backgroundColor: '#37474F' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="UserGuide" component={UserGuideScreen}
              options={{ headerShown: true, title: 'Guide d\'utilisation', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Contact" component={ContactScreen}
              options={{ headerShown: false }} />
            <Stack.Screen name="MyCertificates" component={MyCertificatesScreen}
              options={{ headerShown: false }} />
            <Stack.Screen name="TextContent" component={TextContentScreen}
              options={{ headerShown: true, title: 'Textes & Récits', headerStyle: { backgroundColor: '#4A148C' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="TextContentDetail" component={TextContentDetailScreen}
              options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}
