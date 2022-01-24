import { Vector3 } from '@babylonjs/core'
import { forEach, pick, reduce } from '@s-libs/micro-dash'
import Schema from 'validate'
import isHexColor from 'validator/es/lib/isHexColor'
import {
  PlayerAnnouncements,
  PlayerCollection,
  PlayerCollection_AtRest,
  PlayerName,
  PlayerState,
  PlayerState_AtRest,
  Unsafe
} from '../types'
import { point3ToVector3 } from '../util'
import { db } from './firebase'

const isActive = (n: number) => n >= +new Date()

const playerStateValidator = new Schema({
  exp: {
    type: Number,
    required: true,
    use: { isActive }
  },
  name: {
    type: String,
    required: true,
    length: { min: 3, max: 32 }
  },
  avatar: {
    shape: {
      type: String,
      required: true,
      enum: ['box', 'sphere']
    },
    color: {
      type: String,
      required: true,
      use: { isHexColor }
    }
  },
  position: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    z: {
      type: Number,
      required: true
    }
  },
  rotation: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    z: {
      type: Number,
      required: true
    }
  }
})

export type UpdateCollection = {
  [path: string]: any
}

const path = (...rest: string[]) => {
  return [`rooms/1337/players`, ...rest].join('/')
}

const statePath = (...rest: string[]) => path('state', ...rest)
const announcePath = (...rest: string[]) => path('announce', ...rest)

export const savePlayerState = (name: PlayerName, player: Partial<PlayerState>) => {
  const { update } = db
  const updates = reduce(
    { ...player, exp: +new Date() + 5000 },
    (c, v, k) => {
      const _v = (() => {
        if (v instanceof Vector3) return pick(v, 'x', 'y', 'z')
        return v
      })()
      c[statePath(name, k)] = _v
      return c
    },
    {} as UpdateCollection
  )

  update(updates)
}

export const pingPlayer = (name: PlayerName) => {
  const { set } = db
  return set<number>(statePath(name, 'exp'), +new Date() + 5000)
}

export const removePlayerState = (name: string) => {
  const { remove } = db
  return remove(statePath(name))
}

export const getAllPlayersOnce = async () => {
  const { getOnce } = db
  const players = await getOnce<PlayerCollection_AtRest>(statePath())
  const now = +new Date()
  const culled = reduce(
    players,
    (c, p, name) => {
      if (!p) return c
      const _name = name.toString()
      const { exp = 0 } = p
      if (exp < now) {
        removePlayerState(_name)
        return c
      }
      c[_name] = p
      return c
    },
    {} as Unsafe<PlayerCollection>
  )
  return culled
}

const isIncomingPlayerStateValid = (
  player: Unsafe<PlayerState_AtRest>
): player is PlayerState_AtRest => {
  const res = playerStateValidator.validate(player)
  const isValid = res.length === 0
  if (!isValid) {
    console.warn(`Player is invalid`, JSON.stringify(player), JSON.stringify(res))
    return false
  }
  return true
}

const sanitizePlayerState = (player: Unsafe<PlayerState_AtRest>): PlayerState | false => {
  if (!isIncomingPlayerStateValid(player)) return false

  const { exp, name, avatar, position, rotation } = player
  return {
    exp,
    name,
    avatar,
    position: point3ToVector3(position),
    rotation: point3ToVector3(rotation),
    movement: { x: 0, z: 0 }
  }
}

// Watch for single player state change by name
export const onSinglePlayerUpdated = (name: PlayerName, cb: OnPlayerUpdatedFunc) => {
  const { onValue } = db
  const unsub = onValue<PlayerState_AtRest>(statePath(name), (player) => {
    if (!player) return
    // Cull if player is invalid for any reason
    const _player = sanitizePlayerState(player)

    if (!_player) {
      removePlayerState(name)
      return
    }
    cb(_player)
  })
  return unsub
}

export type OnNewPlayerFunc = (player: PlayerName) => void
export const onNewPlayer = (cb: OnNewPlayerFunc) => {
  const { onValue, remove } = db
  const announced: { [_: PlayerName]: boolean } = {}
  const unsub = onValue<PlayerAnnouncements>(announcePath(), (players) => {
    const now = +new Date()
    forEach(players, (exp = 0, name) => {
      if (exp < now) {
        remove(announcePath(name))
        return
      }
      if (announced[name]) return
      announced[name] = true
      cb(name)
    })
  })
  return unsub
}

export type CleanupFunc = () => void

export type OnPlayerUpdatedFunc = (player: PlayerState) => void
export const onAnyPlayerUpdated = (cb: OnPlayerUpdatedFunc) => {
  const watching: { [_: PlayerName]: boolean } = {}
  const cleanup: CleanupFunc[] = []

  // Watch initial list of players
  getAllPlayersOnce().then((players) => {
    forEach(players, (player) => {
      if (!player) return
      const _player = sanitizePlayerState(player)
      if (!_player) {
        if (player.name) removePlayerState(player.name)
        return
      }

      const { name } = _player
      if (watching[name]) return
      watching[name] = true
      const unsub = onSinglePlayerUpdated(name, cb)
      cleanup.push(unsub)
    })
  })

  // Watch for new players
  const unsub = onNewPlayer((name) => {
    if (watching[name]) return
    watching[name] = true
    const unsub = onSinglePlayerUpdated(name, cb)
    cleanup.push(unsub)
  })
  cleanup.push(unsub)

  return () => cleanup.forEach((c) => c())
}

export const announcePlayer = (player: PlayerState) => {
  const { update } = db
  const { name } = player
  const updates: UpdateCollection = {
    [announcePath(name)]: +new Date() + 5000
  }
  savePlayerState(player.name, player)
  update(updates)
}
