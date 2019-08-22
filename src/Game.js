import {
    Engine,
    Scene, 
    Vector3,
    Color3,
    SceneLoader,
} from 'babylonjs'

import 'babylonjs-loaders'

import Camera from './components/Camera'
import Light from './components/Light'
import Ground from './components/Ground'
import Troll from './components/Troll'


const Game = () => {
    const canvas = document.getElementById('renderCanvas')
    window.addEventListener( 'click', () => canvas.requestPointerLock() )

    SceneLoader.OnPluginActivatedObservable.addOnce(function (plugin) {
        if (plugin.name === "gltf") {
            plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE
        }
    })

    const engine = new Engine( canvas, true )
    window.addEventListener( 'resize', () => engine.resize() )

    const scene = new Scene( engine )
    scene.gravity = new Vector3(0, -9.8, 0)
    scene.collisionsEnabled = true

    const light = Light( scene )

    const camera = Camera( canvas, scene )
    const troll = Troll( scene )

    const ground = Ground( scene )

    engine.runRenderLoop( () => {
        for( let i=0; i<scene.trolls.length; i++ ){
            if( scene.trolls[i] ){
                scene.trolls[i].trollBehavior.move()
            }
        }
        scene.render()
    })
}
export default Game