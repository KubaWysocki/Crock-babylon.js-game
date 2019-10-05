import { SceneLoader } from 'babylonjs'

import 'babylonjs-loaders'

const modelLoader = ( { squelettes: num }, scene ) => {
    SceneLoader.OnPluginActivatedObservable.addOnce( plugin => 
        plugin.name === "gltf" ?  plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE : null )
    
    scene.squelettes = []

    const importSqueletteAsync = () => 
        SceneLoader.ImportMeshAsync( "", "./src/models/squelette_lourd/", "scene.gltf", scene )
            .then( result => scene.squelettes.push( result ) )
            .catch( err => console.log(err) )

    const importSwordAsync = () => 
        SceneLoader.ImportMeshAsync( "", "./src/models/worn_sword/", "scene.gltf", scene )
            .then( result => scene.sword = result )
            .catch( err => console.log(err) )

    return Promise.all([ 
        ...new Array( num ).fill().map( importSqueletteAsync ), 
        importSwordAsync() 
    ])
}
export default modelLoader