import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ShieldPlus } from 'lucide-react'
import { useNotes } from './store/useNotes'
import { Landing } from './components/Landing'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'
import { VaultGate } from './components/VaultGate'
import { VaultSetup } from './components/VaultSetup'

export default function App() {
  const init = useNotes((s) => s.init)
  const vault = useNotes((s) => s.vault)
  const ready = useNotes((s) => s.ready)
  const create = useNotes((s) => s.create)
  const persist = useNotes((s) => s.persist)

  const [view, setView] = useState<'landing' | 'app'>('landing')
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => { init() }, [init])

  // Persist on exit
  useEffect(() => {
    const handler = () => persist()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [persist])

  // Keyboard shortcuts
  const onKey = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); create() }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); persist() }
  }, [create, persist])

  useEffect(() => {
    if (view !== 'app') return
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, onKey])

  if (!ready) {
    return <div className="h-full grid place-items-center bg-canvas text-faint">Loading…</div>
  }

  if (view === 'landing') {
    return <Landing onEnter={() => setView('app')} />
  }

  // Locked vault → gate
  if (vault === 'locked') {
    return <VaultGate />
  }

  return (
    <div className="h-full flex bg-canvas">
      <Sidebar />
      <Editor />

      {/* Floating: enable encryption when running unprotected */}
      {vault === 'unset' && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => setShowSetup(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-raised border border-line text-sm text-fg
            hover:border-accent/40 transition-colors shadow-lift"
        >
          <ShieldPlus size={16} className="text-accent-strong" />
          Enable encryption
        </motion.button>
      )}

      <AnimatePresence>
        {showSetup && <VaultSetup onClose={() => setShowSetup(false)} />}
      </AnimatePresence>
    </div>
  )
}
