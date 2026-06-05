import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggle: () => void
  apply: () => void
}

const KEY = 'zen.theme'

function read(): Theme {
  const saved = localStorage.getItem(KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return 'light' // default: light
}

function set(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(KEY, theme)
}

export const useTheme = create<ThemeStore>((setState, get) => ({
  theme: read(),
  toggle: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    set(next)
    setState({ theme: next })
  },
  apply: () => set(get().theme),
}))
