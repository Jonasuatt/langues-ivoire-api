import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, motDePasse) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.login({ email, motDePasse });
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Erreur de connexion', isLoading: false });
    }
  },

  register: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.register(formData);
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Erreur d\'inscription', isLoading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    set({ user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) return;
    try {
      const { data } = await authAPI.getMe();
      set({ user: data, isAuthenticated: true });
    } catch (_) {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    }
  },

  updateUser: async (updates) => {
    try {
      const { data } = await authAPI.updateMe(updates);
      set({ user: data });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Erreur de mise à jour' });
    }
  },

  clearError: () => set({ error: null }),
}));
