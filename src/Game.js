import {
    Engine,
    Scene,
    SceneLoader,
    CannonJSPlugin,
} from 'babylonjs'

import * as cannon from 'cannon'
import 'babylonjs-loaders'

import Player from './components/Player/Player'
import Light from './components/World/Light'
import Ground from './components/World/Ground'
import Troll from './components/Mobs/Troll'

const Game = () => {
    const canvas = document.getElementById('renderCanvas')
    window.addEventListener( 'click', () => canvas.requestPointerLock() )

    let isBPressed = false
    let isFPressed = false
    window.addEventListener( 'keydown', e => {
        switch( e.keyCode ){
            case 66: isBPressed = true; break
            case 70: isFPressed = true; break
        }
    })
    window.addEventListener( 'keyup', e => {
        switch( e.keyCode ){
            case 66: isBPressed = false; break
            case 70: isFPressed = false; break
        }
    })

    SceneLoader.OnPluginActivatedObservable.addOnce( plugin => 
        plugin.name === "gltf" ?  plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE : null )

    const engine = new Engine( canvas, true )
    window.addEventListener( 'resize', () => engine.resize() )

    const scene = new Scene( engine )
    scene.enablePhysics( null, new CannonJSPlugin( true, 10, cannon ))
    scene.collisionsEnabled = true

    const light = Light( scene )
    const ground = Ground( scene )

    const player = Player( canvas, scene )
    const troll = Troll( scene, 15 )

    
    engine.runRenderLoop( () => {
        for( let i=0; i<scene.trolls.length; i++ ){
            if( scene.trolls[i] ){
                scene.trolls[i].trollBehavior.move()
            }
        }
        player.fireFireballs( isBPressed )
        player.fireLaser( isFPressed )

        scene.render()
    })
}
export default Game