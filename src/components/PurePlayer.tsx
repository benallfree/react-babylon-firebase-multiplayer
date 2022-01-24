import { Color3, Mesh, Vector3 } from '@babylonjs/core'
import invert from 'invert-color'
import React, { FC, useMemo } from 'react'
import { Html } from 'react-babylonjs'
import { PlayerState } from '../types'

export type PurePlayerProps = {
  meshRef: React.RefObject<Mesh>
  state: PlayerState
}

/**
 * A pure presentation layer component concerned only with
 * rendering based on props. I thnk this causes a flicker.
 * It also passes a meshRef back to the parent for optimistic
 * changes made in the animation loop.
 *
 */
export const PurePlayer: FC<PurePlayerProps> = (props) => {
  const { state, meshRef } = props
  const { name, position, rotation, avatar } = state

  const { shape } = avatar

  const Shape = useMemo(() => {
    const Box: FC = ({ children }) => (
      <box name={name} size={1}>
        {children}
      </box>
    )
    const Sphere: FC = ({ children }) => (
      <sphere name={name} diameter={1}>
        {children}
      </sphere>
    )
    return shape === 'box' ? Box : Sphere
  }, [name, shape])

  return (
    <transformNode ref={meshRef} position={position} rotation={rotation} name="transform-node">
      <Shape>
        <standardMaterial
          name="progress-mat"
          diffuseColor={Color3.FromHexString(avatar.color)}
          specularColor={Color3.FromHexString(avatar.color)}
        />
        <Html name="html" center position={new Vector3(0, 1.25, 0)} occlude={false}>
          {
            <div
              style={{
                backgroundColor: avatar.color,
                color: invert(avatar.color),
                borderRadius: '5px',
                border: `1px solid ${invert(avatar.color)}`,
                padding: '4px'
              }}
            >
              {name}
            </div>
          }
        </Html>
      </Shape>
    </transformNode>
  )
}
