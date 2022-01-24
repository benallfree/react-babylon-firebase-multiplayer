import { Mesh } from '@babylonjs/core'
import { useScene } from 'react-babylonjs'
import { useBeforeRender } from './useBeforeRender'
import { forEach } from '@s-libs/micro-dash'
import { PlayerMovement } from '../types'

/**
 * Optimistic movement for frame animation. These movements not get broadcast
 * Eventually this will correctly sync with the player's true position.
 */
export const useOptimisticPlayerMovement = (meshRef: Mesh | null, movement: PlayerMovement) => {
  const scene = useScene()
  useBeforeRender(
    () => {
      if (!meshRef) return
      if (!scene) return
      // console.log(meshRef.current)
      /**
       * Calculate the movement for each axis, bound by the edges of the play area
       */
      const { x, z } = movement
      const deltaTimeInSeconds = scene.getEngine().getDeltaTime() / 1000
      const { position } = meshRef
      forEach(movement, (axisValue, axisKey) => {
        const newValue = position[axisKey] + axisValue * Math.PI * 2 * deltaTimeInSeconds
        const boundValue = Math.max(
          -14,
          Math.min(
            newValue,

            14
          )
        )
        position[axisKey] = boundValue
      })

      /**
       * If the player is moving, spin them
       */
      if (x !== 0 || z !== 0) {
        const revolutionsPerSecond = 3
        meshRef.rotation.y += revolutionsPerSecond * Math.PI * 2 * deltaTimeInSeconds
      }
    },
    undefined,
    undefined,
    undefined,
    [scene, meshRef, movement]
  )
}
