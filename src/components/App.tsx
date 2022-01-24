import randomColor from 'randomcolor'
import { FC, useState } from 'react'
import ShortUniqueId from 'short-unique-id'
import { createBot } from '../ai/createBot'
import { Game } from './Game'
import { PlayerAvatar } from '../types'

const App: FC = () => {
  const uid = new ShortUniqueId({ length: 5 })

  const [name, setName] = useState(`player_${uid()}`)
  const [botCount, setBotCount] = useState(5)
  const [avatar, setAvatar] = useState<PlayerAvatar>({
    shape: 'sphere',
    color: `${randomColor()}`
  })
  const [isInGame, setInGame] = useState(false)

  const handleEnterGame = async () => {
    for (let i = 0; i < botCount; i++) {
      createBot()
    }
    setInGame(true)
  }

  // if (!isInGame) handleEnterGame()

  const Lobby = () => (
    <div>
      <div>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        Avatar Shape:
        <select
          value={avatar.shape}
          onChange={(e) =>
            setAvatar((old) => ({
              ...old,
              shape: e.target.value.trim() as 'box' | 'sphere'
            }))
          }
        >
          {['box', 'sphere'].map((shape) => (
            <option key={shape} value={shape}>
              {shape}
            </option>
          ))}
        </select>
      </div>
      <div>
        Avatar Color:
        <input
          type="text"
          value={avatar.color}
          onChange={(e) => setAvatar((old) => ({ ...old, color: e.target.value.trim() }))}
        />
      </div>
      <div>
        # Bots:
        <select value={botCount} onChange={(e) => setBotCount(parseInt(e.target.value, 10))}>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button disabled={name.length === 0 || avatar.color.length === 0} onClick={handleEnterGame}>
          Enter Game
        </button>
      </div>
      <hr />
    </div>
  )

  if (!isInGame) return <Lobby />
  return <Game name={name} avatar={avatar} />
}

export default App
