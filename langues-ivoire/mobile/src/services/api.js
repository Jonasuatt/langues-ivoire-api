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
  get: () => api.get('/users/me/progress'),
  completeLesson: (id, data) => api.post(`/users/me/lessons/${id}/complete`, data),
  getBadges: () => api.get('/users/me/badges'),
};

// Sync offline
export const syncAPI = {
  fullSync: (langue) => api.get('/sync', { params: { langue } }),
};

export default api;
