import { Vector3 } from '@babylonjs/core'
import { pick } from '@s-libs/micro-dash'
import { Point3 } from './types'

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}

export const randomPosition = () =>
  new Vector3(getRandomIntInclusive(-13, 13), 1, getRandomIntInclusive(-15, 15))

export const narrowToPoint3 = (_in: Point3): Point3 => pick(_in, 'x', 'y', 'z')

export const point3ToVector3 = (point: Point3): Vector3 => {
  const { x, y, z } = point
  return new Vector3(x, y, z)
}
