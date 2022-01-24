import { KeyboardEventTypes } from '@babylonjs/core'
import React, { useEffect } from 'react'
import { useScene } from 'react-babylonjs'
import { PlayerMovement } from '../types'

export const useKeyboardMovement = (
  setMovement: React.Dispatch<React.SetStateAction<PlayerMovement>>
) => {
  const scene = useScene()
  /**
   * Detect 'wasd' keyboard events and map to speed modifiers (meters per second)
   */
  useEffect(() => {
    if (!scene) return
    scene.onKeyboardObservable.add((kbInfo) => {
      const mapOn = {
        w: { z: 1 },
        s: { z: -1 },
        a: { x: -1 },
        d: { x: 1 }
      }
      const mapOff = {
        w: { z: 0 },
        s: { z: 0 },
        a: { x: 0 },
        d: { x: 0 }
      }
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN: {
          const { key } = kbInfo.event
          const _key = key as keyof typeof mapOn
          const adjust = mapOn[_key] || {}
          setMovement((oldMovement) => ({ ...oldMovement, ...adjust }))
          break
        }
        case KeyboardEventTypes.KEYUP: {
          const { key } = kbInfo.event
          const _key = key as keyof typeof mapOff
          const adjust = mapOff[_key] || {}
          setMovement((oldMovement) => ({ ...oldMovement, ...adjust }))
          break
        }
      }
    })
  }, [scene, setMovement])
}
