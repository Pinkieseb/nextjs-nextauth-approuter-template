import { create } from 'zustand'
import logger from '../logger'

interface GlobalState {
  isDarkMode: boolean
  toggleDarkMode: () => void
  isOffline: boolean
  setIsOffline: (isOffline: boolean) => void
}

const useGlobalStore = create<GlobalState>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.isDarkMode
    logger.info({ isDarkMode: newDarkMode }, 'Dark mode toggled')
    return { isDarkMode: newDarkMode }
  }),
  isOffline: false,
  setIsOffline: (isOffline) => {
    logger.info({ isOffline }, 'Offline status changed')
    set({ isOffline })
  },
}))

export default useGlobalStore
