import { 
    SceneLoader
} from 'babylonjs'

import Squelette from '../Mobs/Squelette'

const ModelLoader = ( scene ) => {
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
    return Promise.all( skeletons )
}
export default ModelLoader