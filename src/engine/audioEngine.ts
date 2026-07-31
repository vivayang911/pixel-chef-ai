/**
 * Audio engine placeholder — console-based for now.
 *
 * Swap in real Web Audio or Howler.js sound effects when
 * audio assets become available.
 *
 * Usage:
 *   import { click, success, cooking } from '@/engine/audioEngine'
 *   click()   // UI interaction
 *   success() // dish complete
 *   cooking() // sizzle loop
 */

const DEBUG = import.meta.env.DEV

/** Button click / ingredient pick sound. */
export function playClick(label = 'click') {
  if (DEBUG) console.log(`🔊 [AUDIO] ${label}`)
}

/** Success fanfare after completing a dish. */
export function playSuccess(label = 'dish-complete') {
  if (DEBUG) console.log(`🎵 [AUDIO] ${label}`)
}

/** Ambient cooking sizzle (loop start/stop placeholder). */
export function playCooking(label = 'sizzle-loop') {
  if (DEBUG) console.log(`🍳 [AUDIO] ${label}`)
}

/** Error / oops sound. */
export function playError(label = 'error') {
  if (DEBUG) console.log(`😅 [AUDIO] ${label}`)
}
