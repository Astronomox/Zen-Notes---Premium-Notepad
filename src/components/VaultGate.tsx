import { useState } from 'react'
import { motion } from 'motion/react'
import { Lock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react'
import { useNotes } from '../store/useNotes'

export function VaultGate() {
  const unlock = useNotes((s) => s.unlock)
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!pass) return
    setBusy(true)
    setError(false)
    const ok = await unlock(pass)
    setBusy(false)
    if (!ok) {
      setError(true)
      setPass('')
    }
  }

  return (
    <div className="relative h-full grid place-items-center bg-canvas grain overflow-hidden">
      <BackdropGlow />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.2, 0.6, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="bg-surface/90 backdrop-blur-xl border border-line rounded-2xl p-8 shadow-lift">
          <div className="grid place-items-center w-14 h-14 mx-auto rounded-xl bg-accent/12 border border-accent/25 mb-5">
            <Lock size={24} className="text-accent-strong" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-fg text-center">
            Vault locked
          </h1>
          <p className="text-sm text-muted text-center mt-1.5 mb-6">
            Enter your passphrase to decrypt your notes.
          </p>

          <div className="relative">
            <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="password"
              value={pass}
              autoFocus
              onChange={(e) => { setPass(e.target.value); setError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Passphrase"
              className={`w-full bg-raised border rounded-lg pl-9 pr-3 py-2.5 text-sm text-fg
                placeholder:text-muted focus:outline-none transition-colors
                ${error ? 'border-red-500/50' : 'border-line focus:border-accent/40'}`}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: [0, -5, 5, -3, 3, 0] }}
              className="flex items-center gap-1.5 mt-2 text-xs text-red-400"
            >
              <AlertCircle size={13} />
              Wrong passphrase. Try again.
            </motion.div>
          )}

          <button
            onClick={submit}
            disabled={busy || !pass}
            className="w-full mt-5 py-2.5 rounded-lg bg-accent text-on-accent font-medium text-sm
              hover:bg-accent-strong active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy ? 'Decrypting…' : 'Unlock'}
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-faint">
            <ShieldCheck size={12} />
            AES-256 encrypted · never leaves this device
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function BackdropGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full
          bg-accent/10 blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
