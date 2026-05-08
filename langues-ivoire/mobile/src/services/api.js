import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = 'https://api-production-7107f.up.railway.app/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur requête : injecter le token JWT
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur réponse : rafraîchir le token si expiré
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (_) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.patch('/auth/me', data),
  changePassword: (data) => api.patch('/auth/change-password', data),
};

// Langues
export const languagesAPI = {
  getAll: (params) => api.get('/languages', { params }),
  getOne: (id) => api.get(`/languages/${id}`),
};

// Dictionnaire
export const dictionaryAPI = {
  get: (langue, params) => api.get(`/dictionary/${langue}`, { params }),
  search: (params) => api.get('/dictionary/search', { params }),
  getEntry: (id) => api.get(`/dictionary/entry/${id}`),
  contributeWord: (data) => api.post('/dictionary/contribute/word', data),
  contributePhrase: (data) => api.post('/dictionary/contribute/phrase', data),
};

// Badges (endpoint public — liste tous les badges disponibles)
export const badgesAPI = {
  getAll: () => api.get('/badges'),
};

// Phrases utiles / SOS (endpoint public)
export const phrasesAPI = {
  getByLanguage: (languageCode, categorie) =>
    api.get('/phrases', { params: { languageCode, categorie, limit: 50 } }),
  getAllForLanguage: (languageCode) =>
    api.get('/phrases', { params: { languageCode, limit: 200 } }),
};

// Leçons
export const lessonsAPI = {
  getByLanguage: (langue, params) => api.get(`/lessons/language/${langue}`, { params }),
  getLesson: (id) => api.get(`/lessons/${id}/steps`),
  submitExercise: (id, data) => api.post(`/lessons/exercises/${id}/submit`, data),
};

// Culturel
export const culturalAPI = {
  getToday: () => api.get('/cultural/today'),
  getAll: (params) => api.get('/cultural', { params }),
};

// Tuteurs
export const tutorsAPI = {
  getAll: () => api.get('/tutors'),
  getOne: (id) => api.get(`/tutors/${id}`),
  chat: (id, data) => api.post(`/tutors/${id}/chat`, data),
  requestPronunciation: (data) => api.post('/tutors/pronunciation/request', data),
};

// Progression
export const progressAPI = {
  get:            ()         => api.get('/users/me/progress'),
  completeLesson: (id, data) => api.post(`/users/me/lessons/${id}/complete`, data),
  getBadges:      ()         => api.get('/users/me/badges'),
  addXp:          (data)     => api.post('/users/me/xp', data),   // { xp, source }
};

// TTS (Text-to-Speech)
export const ttsAPI = {
  synthesize: (data) => api.post('/dictionary/admin/generate-audio', data),
};

// Notifications
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

// Contributions Audio & Pratique IA
export const audioContribAPI = {
  getAll: (params) => api.get('/audio-contributions', { params }),
  create: (formData) => api.post('/audio-contributions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  }),
  getPracticeWords: (langCode, params) => api.get(`/audio-contributions/practice/${langCode}`, { params }),
  saveSession: (data) => api.post('/audio-contributions/practice/session', data),
};

// Agent IA conversationnel
export const agentChatAPI = {
  ask: (data) => api.post('/agent-chat', data, { timeout: 20000 }),
};

// Vidéos
export const videosAPI = {
  getAll: (params) => api.get('/videos', { params }),
  getCategories: () => api.get('/videos/categories'),
  getOne: (id) => api.get(`/videos/${id}`),
};

// Recherche globale
export const searchAPI = {
  global: (q, langue) => api.get('/search', { params: { q, langue } }),
};

// Support / Messages privés
export const supportAPI = {
  create: (data) => api.post('/support', data),
  getMine: () => api.get('/support/mine'),
};

// Certificats / Diplômes
export const certificateAPI = {
  getMine: () => api.get('/certificates/mine'),
};

// Sync offline
export const syncAPI = {
  fullSync: (langue) => api.get('/sync', { params: { langue } }),
};

// Upload (contributions média)
export const uploadAPI = {
  profilePhoto: (formData) =>
    api.post('/upload/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }),
  contributeImage: (formData) =>
    api.post('/upload/contribute-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }),
  contributeAudio: (formData) =>
    api.post('/upload/contribute-audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    }),
  contributeVideo: (formData) =>
    api.post('/upload/contribute-video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    }),
};

export default api;
