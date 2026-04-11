import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', motDePasse: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, isLoading, clearError } = useAuthStore();

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    clearError();
    const { nom, prenom, email, motDePasse } = form;
    if (!nom || !prenom || !email || !motDePasse) {
      return Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
    }
    if (motDePasse.length < 8) {
      return Alert.alert('Mot de passe trop court', 'Minimum 8 caractères.');
    }
    await register(form);
    const { error } = useAuthStore.getState();
    if (error) Alert.alert('Erreur', error);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FAFAF8' }} keyboardShouldPersistTaps="handled">
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../../assets/logo.png')} style={styles.logoImg} resizeMode="contain" />
        <Text style={styles.tagline}>Créez votre compte gratuitement</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.title}>Inscription</Text>

        {[
          { key: 'prenom', placeholder: 'Prénom', icon: 'person-outline' },
          { key: 'nom', placeholder: 'Nom', icon: 'person-outline' },
          { key: 'email', placeholder: 'Email', icon: 'mail-outline', keyboard: 'email-address' },
        ].map(({ key, placeholder, icon, keyboard }) => (
          <View key={key} style={styles.inputWrapper}>
            <Ionicons name={icon} size={18} color="#999" />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={form[key]}
              onChangeText={v => update(key, v)}
              keyboardType={keyboard || 'default'}
              autoCapitalize={key === 'email' ? 'none' : 'words'}
              placeholderTextColor="#aaa"
            />
          </View>
        ))}

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe (8 caractères min.)"
            value={form.motDePasse}
            onChangeText={v => update('motDePasse', v)}
            secureTextEntry={!showPass}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={() => setShowPass(v => !v)}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Indicateur de force du mot de passe */}
        {form.motDePasse.length > 0 && (
          <View style={styles.strengthBar}>
            {[4, 6, 8, 12].map((threshold, i) => (
              <View key={i} style={[styles.strengthSegment,
                { backgroundColor: form.motDePasse.length >= threshold ? ['#f44336','#FF9800','#4CAF50','#2196F3'][i] : '#E0E0E0' }]} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={isLoading}>
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Créer mon compte</Text>
          }
        </TouchableOpacity>

        <Text style={styles.legal}>En vous inscrivant, vous acceptez nos CGU et Politique de Confidentialité.</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
          <Text style={styles.linkText}>Déjà un compte ? <Text style={{ color: '#F47920', fontWeight: 'bold' }}>Se connecter</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingBottom: 36, alignItems: 'center', position: 'relative' },
  back: { position: 'absolute', top: 60, left: 20 },
  logoImg: { width: 110, height: 110 },
  tagline: { fontSize: 13, color: '#c8e6c9', marginTop: 6 },
  form: { backgroundColor: '#FAFAF8', borderTopLeftRadius: 24, borderTopRightRadius: 24,
          marginTop: -20, padding: 28, paddingTop: 36 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
                  borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0',
                  paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14, gap: 10 },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  strengthBar: { flexDirection: 'row', gap: 4, marginBottom: 14, marginTop: -6 },
  strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  btn: { backgroundColor: '#F47920', borderRadius: 14, paddingVertical: 16,
         alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  legal: { fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 16, lineHeight: 16 },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#666' },
});
