import { useEffect } from 'react'
import { savePlayerState } from '../network/db'

export const usePlayerHeartbeat = (name: string) => {
  useEffect(() => {
    const tid = setInterval(() => {
      savePlayerState(name, {}) // Ping
    }, 1000)

    return () => clearInterval(tid)
  }, [name])
}
