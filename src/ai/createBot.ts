import { Vector3 } from '@babylonjs/core'
import randomColor from 'randomcolor'
import ShortUniqueId from 'short-unique-id'
import { announcePlayer, pingPlayer } from '../network/db'
import { PlayerState } from '../types'
import { randomPosition } from '../util'

export const createBot = async () => {
  const uid = new ShortUniqueId({ length: 5 })

  const botInfo: PlayerState = {
    exp: +new Date() + 5000,
    name: `bot_${uid()}`,
    avatar: {
      shape: 'box',
      color: `${randomColor()}`
    },
    position: randomPosition(),
    rotation: Vector3.Zero()
  }

  const { name, avatar } = botInfo

  announcePlayer(botInfo)
  setInterval(() => {
    pingPlayer(name)
  }, 1000)
}
