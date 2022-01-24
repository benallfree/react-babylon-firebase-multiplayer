import { Vector3 } from '@babylonjs/core'
import { useEffect } from 'react'
import { savePlayerState } from '../network/db'
import { PlayerMovement, Point3 } from '../types'
import { forEach } from '@s-libs/micro-dash'

export const useBroadcastMovement = (
  name: string,
  movement: PlayerMovement,
  realPosition: Vector3 | undefined,
  setPosition: React.Dispatch<React.SetStateAction<Vector3>>
) => {
  const { x, z } = movement
  useEffect(() => {
    if (!realPosition) return
    const _update = () => {
      console.log('updating')
      setPosition((oldPosition) => {
        const newPosition = oldPosition.clone()
        forEach(['x', 'y', 'z'], (axis) => {
          const _axis = axis as keyof Point3
          newPosition[_axis] = realPosition[_axis]
        })
        savePlayerState(name, { position: newPosition })
        console.log(name, newPosition)
        return newPosition
      })
    }

    /**
     * If movement has stopped, update one last time
     */
    if (x === 0 && z === 0) {
      _update()
      return
    }

    /**
     * If movement is active, send position every 100ms
     */
    const tid = setInterval(_update, 100)
    return () => {
      console.log('clearing')
      clearInterval(tid)
    }
  }, [name, x, z, realPosition, setPosition])
}
