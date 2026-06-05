/**
 * Zen Notes encryption layer
 * Uses the Web Crypto API for genuine client-side encryption.
 * Notes are encrypted with AES-GCM 256. The key is derived from the user's
 * passphrase via PBKDF2 (310k iterations, SHA-256). Nothing leaves the device,
 * and the plaintext is never written to disk.
 */

const ITERATIONS = 310_000
const SALT_BYTES = 16
const IV_BYTES = 12

const enc = new TextEncoder()
const dec = new TextDecoder()

function toBase64(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}

function fromBase64(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export interface EncryptedPayload {
  v: 1
  salt: string
  iv: string
  data: string
}

export async function encrypt(plaintext: string, passphrase: string): Promise<EncryptedPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const key = await deriveKey(passphrase, salt)
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext),
  )
  return {
    v: 1,
    salt: toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(cipher)),
  }
}

export async function decrypt(payload: EncryptedPayload, passphrase: string): Promise<string> {
  const salt = fromBase64(payload.salt)
  const iv = fromBase64(payload.iv)
  const key = await deriveKey(passphrase, salt)
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    fromBase64(payload.data),
  )
  return dec.decode(plain)
}

/** A short, non-reversible fingerprint of the passphrase, used only to verify
 *  the same passphrase is entered on unlock. Never stores the passphrase itself. */
export async function fingerprint(passphrase: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', enc.encode('zen::' + passphrase))
  return toBase64(new Uint8Array(hash)).slice(0, 12)
}
