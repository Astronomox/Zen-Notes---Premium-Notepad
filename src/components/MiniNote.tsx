import { useRef, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { Bold, Italic, List, Check } from 'lucide-react'

const SEED = '<h2>My first note</h2><p>Try typing here. This is the real editor.</p>'

/** A live, functional mini editor embedded in the landing page. */
export function MiniNote() {
  const ref = useRef<HTMLDivElement>(null)
  const [words, setWords] = useState(8)
  const [saved, setSaved] = useState(false)

  const recount = useCallback(() => {
    const text = ref.current?.textContent ?? ''
    const n = text.trim() ? text.trim().split(/\s+/).length : 0
    setWords(n)
    setSaved(false)
  }, [])

  const exec = (cmd: string) => {
    document.execCommand(cmd)
    ref.current?.focus()
    recount()
  }

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-line bg-surface shadow-card overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 h-12 border-b border-line bg-raised/60">
        <div className="flex items-center gap-1">
          {[
            { icon: Bold, cmd: 'bold', label: 'Bold' },
            { icon: Italic, cmd: 'italic', label: 'Italic' },
            { icon: List, cmd: 'insertUnorderedList', label: 'List' },
          ].map(({ icon: Icon, cmd, label }) => (
            <button
              key={cmd}
              onMouseDown={(e) => { e.preventDefault(); exec(cmd) }}
              title={label}
              className="grid place-items-center w-8 h-8 rounded-md text-muted hover:text-accent-strong hover:bg-surface transition-colors"
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
        <button
          onClick={save}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-accent/12 text-accent-strong
            border border-accent/25 hover:bg-accent/20 transition-colors"
        >
          {saved ? <><Check size={13} /> Saved</> : 'Save'}
        </button>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={recount}
        dangerouslySetInnerHTML={{ __html: SEED }}
        className="editor-surface px-6 py-6 min-h-[200px] text-[1.02rem] text-fg focus:outline-none"
      />

      <div className="px-6 py-2.5 border-t border-line bg-raised/40 text-xs text-faint flex items-center justify-between">
        <span>{words} {words === 1 ? 'word' : 'words'}</span>
        <span>live preview · nothing is sent anywhere</span>
      </div>
    </motion.div>
  )
}
