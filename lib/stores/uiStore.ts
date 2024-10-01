import { create } from 'zustand'
import logger from '../logger'

interface UIState {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.isDarkMode
    logger.info({ isDarkMode: newDarkMode }, 'UI dark mode toggled')
    return { isDarkMode: newDarkMode }
  }),
}))

export default useUIStore
