import { useState } from 'react'
import { motion } from 'motion/react'
import { ShieldCheck, X } from 'lucide-react'
import { useNotes } from '../store/useNotes'

export function VaultSetup({ onClose }: { onClose: () => void }) {
  const createVault = useNotes((s) => s.createVault)
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (pass.length < 6) return setErr('Use at least 6 characters.')
    if (pass !== confirm) return setErr('Passphrases do not match.')
    setBusy(true)
    await createVault(pass)
    setBusy(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-canvas/80 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-surface border border-line rounded-2xl p-8 shadow-lift"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-md text-muted hover:text-fg hover:bg-raised"
        >
          <X size={17} />
        </button>

        <div className="grid place-items-center w-12 h-12 rounded-xl bg-accent/12 border border-accent/25 mb-4">
          <ShieldCheck size={22} className="text-accent-strong" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-fg">Protect your notes</h2>
        <p className="text-sm text-muted mt-1.5 mb-6">
          Set a passphrase to encrypt everything on this device. Choose something
          you will remember; it cannot be recovered.
        </p>

        <div className="space-y-3">
          <input
            type="password"
            value={pass}
            autoFocus
            onChange={(e) => { setPass(e.target.value); setErr('') }}
            placeholder="Passphrase"
            className="w-full bg-raised border border-line rounded-lg px-3 py-2.5 text-sm text-fg
              placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErr('') }}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Confirm passphrase"
            className="w-full bg-raised border border-line rounded-lg px-3 py-2.5 text-sm text-fg
              placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>

        {err && <p className="text-xs text-red-400 mt-2">{err}</p>}

        <button
          onClick={submit}
          disabled={busy}
          className="w-full mt-5 py-2.5 rounded-lg bg-accent text-on-accent font-medium text-sm
            hover:bg-accent-strong active:scale-[0.98] transition-all disabled:opacity-40"
        >
          {busy ? 'Encrypting…' : 'Enable encryption'}
        </button>
      </motion.div>
    </div>
  )
}
