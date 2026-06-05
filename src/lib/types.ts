export interface Note {
  id: string
  title: string
  content: string
  pinned: boolean
  createdAt: number
  updatedAt: number
  wordGoal: number
}

export type VaultState = 'locked' | 'unlocked' | 'unset'
