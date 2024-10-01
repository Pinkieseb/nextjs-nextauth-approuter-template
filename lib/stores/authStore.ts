import { create } from 'zustand'

type AuthStore = {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    darkMode: boolean;
  } | null;
  setUser: (user: AuthStore['user']) => void;
  logout: () => void;
  setDarkMode: (darkMode: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  setDarkMode: (darkMode) => set((state) => ({
    user: state.user ? { ...state.user, darkMode } : null
  })),
}))

export default useAuthStore
