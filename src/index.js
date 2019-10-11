import './style.css'

import { Engine } from 'babylonjs'

import lobby from './components/Loaders/lobby'

const init = () => {
    const canvas = document.getElementById('renderCanvas')
    
    const engine = new Engine( canvas, true )
    window.addEventListener( 'resize', () => engine.resize() )

        engine.activeScene = lobby( engine, canvas )
        engine.runRenderLoop(() => engine.activeScene.render() )
}
window.addEventListener( 'DOMContentLoaded', init )