import { SceneLoader } from 'babylonjs'

import 'babylonjs-loaders'

const modelLoader = ( scene, mode ) => {
    SceneLoader.OnPluginActivatedObservable.addOnce( plugin => 
        plugin.name === "gltf" ?  plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE : null )

    const init = typeof mode === 'function'
    
    scene.squelettes = []
    const importSqueletteAsync = () => 
        SceneLoader.ImportMeshAsync( "", "./src/models/squelette_lourd/", "scene.gltf", scene )
            .then( result => {
                scene.squelettes.push( result )
                if( init ) mode()
            })
            .catch( err => console.log(err) )

    const importSwordAsync = () => 
        SceneLoader.ImportMeshAsync( "", "./src/models/worn_sword/", "scene.gltf", scene )
            .then( result => {
                scene.sword = result
                if( init ) mode()
            })
            .catch( err => console.log(err) )

    if( init ) 
        return Promise.all([ 
            importSqueletteAsync(), 
            importSwordAsync() 
        ])
    else {
        const { squelettes } = mode
        return Promise.all([ 
            ...new Array( squelettes ).fill().map( importSqueletteAsync ), 
            importSwordAsync() 
        ])
    }
}
export default modelLoader