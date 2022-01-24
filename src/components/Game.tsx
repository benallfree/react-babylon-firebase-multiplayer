import { Vector3 } from '@babylonjs/core'
import { FC } from 'react'
import { Engine, Scene } from 'react-babylonjs'
import { LocalPlayer, LocalPlayerProps } from './LocalPlayer'
import { RemotePlayers } from './RemotePlayers'

export const Game: FC<LocalPlayerProps> = (props) => {
  const { name, avatar } = props

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
        <Scene>
          <freeCamera
            name="camera1"
            position={new Vector3(0, 13, -28)}
            setTarget={[Vector3.Zero()]}
          />
          <hemisphericLight name="light1" intensity={0.7} direction={new Vector3(0, 1, 1)} />
          <LocalPlayer name={name} avatar={avatar} />
          <RemotePlayers />
          <ground name="ground" width={30} height={30} />
        </Scene>
      </Engine>
    </div>
  )
}
