import { Mesh, Vector3 } from '@babylonjs/core'
import { FC, useEffect, useRef, useState } from 'react'
import { useOptimisticPlayerMovement } from '../hooks/useOptimisticPlayerMovement'
import { usePlayerHeartbeat } from '../hooks/usePlayerHeartbeat'
import { announcePlayer, savePlayerState } from '../network/db'
import { PlayerAvatar, PlayerMovement, PlayerName, PlayerState } from '../types'
import { randomPosition } from '../util'
import { PurePlayer } from './PurePlayer'
import { useKeyboardMovement } from '../hooks/useKeyboardMovement'
import { useBroadcastMovement } from '../hooks/useBroadcastMovement'

export type LocalPlayerProps = {
  name: PlayerName
  avatar: PlayerAvatar
}

/**
 * High Order Component containing all kinds of state management
 * and synchronization logic. Study all the hooks for full understanding.
 *
 */
export const LocalPlayer: FC<LocalPlayerProps> = (props) => {
  const { name, avatar } = props
  const exp = +new Date() + 5000
  const [position, setPosition] = useState(randomPosition())
  const [rotation, setRotation] = useState(Vector3.Zero())
  const [movement, setMovement] = useState<PlayerMovement>({
    x: 0,
    z: 0
  })
  const meshRef = useRef<Mesh>(null)
  useOptimisticPlayerMovement(meshRef.current, movement)

  /**
   * Announce that this player is in the game by sending the initial state
   */
  useEffect(() => {
    const state: PlayerState = {
      exp,
      name,
      avatar,
      position,
      rotation,
      movement
    }
    announcePlayer(state)
  }, [])

  /**
   * Send the heartbeat ever 1s
   */
  usePlayerHeartbeat(name)

  /**
   * Any time the position changes, broadcast it
   */
  useEffect(() => {
    savePlayerState(name, { position })
  }, [name, position])

  /**
   * Any time the rotation changes, broadcast it
   */
  useEffect(() => {
    savePlayerState(name, { rotation })
  }, [name, rotation])

  /**
   * Any time the player's movement changes, broadcast it
   */
  useEffect(() => {
    savePlayerState(name, { movement })
  }, [name, movement])

  /**
   * Keyboard controls and optimistic movement
   */
  useKeyboardMovement(setMovement)

  /**
   * Broadcast position periodically when movement is active
   */
  useBroadcastMovement(name, movement, meshRef.current?.position, setPosition)

  return (
    <PurePlayer meshRef={meshRef} state={{ exp, name, avatar, position, rotation, movement }} />
  )
}
