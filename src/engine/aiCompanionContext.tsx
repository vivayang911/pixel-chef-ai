import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'
import type { AIMood } from '@/engine/aiChefEngine'

export interface AICompanionState {
  mood: AIMood
  message: string | null
  messageVisible: boolean
}

interface AICompanionContextValue {
  state: AICompanionState
  setMood: (mood: AIMood) => void
  showMessage: (msg: string, durationMs?: number) => void
  hideMessage: () => void
}

const AICompanionContext = createContext<AICompanionContextValue | null>(null)

export function AICompanionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AICompanionState>({
    mood: 'idle',
    message: null,
    messageVisible: false,
  })
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setMood = useCallback((mood: AIMood) => {
    setState((prev) => ({ ...prev, mood }))
  }, [])

  const showMessage = useCallback((msg: string, durationMs = 5000) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    setState((prev) => ({ ...prev, message: msg, messageVisible: true }))
    if (durationMs > 0) {
      hideTimerRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, messageVisible: false }))
      }, durationMs)
    }
  }, [])

  const hideMessage = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    setState((prev) => ({ ...prev, messageVisible: false }))
  }, [])

  return (
    <AICompanionContext.Provider value={{ state, setMood, showMessage, hideMessage }}>
      {children}
    </AICompanionContext.Provider>
  )
}

export function useAICompanion() {
  const ctx = useContext(AICompanionContext)
  if (!ctx) throw new Error('useAICompanion must be used within AICompanionProvider')
  return ctx
}
