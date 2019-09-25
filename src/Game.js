import {
    Engine,
    Scene,
    CannonJSPlugin,
    Vector3,
} from 'babylonjs'

import * as cannon from 'cannon'
import 'babylonjs-loaders'

import Player from './components/Player/Player'
import UserControls from './components/Player/UserControls'

import createLight from './components/World/createLight'
import createGround from './components/World/createGround'

import modelLoader from './components/Loaders/modelLoader'

function Game () {
    const canvas = document.getElementById('renderCanvas')
    window.addEventListener( 'click', () => canvas.requestPointerLock() )
    
    const engine = new Engine( canvas, true )
    window.addEventListener( 'resize', () => engine.resize() )

    const scene = new Scene( engine )
    scene.enablePhysics( null, new CannonJSPlugin( true, 10, cannon ))

    createLight( scene )
    createGround( scene )

    const player = new Player( canvas, scene )
    const controls = new UserControls()


    modelLoader( scene ).then(() => {
        engine.runRenderLoop(() => {
            scene.squelettes.forEach( squelette => squelette.Squelette.move())

            player.move( controls )
            player.fireFireballs( controls.isBPressed )
            player.fireLaser( controls.isFPressed )

            scene.render()
        })
    })
}
export default Game