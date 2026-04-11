import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

const COLORS = { primary: '#0B3D2E', accent: '#F47920' };

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    clearError();
    if (!email || !motDePasse) {
      return Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
    }
    await login(email, motDePasse);
    const { error: e } = useAuthStore.getState();
    if (e) Alert.alert('Erreur', e);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logoImg}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Apprendre les Ethnies de Côte d'Ivoire</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.title}>Connexion</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={motDePasse}
            onChangeText={setMotDePasse}
            secureTextEntry={!showPass}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={() => setShowPass(v => !v)}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={isLoading}>
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Se connecter</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
          <Text style={styles.linkText}>Pas encore de compte ? <Text style={{ color: COLORS.accent, fontWeight: 'bold' }}>S'inscrire</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingBottom: 30, alignItems: 'center' },
  logoImg: { width: 150, height: 150 },
  tagline: { fontSize: 13, color: '#c8e6c9', marginTop: 6, textAlign: 'center' },
  form: { flex: 1, backgroundColor: '#FAFAF8', borderTopLeftRadius: 24, borderTopRightRadius: 24,
          marginTop: -20, padding: 28, paddingTop: 36 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 24 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
                  borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0',
                  paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16, gap: 10 },
  inputIcon: {},
  input: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  btn: { backgroundColor: '#F47920', borderRadius: 14, paddingVertical: 16,
         alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#666' },
});
