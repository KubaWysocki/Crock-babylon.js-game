import {
    Engine,
    Scene,
    CannonJSPlugin,
    Vector3,
} from 'babylonjs'

import * as cannon from 'cannon'
import 'babylonjs-loaders'

import Player from './components/Player/Player'
import Light from './components/World/Light'
import Ground from './components/World/Ground'

import ModelLoader from './components/Loaders/ModelLoader'

function Game () {
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

    const engine = new Engine( canvas, true )
    window.addEventListener( 'resize', () => engine.resize() )

    const scene = new Scene( engine )
    scene.collisionsEnabled = true
    scene.enablePhysics( new Vector3( 0, -9.81, 0 ), new CannonJSPlugin( true, 10, cannon ))

    const light = Light( scene )
    const ground = Ground( scene )

    const player = new Player( canvas, 'player', new Vector3( 0,4,0 ), scene )

    ModelLoader( scene ).then(() => {
        engine.runRenderLoop( () => {
            for( let i=0; i<scene.squelettes.length; i++ ) scene.squelettes[i].Squelette.move()

            player.fireFireballs( isBPressed )
            player.fireLaser( isFPressed )

            scene.render()
        })
    })
}
export default Game