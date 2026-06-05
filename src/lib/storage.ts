import type { Note } from './types'
import { encrypt, decrypt, fingerprint, type EncryptedPayload } from './crypto'

const VAULT_KEY = 'zen.vault.v1'
const FP_KEY = 'zen.fp.v1'
const PLAIN_KEY = 'zen.notes.plain.v1'

/** Whether a passphrase-protected vault has been set up. */
export function hasVault(): boolean {
  return localStorage.getItem(FP_KEY) !== null
}

export async function verifyPassphrase(passphrase: string): Promise<boolean> {
  const stored = localStorage.getItem(FP_KEY)
  if (!stored) return false
  return (await fingerprint(passphrase)) === stored
}

export async function saveEncrypted(notes: Note[], passphrase: string): Promise<void> {
  const payload = await encrypt(JSON.stringify(notes), passphrase)
  localStorage.setItem(VAULT_KEY, JSON.stringify(payload))
  localStorage.setItem(FP_KEY, await fingerprint(passphrase))
  localStorage.removeItem(PLAIN_KEY)
}

export async function loadEncrypted(passphrase: string): Promise<Note[]> {
  const raw = localStorage.getItem(VAULT_KEY)
  if (!raw) return []
  const payload = JSON.parse(raw) as EncryptedPayload
  const json = await decrypt(payload, passphrase)
  return JSON.parse(json) as Note[]
}

/** Unencrypted fallback for users who skip the vault. */
export function savePlain(notes: Note[]): void {
  localStorage.setItem(PLAIN_KEY, JSON.stringify(notes))
}

export function loadPlain(): Note[] {
  const raw = localStorage.getItem(PLAIN_KEY)
  return raw ? (JSON.parse(raw) as Note[]) : []
}

export function disableVault(): void {
  localStorage.removeItem(VAULT_KEY)
  localStorage.removeItem(FP_KEY)
}
