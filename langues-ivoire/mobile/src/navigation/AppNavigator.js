import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

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
            Dictionnaire: focused ? 'book' : 'book-outline',
            Tuteurs: focused ? 'person' : 'person-outline',
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
      <Tab.Screen name="Dictionnaire" component={DictionaryScreen} />
      <Tab.Screen name="Tuteurs" component={TutorsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
