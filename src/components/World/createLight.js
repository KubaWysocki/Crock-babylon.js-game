import { 
    Vector3, 
    Color3, 
    HemisphericLight,
    Scene
} from 'babylonjs'

const createLight = ( scene ) => {
    const light = new HemisphericLight( 'light2', new Vector3(0,-1,0), scene )
        light.intensity = 1.3
        light.groundColor = new Color3( .3, .3, .3 )

    scene.fogMode = Scene.FOGMODE_EXP
    scene.fogDensity = 0.015
}
export default createLight