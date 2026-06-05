import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Plus, Pin, Trash2, Lock, Feather } from 'lucide-react'
import { useNotes } from '../store/useNotes'
import { stripHtml, relativeTime } from '../lib/text'
import { ThemeToggle } from './ThemeToggle'
import type { Note } from '../lib/types'

export function Sidebar() {
  const notes = useNotes((s) => s.notes)
  const activeId = useNotes((s) => s.activeId)
  const search = useNotes((s) => s.search)
  const vault = useNotes((s) => s.vault)
  const { select, create, remove, togglePin, setSearch, lock } = useNotes.getState()

  const [confirmId, setConfirmId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const matched = notes.filter((n) =>
      !q ? true : n.title.toLowerCase().includes(q) || stripHtml(n.content).toLowerCase().includes(q),
    )
    return matched.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.updatedAt - a.updatedAt
    })
  }, [notes, search])

  return (
    <aside className="w-[300px] shrink-0 flex flex-col bg-raised border-r border-line">
      <div className="flex items-center justify-between px-4 h-16 border-b border-line">
        <div className="flex items-center gap-2">
          <div className="grid place-items-center w-8 h-8 rounded-lg bg-accent/12 border border-accent/25">
            <Feather size={17} className="text-accent-strong" />
          </div>
          <span className="font-serif text-lg font-semibold">Zen Notes</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {vault === 'unlocked' && (
            <button onClick={lock} title="Lock vault"
              className="grid place-items-center w-9 h-9 rounded-lg text-muted hover:text-accent-strong hover:bg-surface transition-colors">
              <Lock size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes"
            className="w-full bg-surface border border-line rounded-lg pl-9 pr-3 py-2 text-sm
              placeholder:text-faint focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>
      </div>

      <div className="px-3 pb-2">
        <button
          onClick={create}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
            bg-accent text-on-accent font-medium text-sm hover:bg-accent-strong active:scale-[0.98] transition-all shadow-glow"
        >
          <Plus size={17} strokeWidth={2.5} />
          New note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <AnimatePresence initial={false}>
          {filtered.map((note) => (
            <NoteRow
              key={note.id}
              note={note}
              active={note.id === activeId}
              confirming={confirmId === note.id}
              onSelect={() => select(note.id)}
              onPin={() => togglePin(note.id)}
              onAskDelete={() => setConfirmId(note.id)}
              onCancelDelete={() => setConfirmId(null)}
              onConfirmDelete={() => { remove(note.id); setConfirmId(null) }}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center text-faint text-sm mt-10 px-4">
            {search ? 'No matches.' : 'No notes yet. Create your first.'}
          </div>
        )}
      </div>
    </aside>
  )
}

interface RowProps {
  note: Note; active: boolean; confirming: boolean
  onSelect: () => void; onPin: () => void
  onAskDelete: () => void; onCancelDelete: () => void; onConfirmDelete: () => void
}

function NoteRow({
  note, active, confirming,
  onSelect, onPin, onAskDelete, onCancelDelete, onConfirmDelete,
}: RowProps) {
  const preview = stripHtml(note.content).slice(0, 60)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onSelect}
      className={`group relative mb-1 rounded-lg px-3 py-2.5 cursor-pointer border transition-colors
        ${active ? 'bg-surface border-accent/30' : 'border-transparent hover:bg-surface/70'}`}
    >
      {active && (
        <motion.span layoutId="active-rail" className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-accent" />
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {note.pinned && <Pin size={11} className="text-accent shrink-0" fill="currentColor" />}
            <h3 className="font-medium text-sm truncate">{note.title || 'Untitled'}</h3>
          </div>
          <p className="text-xs text-muted truncate mt-0.5">{preview || 'No content'}</p>
          <span className="text-[10px] text-faint mt-1 block">{relativeTime(note.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onPin() }} title={note.pinned ? 'Unpin' : 'Pin'}
            className="grid place-items-center w-7 h-7 rounded-md text-muted hover:text-accent-strong hover:bg-raised">
            <Pin size={13} fill={note.pinned ? 'currentColor' : 'none'} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onAskDelete() }} title="Delete"
            className="grid place-items-center w-7 h-7 rounded-md text-muted hover:text-red-500 hover:bg-raised">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onClick={(e) => e.stopPropagation()} className="overflow-hidden"
          >
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-line">
              <span className="text-xs text-muted flex-1">Delete this note?</span>
              <button onClick={onConfirmDelete} className="text-xs px-2 py-1 rounded bg-red-500/15 text-red-500 hover:bg-red-500/25 transition-colors">Delete</button>
              <button onClick={onCancelDelete} className="text-xs px-2 py-1 rounded text-muted hover:text-fg transition-colors">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
