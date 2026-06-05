import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

interface Variant { word: string; color: string }

const VARIANTS: Variant[] = [
  { word: 'freely', color: '#b07a2a' },   // amber
  { word: 'boldly', color: '#b4532a' },   // terracotta
  { word: 'clearly', color: '#2f7d6e' },  // teal
  { word: 'daily', color: '#8a6516' },    // deep gold
  { word: 'softly', color: '#a85d6b' },   // dusty rose
  { word: 'fully', color: '#4a7a3a' },    // forest
]

const TYPE_MS = 95
const ERASE_MS = 45
const HOLD_MS = 1500

type Phase = 'typing' | 'holding' | 'erasing'

/**
 * Typewriter that erases the trailing word and retypes a different one,
 * each in its own colour and a cursive face. Used in the "Express yourself"
 * showcase.
 */
export function RotatingWord() {
  const [index, setIndex] = useState(0)
  const [chars, setChars] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')

  const current = VARIANTS[index]

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (chars < current.word.length) {
        t = setTimeout(() => setChars((c) => c + 1), TYPE_MS)
      } else {
        t = setTimeout(() => setPhase('holding'), HOLD_MS)
      }
    } else if (phase === 'holding') {
      t = setTimeout(() => setPhase('erasing'), 200)
    } else {
      if (chars > 0) {
        t = setTimeout(() => setChars((c) => c - 1), ERASE_MS)
      } else {
        setIndex((i) => (i + 1) % VARIANTS.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(t)
  }, [phase, chars, current.word.length])

  return (
    <span className="inline-flex items-baseline whitespace-nowrap">
      <motion.span
        className="font-script font-semibold"
        style={{ color: current.color }}
        animate={{ color: current.color }}
        transition={{ duration: 0.3 }}
      >
        {current.word.slice(0, chars)}
      </motion.span>
      <motion.span
        aria-hidden
        className="inline-block w-[3px] self-stretch ml-1 rounded-full"
        style={{ backgroundColor: current.color }}
        animate={{ opacity: phase === 'holding' ? [1, 0] : 1 }}
        transition={{ duration: 0.5, repeat: phase === 'holding' ? Infinity : 0 }}
      />
    </span>
  )
}
