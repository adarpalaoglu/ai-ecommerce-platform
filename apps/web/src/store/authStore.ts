import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  setLogin: (user: any, token: string) => void;
  setLogout: () => void;
}

export const useAuthStore = create<AuthState>((set: any) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  setLogin: (user: any, token: any) => {
    localStorage.setItem('token', token);
    set({ isAuthenticated: true, user, token });
  },
  setLogout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, user: null, token: null });
  },
}));
