import { useEffect, useRef, useState } from "react"

export function useSessionState<T>(key: string, initial: T) {
  const read = () => {
    if (typeof window === "undefined") return initial
    try {
      const raw = sessionStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  }

  const [state, setState] = useState<T>(read)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    try {
      sessionStorage.setItem(key, JSON.stringify(state))
    } catch {}
  }, [key, state])

  return [state, setState] as const
}
