import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';

const useNetworkStore = create((set) => ({
  isConnected: true,
  isInternetReachable: true,

  initialize: () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      set({
        isConnected: state.isConnected ?? true,
        isInternetReachable: state.isInternetReachable ?? true,
      });
    });
    return unsubscribe;
  },
}));

export default useNetworkStore;
