import { SceneLoader } from 'babylonjs'

import 'babylonjs-loaders'

const modelLoader = ( scene, mode ) => {
    SceneLoader.OnPluginActivatedObservable.addOnce( plugin => 
        plugin.name === "gltf" ?  plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE : null )

    const init = typeof mode === 'function'
    
    scene.squelettes = []
    const importSqueletteAsync = () => 
        SceneLoader.ImportMeshAsync( '', './src/models/squelette_lourd/', 'scene.gltf', scene )
            .then( result => {
                if( init ) mode()
                else scene.squelettes.push( result )
            })
            .catch( err => console.log(err) )

    const importSwordAsync = () => 
        SceneLoader.ImportMeshAsync( '', './src/models/worn_sword/', 'scene.gltf', scene )
            .then( result => {
                if( init ) mode()
                else scene.sword = result
            })
            .catch( err => console.log(err) )
    const importPortalAsync = () => 
        SceneLoader.ImportMeshAsync( '', './src/models/portal_frame/', 'scene.gltf', scene )
            .then( result => {
                if( init ) mode()
                else {
                    scene.portal = result
                    result.meshes[1].isVisible = false 
                }
            })
            .catch( err => console.log(err) )

    if( init ) 
        return Promise.all([ 
            importSqueletteAsync(), 
            importSwordAsync(),
            importPortalAsync()
        ])
    else {
        const { squelettes } = mode
        return Promise.all([ 
            ...new Array( squelettes ).fill().map( importSqueletteAsync ), 
            importSwordAsync(),
            importPortalAsync()
        ])
    }
}
export default modelLoader