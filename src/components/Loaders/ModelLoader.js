import { SceneLoader } from 'babylonjs'

import 'babylonjs-loaders'

import Squelette from '../Mobs/Squelette'

const modelLoader = ( scene ) => {
    SceneLoader.OnPluginActivatedObservable.addOnce( plugin => 
        plugin.name === "gltf" ?  plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE : null )
    
    scene.squelettes = []

    const importSqueletteAsync = () => 
        SceneLoader.ImportMeshAsync( "", "./src/models/squelette_lourd/", "scene.gltf", scene )
            .then( result => {
                scene.squelettes.push( result )
                new Squelette( result, scene, scene.squelettes.length )
            })
            .catch( err => console.log(err) )
        
    const skeletons = new Array(5).fill().map( importSqueletteAsync )

    const importSwordAsync = () => 
        SceneLoader.ImportMeshAsync( "", "./src/models/worn_sword/", "scene.gltf", scene )
            .then( result => {
                scene.sword = result
                return result
            })
            .catch( err => console.log(err) )

    return Promise.all([ ...skeletons, importSwordAsync() ])
}
export default modelLoader