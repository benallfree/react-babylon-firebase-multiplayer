import { Nullable, Observer, Scene as BabylonScene } from '@babylonjs/core'
import { useContext, useEffect } from 'react'
import { OnFrameRenderFn, SceneContext } from 'react-babylonjs'

// Pulling it out of the lib so we can use the fixed version
export const useBeforeRender = (
  callback: OnFrameRenderFn,
  mask?: number,
  insertFirst?: boolean,
  callOnce?: boolean,
  deps: React.DependencyList = []
): void => {
  const { scene } = useContext(SceneContext)

  useEffect(() => {
    if (scene === null) {
      return
    }
    const unregisterOnFirstCall: boolean = callOnce === true
    const sceneObserver: Nullable<Observer<
      BabylonScene
    >> = scene.onBeforeRenderObservable.add(
      callback,
      mask,
      insertFirst,
      undefined,
      unregisterOnFirstCall
    )

    if (unregisterOnFirstCall !== true) {
      return () => {
        scene.onBeforeRenderObservable.remove(sceneObserver)
      }
    }
  }, [scene, callOnce, insertFirst, mask, callback, ...deps])
}
