import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ─── Détection Expo Go ────────────────────────────────────────────────────
// Depuis SDK 53, expo-notifications Android remote push crash dans Expo Go.
// On utilise un require() conditionnel pour NE PAS charger le module du tout
// dans Expo Go Android — l'import statique déclencherait addPushTokenListener
// dès le chargement du bundle, avant même qu'on puisse l'intercepter.
const IS_EXPO_GO = Constants.appOwnership === 'expo';
const IS_ANDROID = Platform.OS === 'android';
const NOTIF_DISABLED = IS_EXPO_GO && IS_ANDROID;

// Chargement conditionnel — null dans Expo Go Android, module réel sinon
const Notifications = NOTIF_DISABLED ? null : require('expo-notifications');

// ─── Configuration du comportement des notifications ───────────────────────
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

const KEYS = {
  PUSH_TOKEN: 'push_token',
  REMINDER_ENABLED: 'reminder_enabled',
  REMINDER_HOUR: 'reminder_hour',
  REMINDER_MINUTE: 'reminder_minute',
  STREAK_ALERT: 'streak_alert_enabled',
  KPAKPATO_ENABLED: 'kpakpato_enabled',
};

// ─── Proverbes et mots bonus du Kpakpato du jour ────────────────────────────
const KPAKPATO_MESSAGES = [
  { titre: '🌿 Mot du jour — Baoulé', corps: '"Akwaba" [akwaba] = Bienvenue ! Utilisez-le pour accueillir quelqu\'un avec chaleur.' },
  { titre: '🔥 Proverbe Dioula', corps: '"Kan dɔ ka ɲɛ a ka ɲɔgɔn fɔ" — Mieux vaut une langue connue qu\'une langue muette.' },
  { titre: '🌳 Mot du jour — Bété', corps: '"Gbahon" [gbahon] = Bonjour ! La salutation Bété s\'accompagne toujours d\'un regard direct et d\'un sourire.' },
  { titre: '🎭 Proverbe Sénoufo', corps: '"Foo... Celui qui écoute l\'arbre à palabres apprend plus que celui qui parle." Mot du jour : "Kawelé" = Bonjour.' },
  { titre: '👑 Mot du jour — Agni', corps: '"Meda wo" [meda wo] = Merci ! Chez les Agni royaux, la gratitude s\'exprime toujours avec une légère inclinaison.' },
  { titre: '💃 Mot du jour — Gouro', corps: '"Wa ka" [wa ka] = Bonjour ! La danse Zaouli des Gouro est inscrite au patrimoine de l\'UNESCO depuis 2017.' },
  { titre: '⚔️ Proverbe Guéré', corps: '"Celui qui connaît la forêt ne s\'y perd jamais." Mot du jour : "Gbɔɔ" [gbɔɔ] = Bonjour en Guéré.' },
  { titre: '🌆 Nouchi du jour', corps: '"Impeccable !" = Ça va très bien ! Et "C\'est comment ?" = Comment tu vas ? Tu connais maintenant 2 expressions indispensables à Abidjan.' },
  { titre: '🌿 Proverbe Baoulé', corps: '"Sran bi w\'a di mma, ɔ di ne ho" — Celui qui partage ne mange jamais seul. Partagez vos connaissances !' },
  { titre: '🎵 Mot du jour — Dioula', corps: '"Hɛrɛ bɛ ?" [hɛrɛ bɛ] = La paix est-elle là ? La façon la plus profonde de demander comment vas-tu en Dioula.' },
  { titre: '🌺 Mot du jour — Bété', corps: '"Kpa-a" [kpa-a] = Merci ! Chez les Bété de l\'Ouest, remercier c\'est reconnaître la valeur de l\'autre.' },
  { titre: '🌾 Proverbe Sénoufo', corps: '"L\'oiseau Calao revient toujours à son arbre." Mot du jour : "Nanga" [naŋa] = Merci en Sénoufo.' },
  { titre: '🏅 Le saviez-vous ?', corps: 'En Baoulé, le mot "Baoulé" signifie littéralement "l\'enfant est mort", en hommage au sacrifice de la reine Abla Pokou.' },
  { titre: '🛒 Mot du jour — Dioula', corps: '"Joli lo ?" = Combien ça coûte ? Indispensable au marché ! Avec ce mot, vous pouvez commencer à négocier partout en Afrique de l\'Ouest.' },
  { titre: '🌍 Le saviez-vous ?', corps: 'Le Dioula est compris dans 7 pays d\'Afrique de l\'Ouest. Apprendre le Dioula, c\'est s\'ouvrir un passeport continental !' },
  { titre: '💫 Mot du jour — Nouchi', corps: '"Yako" [jako] = Courage / Désolé. Un mot unique qui exprime l\'empathie — on l\'utilise pour consoler ET encourager.' },
  { titre: '🎨 Le saviez-vous ?', corps: 'La danse Zaouli des Gouro est si technique que les danseurs s\'entraînent des années. Mot du jour : "Yi" [ji] = Eau en Gouro.' },
  { titre: '🌿 Proverbe Guéré', corps: '"La forêt de Taï a des oreilles." Mot du jour en Guéré : "Iu" [iu] = Eau, ressource sacrée de la forêt.' },
  { titre: '👑 Le saviez-vous ?', corps: 'Le Royaume Agni d\'Abengourou est l\'un des rares royaumes traditionnels encore actifs en Côte d\'Ivoire. Le roi règne toujours !' },
  { titre: '🔥 Bonus Streak !', corps: 'Vous pratiquez régulièrement — félicitations ! "A ni cɛ" [a ni tʃɛ] = Merci du fond du cœur en Dioula. Vous le méritez !' },
];

// ─── Enregistrement du token push ─────────────────────────────────────────
export async function registerForPushNotifications() {
  if (NOTIF_DISABLED || !Notifications) return null;
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminder', {
      name: 'Rappel quotidien',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F47920',
      sound: 'default',
    });
    await Notifications.setNotificationChannelAsync('achievements', {
      name: 'Succès & Badges',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#FFD700',
    });
    await Notifications.setNotificationChannelAsync('kpakpato', {
      name: 'Kpakpato du jour',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#0B3D2E',
      sound: 'default',
    });
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: '292b386c-7d34-440d-a4a9-3035288609a3',
    });
    const token = tokenData.data;
    await AsyncStorage.setItem(KEYS.PUSH_TOKEN, token);
    return token;
  } catch {
    return null;
  }
}

// ─── Rappel quotidien ───────────────────────────────────────────────────────
export async function scheduleDailyReminder(hour = 20, minute = 0) {
  if (!Notifications) return null;
  await cancelDailyReminder();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌍 Moment d\'apprendre !',
      body: 'Quelques minutes par jour suffisent pour progresser. Continuez votre série !',
      sound: 'default',
      data: { type: 'DAILY_REMINDER', screen: 'Langues' },
      ...(IS_ANDROID && { channelId: 'daily-reminder' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  await AsyncStorage.setItem('daily_reminder_id', id);
  await AsyncStorage.setItem(KEYS.REMINDER_ENABLED, 'true');
  await AsyncStorage.setItem(KEYS.REMINDER_HOUR, String(hour));
  await AsyncStorage.setItem(KEYS.REMINDER_MINUTE, String(minute));

  return id;
}

export async function cancelDailyReminder() {
  if (!Notifications) return;
  const id = await AsyncStorage.getItem('daily_reminder_id');
  if (id) {
    try { await Notifications.cancelScheduledNotificationAsync(id); } catch {}
    await AsyncStorage.removeItem('daily_reminder_id');
  }
  await AsyncStorage.setItem(KEYS.REMINDER_ENABLED, 'false');
}

// ─── Alerte streak ─────────────────────────────────────────────────────────
export async function scheduleStreakWarning() {
  if (!Notifications) return null;
  await cancelStreakWarning();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Votre série est en danger !',
      body: 'Vous n\'avez pas encore pratiqué aujourd\'hui. Ne brisez pas votre série !',
      sound: 'default',
      data: { type: 'STREAK_WARNING', screen: 'Langues' },
      ...(IS_ANDROID && { channelId: 'daily-reminder' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 21,
      minute: 0,
    },
  });

  await AsyncStorage.setItem('streak_warning_id', id);
  await AsyncStorage.setItem(KEYS.STREAK_ALERT, 'true');
  return id;
}

export async function cancelStreakWarning() {
  if (!Notifications) return;
  const id = await AsyncStorage.getItem('streak_warning_id');
  if (id) {
    try { await Notifications.cancelScheduledNotificationAsync(id); } catch {}
    await AsyncStorage.removeItem('streak_warning_id');
  }
}

// ─── Kpakpato du jour (proverbe ou mot bonus à 12h) ───────────────────────
export async function scheduleKpakpato() {
  if (!Notifications) return null;
  await cancelKpakpato();

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const msg = KPAKPATO_MESSAGES[dayOfYear % KPAKPATO_MESSAGES.length];

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: msg.titre,
      body: msg.corps,
      sound: 'default',
      data: { type: 'KPAKPATO', screen: 'Accueil' },
      ...(IS_ANDROID && { channelId: 'kpakpato' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 12,
      minute: 0,
    },
  });

  await AsyncStorage.setItem('kpakpato_id', id);
  await AsyncStorage.setItem(KEYS.KPAKPATO_ENABLED, 'true');
  return id;
}

export async function cancelKpakpato() {
  if (!Notifications) return;
  const id = await AsyncStorage.getItem('kpakpato_id');
  if (id) {
    try { await Notifications.cancelScheduledNotificationAsync(id); } catch {}
    await AsyncStorage.removeItem('kpakpato_id');
  }
  await AsyncStorage.setItem(KEYS.KPAKPATO_ENABLED, 'false');
}

// ─── Notification locale immédiate (badge, succès) ─────────────────────────
export async function showBadgeNotification(badgeName, xp) {
  if (!Notifications) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🏅 Badge débloqué : ${badgeName}`,
      body: `Félicitations ! Vous gagnez ${xp} XP.`,
      sound: 'default',
      data: { type: 'BADGE_EARNED', screen: 'Badges' },
      ...(IS_ANDROID && { channelId: 'achievements' }),
    },
    trigger: null,
  });
}

// ─── Récupérer les préférences sauvegardées ──────────────────────────────
export async function getNotificationPrefs() {
  const [enabled, hour, minute, streakAlert, kpakpato] = await Promise.all([
    AsyncStorage.getItem(KEYS.REMINDER_ENABLED),
    AsyncStorage.getItem(KEYS.REMINDER_HOUR),
    AsyncStorage.getItem(KEYS.REMINDER_MINUTE),
    AsyncStorage.getItem(KEYS.STREAK_ALERT),
    AsyncStorage.getItem(KEYS.KPAKPATO_ENABLED),
  ]);
  return {
    reminderEnabled: enabled === 'true',
    reminderHour: hour ? parseInt(hour) : 20,
    reminderMinute: minute ? parseInt(minute) : 0,
    streakAlertEnabled: streakAlert !== 'false',
    kpakpatoEnabled: kpakpato === 'true',
  };
}

// ─── Initialiser au démarrage de l'app ───────────────────────────────────
export async function initNotifications() {
  // Dans Expo Go Android, les push distants sont désactivés — on sort immédiatement
  if (NOTIF_DISABLED) return { token: null, prefs: await getNotificationPrefs() };

  const token = await registerForPushNotifications();
  const prefs = await getNotificationPrefs();

  if (prefs.reminderEnabled) {
    await scheduleDailyReminder(prefs.reminderHour, prefs.reminderMinute);
  }
  if (prefs.streakAlertEnabled) {
    await scheduleStreakWarning();
  }
  if (prefs.kpakpatoEnabled) {
    await scheduleKpakpato();
  }

  return { token, prefs };
}
