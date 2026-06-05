import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import {
  Bold, Italic, Heading1, Heading2, List, ListOrdered,
  Quote, Code, Link2, Undo2, Redo2, Eraser,
} from 'lucide-react'
import { useNotes } from '../store/useNotes'
import { countWords } from '../lib/text'

interface ToolButton {
  icon: typeof Bold
  label: string
  run: () => void
}

export function Editor() {
  const note = useNotes((s) => s.notes.find((n) => n.id === s.activeId) ?? null)
  const update = useNotes((s) => s.update)
  const ref = useRef<HTMLDivElement>(null)
  const lastId = useRef<string | null>(null)

  // Sync DOM only when the active note changes (avoids caret jumps while typing)
  useEffect(() => {
    if (!ref.current || !note) return
    if (lastId.current !== note.id) {
      ref.current.innerHTML = note.content
      lastId.current = note.id
    }
  }, [note])

  const onInput = useCallback(() => {
    if (!ref.current || !note) return
    update(note.id, { content: ref.current.innerHTML })
  }, [note, update])

  const exec = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      ref.current?.focus()
      onInput()
    },
    [onInput],
  )

  const makeLink = useCallback(() => {
    const url = window.prompt('Link URL')
    if (url) exec('createLink', url)
  }, [exec])

  if (!note) {
    return (
      <div className="flex-1 grid place-items-center text-muted">
        <div className="text-center">
          <p className="font-serif text-2xl text-muted mb-1">Nothing selected</p>
          <p className="text-sm">Choose a note, or create a new one.</p>
        </div>
      </div>
    )
  }

  const groups: ToolButton[][] = [
    [
      { icon: Bold, label: 'Bold', run: () => exec('bold') },
      { icon: Italic, label: 'Italic', run: () => exec('italic') },
    ],
    [
      { icon: Heading1, label: 'Heading 1', run: () => exec('formatBlock', '<h1>') },
      { icon: Heading2, label: 'Heading 2', run: () => exec('formatBlock', '<h2>') },
    ],
    [
      { icon: List, label: 'Bullet list', run: () => exec('insertUnorderedList') },
      { icon: ListOrdered, label: 'Numbered list', run: () => exec('insertOrderedList') },
      { icon: Quote, label: 'Quote', run: () => exec('formatBlock', '<blockquote>') },
      { icon: Code, label: 'Code', run: () => exec('formatBlock', '<pre>') },
      { icon: Link2, label: 'Link', run: makeLink },
    ],
    [
      { icon: Undo2, label: 'Undo', run: () => exec('undo') },
      { icon: Redo2, label: 'Redo', run: () => exec('redo') },
      { icon: Eraser, label: 'Clear format', run: () => exec('removeFormat') },
    ],
  ]

  const words = countWords(note.content)
  const goalPct = note.wordGoal > 0 ? Math.min((words / note.wordGoal) * 100, 100) : 0

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-canvas">
      {/* Title */}
      <div className="px-8 lg:px-16 pt-10 pb-2 max-w-3xl w-full mx-auto">
        <input
          value={note.title}
          onChange={(e) => update(note.id, { title: e.target.value })}
          placeholder="Untitled"
          className="w-full bg-transparent font-serif text-3xl lg:text-4xl font-semibold text-fg placeholder:text-faint focus:outline-none"
        />
      </div>

      {/* Toolbar */}
      <div className="px-8 lg:px-16 max-w-3xl w-full mx-auto">
        <div className="flex flex-wrap items-center gap-1 py-2 border-y border-line">
          {groups.map((group, gi) => (
            <div key={gi} className="flex items-center gap-0.5 px-1
              [&:not(:last-child)]:border-r [&:not(:last-child)]:border-line">
              {group.map(({ icon: Icon, label, run }) => (
                <button
                  key={label}
                  onClick={run}
                  title={label}
                  className="grid place-items-center w-8 h-8 rounded-md text-muted
                    hover:text-accent-strong hover:bg-raised transition-colors"
                >
                  <Icon size={17} strokeWidth={2} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Writing surface */}
      <div className="flex-1 overflow-y-auto px-8 lg:px-16">
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
          data-placeholder="Begin writing…"
          className="editor-surface max-w-3xl w-full mx-auto py-8 text-[1.05rem] text-fg min-h-[50vh]"
        />
      </div>

      {/* Status bar */}
      <div className="px-8 lg:px-16 py-3 border-t border-line bg-raised">
        <div className="max-w-3xl w-full mx-auto flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-4">
            <span>{words} {words === 1 ? 'word' : 'words'}</span>
            {note.wordGoal > 0 && (
              <div className="flex items-center gap-2">
                <span>goal {note.wordGoal}</span>
                <div className="w-24 h-1 rounded-full bg-line overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    initial={false}
                    animate={{ width: `${goalPct}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
            )}
          </div>
          <GoalSetter
            value={note.wordGoal}
            onChange={(g) => update(note.id, { wordGoal: g })}
          />
        </div>
      </div>
    </div>
  )
}

function GoalSetter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer hover:text-accent-strong transition-colors">
      <span>word goal</span>
      <input
        type="number"
        min={0}
        value={value || ''}
        placeholder="-"
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className="w-16 bg-surface border border-line rounded px-2 py-0.5 text-fg
          focus:outline-none focus:border-accent/40 text-center"
      />
    </label>
  )
}
