import { create } from 'zustand'
import type { Note, VaultState } from '../lib/types'
import * as storage from '../lib/storage'

const uid = () =>
  (crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2))

function makeNote(partial?: Partial<Note>): Note {
  const now = Date.now()
  return {
    id: uid(),
    title: 'Untitled',
    content: '',
    pinned: false,
    createdAt: now,
    updatedAt: now,
    wordGoal: 0,
    ...partial,
  }
}

interface NotesStore {
  notes: Note[]
  activeId: string | null
  vault: VaultState
  passphrase: string | null
  search: string
  ready: boolean

  init: () => void
  unlock: (passphrase: string) => Promise<boolean>
  createVault: (passphrase: string) => Promise<void>
  skipVault: () => void
  lock: () => void

  select: (id: string) => void
  create: () => void
  remove: (id: string) => void
  togglePin: (id: string) => void
  update: (id: string, patch: Partial<Note>) => void
  setSearch: (q: string) => void
  persist: () => void
}

export const useNotes = create<NotesStore>((set, get) => {
  let saveTimer: ReturnType<typeof setTimeout> | undefined

  const schedulePersist = () => {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => get().persist(), 700)
  }

  return {
    notes: [],
    activeId: null,
    vault: 'unset',
    passphrase: null,
    search: '',
    ready: false,

    init: () => {
      if (storage.hasVault()) {
        set({ vault: 'locked', ready: true })
      } else {
        const notes = storage.loadPlain()
        set({
          notes,
          vault: 'unset',
          activeId: notes[0]?.id ?? null,
          ready: true,
        })
      }
    },

    unlock: async (passphrase) => {
      const ok = await storage.verifyPassphrase(passphrase)
      if (!ok) return false
      const notes = await storage.loadEncrypted(passphrase)
      set({
        notes,
        passphrase,
        vault: 'unlocked',
        activeId: notes[0]?.id ?? null,
      })
      return true
    },

    createVault: async (passphrase) => {
      const notes = get().notes
      await storage.saveEncrypted(notes, passphrase)
      set({ passphrase, vault: 'unlocked' })
    },

    skipVault: () => set({ vault: 'unset' }),

    lock: () => {
      get().persist()
      set({ vault: 'locked', notes: [], activeId: null, passphrase: null })
    },

    select: (id) => set({ activeId: id }),

    create: () => {
      const note = makeNote({ title: 'New note' })
      set((s) => ({ notes: [note, ...s.notes], activeId: note.id }))
      schedulePersist()
    },

    remove: (id) => {
      set((s) => {
        const notes = s.notes.filter((n) => n.id !== id)
        const activeId = s.activeId === id ? (notes[0]?.id ?? null) : s.activeId
        return { notes, activeId }
      })
      schedulePersist()
    },

    togglePin: (id) => {
      set((s) => ({
        notes: s.notes.map((n) =>
          n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n,
        ),
      }))
      schedulePersist()
    },

    update: (id, patch) => {
      set((s) => ({
        notes: s.notes.map((n) =>
          n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n,
        ),
      }))
      schedulePersist()
    },

    setSearch: (q) => set({ search: q }),

    persist: () => {
      const { notes, vault, passphrase } = get()
      if (vault === 'unlocked' && passphrase) {
        void storage.saveEncrypted(notes, passphrase)
      } else if (vault === 'unset') {
        storage.savePlain(notes)
      }
    },
  }
})
