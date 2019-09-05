import {
    Engine,
    Scene,
    SceneLoader,
    CannonJSPlugin,
    Vector3,
} from 'babylonjs'

import * as cannon from 'cannon'
import 'babylonjs-loaders'
import 'babylonjs-materials'


import Player from './components/Player'
import Light from './components/Light'
import Ground from './components/Ground'
import Troll from './components/Troll'

const Game = () => {

    const canvas = document.getElementById('renderCanvas')
    window.addEventListener( 'click', () => canvas.requestPointerLock() )

    let isBPressed = false
    window.addEventListener( 'keydown', e => e.keyCode === 66 ? isBPressed = true : null )
    window.addEventListener( 'keyup', e => e.keyCode === 66 ? isBPressed = false : null )

    const engine = new Engine( canvas, true )
    window.addEventListener( 'resize', () => engine.resize() )

    SceneLoader.OnPluginActivatedObservable.addOnce( plugin => {
        if (plugin.name === "gltf") {
            plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE
        }
    })

    const scene = new Scene( engine )
    scene.enablePhysics( null, new CannonJSPlugin( true, 10, cannon ) )
    scene.collisionsEnabled = true

    const light = Light( scene )

    const player = Player( canvas, scene )
    const troll = Troll( scene, 5 )

    const ground = Ground( scene )

    engine.runRenderLoop( () => {
        for( let i=0; i<scene.trolls.length; i++ ){
            if( scene.trolls[i] ){
                scene.trolls[i].trollBehavior.move()
            }
        }
        player.fire( isBPressed )

        scene.render()
    })
}
export default Game