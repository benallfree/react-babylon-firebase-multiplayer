import { Mesh } from '@babylonjs/core'
import { forEach, map } from '@s-libs/micro-dash'
import { FC, useEffect, useRef, useState } from 'react'
import { CleanupFunc, onAnyPlayerUpdated } from '../network/db'
import { PurePlayer } from './PurePlayer'
import { PlayerCollection, Unsafe } from '../types'

export const RemotePlayers: FC = () => {
  const [players, setPlayers] = useState<PlayerCollection>({})
  const meshRef = useRef<Mesh>(null)
  useEffect(() => {
    const cleanup: CleanupFunc[] = []

    const unsub = onAnyPlayerUpdated((player) => {
      const { name } = player
      if (!name) return
      setPlayers((players) => ({ ...players, [name]: player }))
    })
    cleanup.push(unsub)

    return () => cleanup.forEach((c) => c())
  }, [])

  /**
   * Old bots that drop out of the game need to be cleaned
   * up. We don't have a way of detecting when they stop
   * updating except to examine the timeout
   */
  useEffect(() => {
    const cull = () => {
      setPlayers((oldPlayers) => {
        const newPlayers = { ...oldPlayers }
        const now = +new Date()
        forEach(oldPlayers, (p) => {
          const { name, exp } = p
          if (exp < now) delete newPlayers[name]
        })
        return newPlayers
      })
    }

    const tid = setInterval(cull, 1000)

    return () => {
      clearInterval(tid)
    }
  }, [])

  return (
    <>
      {map(players, (p) => (
        <PurePlayer meshRef={meshRef} key={p.name} state={p} />
      ))}
    </>
  )
}
