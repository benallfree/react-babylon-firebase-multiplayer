import { Vector3 } from '@babylonjs/core'
import { PartialDeep } from 'type-fest'

export type UTCDate = number

export type PlayerName = string
export type PlayerAvatar = {
  shape: 'box' | 'sphere'
  color: string
}

export type Point3 = {
  x: number
  y: number
  z: number
}

export type PlayerState = {
  exp: UTCDate
  name: PlayerName
  avatar: PlayerAvatar
  position: Vector3
  rotation: Vector3
  movement: PlayerMovement
}

export type PlayerState_AtRest = PlayerState & { exp: number }

export type Unsafe<T> = PartialDeep<T>

export type PlayerCollection = {
  [name: string]: PlayerState
}

export type PlayerCollection_AtRest = {
  [name: string]: PlayerState_AtRest
}

export type PlayerMovement = {
  x: number
  z: number
}

export type PlayerAnnouncements = {
  [playerName: string]: UTCDate
}
