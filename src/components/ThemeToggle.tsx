import { motion } from 'motion/react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../store/useTheme'

export function ThemeToggle() {
  const theme = useTheme((s) => s.theme)
  const toggle = useTheme((s) => s.toggle)
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      className="relative grid place-items-center w-9 h-9 rounded-lg border border-line bg-raised
        text-muted hover:text-accent-strong hover:border-accent/40 transition-colors overflow-hidden"
    >
      <motion.span
        key={theme}
        initial={{ y: 14, opacity: 0, rotate: -30 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isDark ? <Moon size={17} /> : <Sun size={17} />}
      </motion.span>
    </button>
  )
}
