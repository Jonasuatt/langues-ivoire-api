import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, Alert, Switch, Modal, TextInput,
  ActivityIndicator, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { progressAPI, authAPI, uploadAPI } from '../services/api';
import {
  scheduleDailyReminder, cancelDailyReminder,
  scheduleStreakWarning, cancelStreakWarning,
  scheduleKpakpato, cancelKpakpato,
  getNotificationPrefs,
} from '../services/notificationService';

const COLORS = { primary: '#0B3D2E', accent: '#F47920', bg: '#FAFAF8' };
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout, updateUser } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);

  // Notifications
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(20);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [streakAlert, setStreakAlert] = useState(true);
  const [kpakpatoEnabled, setKpakpatoEnabled] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempHour, setTempHour] = useState(20);
  const [tempMinute, setTempMinute] = useState(0);

  // Photo de profil
  const [photoLoading, setPhotoLoading] = useState(false);

  // Changement de mot de passe
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmMdp, setConfirmMdp] = useState('');
  const [showAncien, setShowAncien] = useState(false);
  const [showNouveau, setShowNouveau] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    Promise.all([progressAPI.get(), progressAPI.getBadges()])
      .then(([p, b]) => { setStats(p.data.stats); setBadges(b.data); })
      .catch(() => {});

    getNotificationPrefs().then(prefs => {
      setReminderEnabled(prefs.reminderEnabled);
      setReminderHour(prefs.reminderHour);
      setReminderMinute(prefs.reminderMinute);
      setStreakAlert(prefs.streakAlertEnabled);
      setKpakpatoEnabled(prefs.kpakpatoEnabled);
    });
  }, []);

  // ── Déconnexion ────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: logout },
    ]);
  };

  // ── Notifications ──────────────────────────────────────────
  const toggleReminder = async (value) => {
    setReminderEnabled(value);
    if (value) {
      await scheduleDailyReminder(reminderHour, reminderMinute);
      Alert.alert('✅ Rappel activé', `Vous serez rappelé chaque jour à ${fmt(reminderHour)}h${fmt(reminderMinute)}.`);
    } else {
      await cancelDailyReminder();
    }
    await updateUser({ notifEnabled: value });
  };

  const toggleKpakpato = async (value) => {
    setKpakpatoEnabled(value);
    if (value) {
      await scheduleKpakpato();
      Alert.alert('🌿 Kpakpato activé', 'Vous recevrez un proverbe ou mot du jour chaque jour à midi.');
    } else {
      await cancelKpakpato();
    }
  };

  const toggleStreakAlert = async (value) => {
    setStreakAlert(value);
    if (value) {
      await scheduleStreakWarning();
    } else {
      await cancelStreakWarning();
    }
  };

  const confirmTime = async () => {
    setReminderHour(tempHour);
    setReminderMinute(tempMinute);
    setShowTimePicker(false);
    if (reminderEnabled) await scheduleDailyReminder(tempHour, tempMinute);
  };

  const fmt = (n) => String(n).padStart(2, '0');

  // ── Photo de profil ────────────────────────────────────────
  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorisez l\'accès à la galerie dans les paramètres de votre téléphone.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    setPhotoLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: `profile_${user.id}.jpg`,
      });

      const { data } = await uploadAPI.profilePhoto(formData);
      await updateUser({ photo: data.imageUrl });
      Alert.alert('✅ Photo mise à jour', 'Votre photo de profil a été enregistrée.');
    } catch {
      Alert.alert('Erreur', 'Impossible de mettre à jour la photo. Réessayez.');
    } finally {
      setPhotoLoading(false);
    }
  };

  // ── Changement de mot de passe ─────────────────────────────
  const openPwdModal = () => {
    setAncienMdp('');
    setNouveauMdp('');
    setConfirmMdp('');
    setShowAncien(false);
    setShowNouveau(false);
    setShowConfirm(false);
    setShowPwdModal(true);
  };

  const handleChangePassword = async () => {
    if (!ancienMdp || !nouveauMdp || !confirmMdp) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
      return;
    }
    if (nouveauMdp.length < 8) {
      Alert.alert('Mot de passe trop court', 'Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (nouveauMdp !== confirmMdp) {
      Alert.alert('Mots de passe différents', 'Le nouveau mot de passe et sa confirmation ne correspondent pas.');
      return;
    }

    setPwdLoading(true);
    try {
      await authAPI.changePassword({ ancienMotDePasse: ancienMdp, nouveauMotDePasse: nouveauMdp });
      setShowPwdModal(false);
      Alert.alert('✅ Succès', 'Votre mot de passe a été modifié avec succès.');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Une erreur est survenue. Vérifiez votre mot de passe actuel.';
      Alert.alert('Erreur', msg);
    } finally {
      setPwdLoading(false);
    }
  };

  const isPremium = user?.isPremium;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>

      {/* ─── Header profil ─────────────────────────────────── */}
      <LinearGradient colors={['#0B3D2E', '#1a5c45']} style={styles.header}>

        {/* Avatar cliquable */}
        <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickPhoto} disabled={photoLoading}>
          {photoLoading ? (
            <View style={styles.avatarBig}>
              <ActivityIndicator color="#fff" size="small" />
            </View>
          ) : user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarBig}>
              <Text style={styles.avatarText}>
                {(user?.prenom || 'U').slice(0, 1)}{(user?.nom || 'U').slice(0, 1)}
              </Text>
            </View>
          )}
          {/* Icône crayon */}
          <View style={styles.editPhotoIcon}>
            <Ionicons name="camera" size={13} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.userName}>{user?.prenom} {user?.nom}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        {isPremium
          ? <View style={styles.premiumBadge}><Text style={styles.premiumText}>⭐ Premium</Text></View>
          : (
            <TouchableOpacity style={styles.upgradeBadge} onPress={() => navigation.navigate('Premium')}>
              <Text style={styles.upgradeText}>⭐ Passer à Premium</Text>
            </TouchableOpacity>
          )
        }
      </LinearGradient>

      {/* ─── Stats ─────────────────────────────────────────── */}
      {stats && (
        <View style={styles.statsRow}>
          {[
            { icon: 'flame',            label: 'Streak',  value: stats.streak,    color: '#F47920' },
            { icon: 'star',             label: 'XP Total', value: stats.totalXp,   color: '#FFD700' },
            { icon: 'checkmark-circle', label: 'Leçons',  value: stats.completed, color: '#4CAF50' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Ionicons name={s.icon} size={22} color={s.color} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ─── Badges ────────────────────────────────────────── */}
      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('Badges')}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.sectionTitle}>Mes Badges ({badges.length})</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </View>
        {badges.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
            {badges.map(ub => (
              <View key={ub.id} style={styles.badgeCard}>
                <Ionicons name="ribbon" size={28} color={COLORS.accent} />
                <Text style={styles.badgeName}>{ub.badge.nom}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={{ fontSize: 13, color: '#999' }}>Complétez des leçons pour gagner des badges</Text>
        )}
      </TouchableOpacity>

      {/* ─── Notifications ─────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>

        <View style={styles.settingRow}>
          <Ionicons name="alarm-outline" size={20} color="#1565C0" />
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Rappel quotidien</Text>
            <Text style={styles.settingSubLabel}>
              {reminderEnabled ? `Chaque jour à ${fmt(reminderHour)}:${fmt(reminderMinute)}` : 'Désactivé'}
            </Text>
          </View>
          <Switch value={reminderEnabled} onValueChange={toggleReminder}
            trackColor={{ true: COLORS.accent }} thumbColor={reminderEnabled ? '#fff' : '#ddd'} />
        </View>

        {reminderEnabled && (
          <TouchableOpacity style={styles.timePickerBtn}
            onPress={() => { setTempHour(reminderHour); setTempMinute(reminderMinute); setShowTimePicker(true); }}>
            <Ionicons name="time-outline" size={18} color={COLORS.primary} />
            <Text style={styles.timePickerBtnText}>
              Modifier l'heure : {fmt(reminderHour)}:{fmt(reminderMinute)}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </TouchableOpacity>
        )}

        <View style={[styles.settingRow, { marginTop: 14 }]}>
          <Ionicons name="flame-outline" size={20} color="#E53935" />
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Alerte série en danger</Text>
            <Text style={styles.settingSubLabel}>Rappel à 21h si vous n'avez pas encore pratiqué</Text>
          </View>
          <Switch value={streakAlert} onValueChange={toggleStreakAlert}
            trackColor={{ true: '#E53935' }} thumbColor={streakAlert ? '#fff' : '#ddd'} />
        </View>

        <View style={[styles.settingRow, { marginTop: 14 }]}>
          <Ionicons name="leaf-outline" size={20} color="#2E7D32" />
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Kpakpato du jour</Text>
            <Text style={styles.settingSubLabel}>Proverbe ou mot bonus chaque jour à 12h</Text>
          </View>
          <Switch value={kpakpatoEnabled} onValueChange={toggleKpakpato}
            trackColor={{ true: '#2E7D32' }} thumbColor={kpakpatoEnabled ? '#fff' : '#ddd'} />
        </View>
      </View>

      {/* ─── Paramètres ────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Paramètres</Text>

        {/* Mode hors-ligne */}
        <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('OfflineSettings')}>
          <Ionicons name="cloud-download-outline" size={20} color="#555" />
          <Text style={[styles.settingLabel, { flex: 1 }]}>Mode hors-ligne</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Changer le mot de passe */}
        <TouchableOpacity style={styles.settingRow} onPress={openPwdModal}>
          <Ionicons name="lock-closed-outline" size={20} color="#555" />
          <Text style={[styles.settingLabel, { flex: 1 }]}>Changer le mot de passe</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Guide d'utilisation */}
        <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('UserGuide')}>
          <Ionicons name="book-outline" size={20} color="#555" />
          <Text style={[styles.settingLabel, { flex: 1 }]}>Guide d'utilisation</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Mes diplômes */}
        <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('MyCertificates')}>
          <Ionicons name="school-outline" size={20} color="#F47920" />
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Mes Diplômes & Certificats</Text>
            <Text style={styles.settingSubLabel}>Consultez vos niveaux atteints</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Nous contacter */}
        <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Contact')}>
          <Ionicons name="mail-outline" size={20} color="#1565C0" />
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Nous contacter</Text>
            <Text style={styles.settingSubLabel}>Question, bug ou suggestion</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      {/* ─── Déconnexion ───────────────────────────────────── */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#E53935" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

      {/* ─── Modal : heure de rappel ────────────────────────── */}
      <Modal visible={showTimePicker} transparent animationType="slide" onRequestClose={() => setShowTimePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Heure du rappel</Text>
            <View style={styles.timeRow}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.timeLabel}>Heure</Text>
                <ScrollView style={styles.scrollPicker} showsVerticalScrollIndicator={false}>
                  {HOURS.map(h => (
                    <TouchableOpacity key={h} style={[styles.timeItem, tempHour === h && styles.timeItemActive]}
                      onPress={() => setTempHour(h)}>
                      <Text style={[styles.timeItemText, tempHour === h && { color: '#fff', fontWeight: 'bold' }]}>{fmt(h)}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <Text style={styles.timeSep}>:</Text>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.timeLabel}>Minute</Text>
                <ScrollView style={styles.scrollPicker} showsVerticalScrollIndicator={false}>
                  {MINUTES.map(m => (
                    <TouchableOpacity key={m} style={[styles.timeItem, tempMinute === m && styles.timeItemActive]}
                      onPress={() => setTempMinute(m)}>
                      <Text style={[styles.timeItemText, tempMinute === m && { color: '#fff', fontWeight: 'bold' }]}>{fmt(m)}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowTimePicker(false)}>
                <Text style={{ color: '#555', fontWeight: '600' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={confirmTime}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirmer {fmt(tempHour)}:{fmt(tempMinute)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Modal : changement de mot de passe ─────────────── */}
      <Modal visible={showPwdModal} transparent animationType="slide" onRequestClose={() => setShowPwdModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={styles.modalTitle}>Changer le mot de passe</Text>
              <TouchableOpacity onPress={() => setShowPwdModal(false)}>
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            {/* Ancien mot de passe */}
            <Text style={styles.inputLabel}>Mot de passe actuel</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                secureTextEntry={!showAncien}
                value={ancienMdp}
                onChangeText={setAncienMdp}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowAncien(v => !v)} style={styles.eyeBtn}>
                <Ionicons name={showAncien ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            {/* Nouveau mot de passe */}
            <Text style={[styles.inputLabel, { marginTop: 14 }]}>Nouveau mot de passe</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Min. 8 caractères"
                secureTextEntry={!showNouveau}
                value={nouveauMdp}
                onChangeText={setNouveauMdp}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowNouveau(v => !v)} style={styles.eyeBtn}>
                <Ionicons name={showNouveau ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
            {nouveauMdp.length > 0 && nouveauMdp.length < 8 && (
              <Text style={styles.inputHint}>⚠ Au moins 8 caractères requis</Text>
            )}

            {/* Confirmation */}
            <Text style={[styles.inputLabel, { marginTop: 14 }]}>Confirmer le nouveau mot de passe</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Répétez le nouveau mot de passe"
                secureTextEntry={!showConfirm}
                value={confirmMdp}
                onChangeText={setConfirmMdp}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn}>
                <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
            {confirmMdp.length > 0 && confirmMdp !== nouveauMdp && (
              <Text style={styles.inputHint}>⚠ Les mots de passe ne correspondent pas</Text>
            )}

            <View style={[styles.modalBtns, { marginTop: 22 }]}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowPwdModal(false)}>
                <Text style={{ color: '#555', fontWeight: '600' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmBtn, (pwdLoading || !ancienMdp || nouveauMdp.length < 8 || nouveauMdp !== confirmMdp) && { opacity: 0.5 }]}
                onPress={handleChangePassword}
                disabled={pwdLoading || !ancienMdp || nouveauMdp.length < 8 || nouveauMdp !== confirmMdp}
              >
                {pwdLoading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enregistrer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingTop: 48, paddingBottom: 32, gap: 8 },

  // Avatar
  avatarWrapper: { position: 'relative', marginBottom: 4 },
  avatarBig: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarImg: {
    width: 84, height: 84, borderRadius: 42,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  editPhotoIcon: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: COLORS.accent, borderRadius: 12,
    width: 24, height: 24, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#fff',
  },

  userName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  userEmail: { fontSize: 14, color: '#c8e6c9' },
  premiumBadge: { backgroundColor: 'rgba(255,215,0,0.25)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  premiumText: { color: '#FFD700', fontWeight: 'bold', fontSize: 13 },
  upgradeBadge: { backgroundColor: COLORS.accent, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  upgradeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  // Stats
  statsRow: { flexDirection: 'row', margin: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', gap: 4,
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  statLabel: { fontSize: 12, color: '#888' },

  // Sections
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 14 },
  badgeCard: { backgroundColor: '#FFF3E0', borderRadius: 12, padding: 14, alignItems: 'center', gap: 6, minWidth: 80 },
  badgeName: { fontSize: 11, color: COLORS.accent, fontWeight: '600', textAlign: 'center' },

  // Lignes paramètres
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  settingLabel: { fontSize: 15, color: '#1A1A1A' },
  settingSubLabel: { fontSize: 12, color: '#999', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },

  timePickerBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10,
                   backgroundColor: '#E8F5E9', borderRadius: 10, padding: 12 },
  timePickerBtnText: { flex: 1, color: COLORS.primary, fontSize: 14, fontWeight: '600' },

  // Logout
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, marginTop: 4,
               backgroundColor: '#fff', borderRadius: 14, padding: 16,
               shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#E53935' },

  // Modals communs
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalCancelBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center' },
  modalConfirmBtn: { flex: 2, padding: 14, borderRadius: 12, backgroundColor: COLORS.accent, alignItems: 'center' },

  // Modal heure
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 16 },
  timeLabel: { fontSize: 13, color: '#999', fontWeight: '600', marginBottom: 8 },
  scrollPicker: { maxHeight: 200 },
  timeItem: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginVertical: 2, alignItems: 'center' },
  timeItemActive: { backgroundColor: COLORS.accent },
  timeItemText: { fontSize: 20, color: '#333' },
  timeSep: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 20 },

  // Modal mot de passe
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12,
    backgroundColor: '#FAFAFA', paddingHorizontal: 14,
  },
  input: { flex: 1, height: 48, fontSize: 15, color: '#1A1A1A' },
  eyeBtn: { padding: 8 },
  inputHint: { fontSize: 12, color: '#E53935', marginTop: 4, marginLeft: 2 },
});
