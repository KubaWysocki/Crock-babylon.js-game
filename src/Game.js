import {
    Engine,
    Scene,
    CannonJSPlugin,
    PhysicsViewer
} from 'babylonjs'

import * as cannon from 'cannon'

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
    scene.enablePhysics( null, new CannonJSPlugin( true, 100, cannon ))

    createLight( scene )
    createGround( scene )

    const player = new Player( canvas, scene )
    const controls = new UserControls()


    modelLoader( scene ).then(() => {
        scene.registerBeforeRender(() => {
            scene.squelettes.forEach( squelette => squelette.Squelette.move() )

            player.behavior( controls )

        })
        engine.runRenderLoop(() => scene.render() )
    })
    // .then(() => {
    //     const physicsViewer = new PhysicsViewer( scene )
    //     scene.squelettes.forEach( mesh => physicsViewer.showImpostor(mesh.Squelette.physicsImpostor, mesh.bounder) )
    // })
}
export default Game