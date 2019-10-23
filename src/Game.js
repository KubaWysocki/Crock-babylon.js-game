import {
    Scene,
    CannonJSPlugin
} from 'babylonjs'

import * as cannon from 'cannon'

import createLight from './components/World/createLight'
import createGround from './components/World/createGround'

import UserControls from './components/Player/UserControls'
import modelLoader from './components/Loaders/modelLoader'

import Player from './components/Player/Player'
import Squelette from './components/Mobs/Squelette'

const Game = async( engine, canvas ) => {
    const scene = new Scene( engine )

    await modelLoader( scene, { squelettes: 6 } )

    scene.enablePhysics( null, new CannonJSPlugin( true, 100, cannon ) )

    createLight( scene )
    createGround( scene )

    const player = new Player( canvas, scene, scene.sword )
    scene.squelettes.forEach( ( squelette, i ) => new Squelette( squelette, scene, i ) )

    const controls = new UserControls()

    scene.registerBeforeRender( () => {
        scene.squelettes.forEach( squelette => squelette.Squelette.move() )

        player.behavior( controls )
    } )
    // eslint-disable-next-line require-atomic-updates
    engine.activeScene = scene
}
export default Game