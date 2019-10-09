import {
    Engine,
    Scene,
    CannonJSPlugin
} from 'babylonjs'

import * as cannon from 'cannon'

import loadingScreen from './components/Loaders/loadingScreen'

import createLight from './components/World/createLight'
import createGround from './components/World/createGround'

import UserControls from './components/Player/UserControls'
import modelLoader from './components/Loaders/modelLoader'

import Player from './components/Player/Player'
import Squelette from './components/Mobs/Squelette'

const Game = () => {
    const canvas = document.getElementById('renderCanvas')
    
    const engine = new Engine( canvas, true )
    window.addEventListener( 'resize', () => engine.resize() )

    const options = {
        squelettes: 6,
        sword: 1
    }

    engine.activeScene =  loadingScreen( engine, canvas, options )

    engine.importProgress = 0
    const importProgress = () => engine.importProgress += 1
    
    engine.changeScene = function() { this.activeScene = scene }
    
    engine.runRenderLoop(() => engine.activeScene.render() )
    
    const scene = new Scene( engine )
    scene.enablePhysics( null, new CannonJSPlugin( true, 100, cannon ))

    createLight( scene )
    createGround( scene )
    const controls = new UserControls()

    modelLoader( scene, options, importProgress )
        .then(() => {
            const player = new Player( canvas, scene, scene.sword )
            scene.squelettes.forEach(( squelette, i ) => new Squelette( squelette, scene, i,  )  )

            scene.registerBeforeRender(() => {
                scene.squelettes.forEach( squelette => squelette.Squelette.move() )

                player.behavior( controls )
            })
        })
}
export default Game