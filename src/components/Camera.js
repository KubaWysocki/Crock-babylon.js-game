import { 
    Vector3,
    UniversalCamera
} from 'babylonjs'

const Camera = ( canvas, scene ) => {
    const camera = new UniversalCamera( 'camera', new Vector3( 0, 4, -10 ), scene )
    camera.attachControl( canvas, false )

    camera.keysUp = [87]
    camera.keysDown = [83]
    camera.keysRight = [68]
    camera.keysLeft = [65]

    camera.applyGravity = true
    camera.ellipsoid = new Vector3(2, 2, 2)
    camera.checkCollisions = true
    camera.speed = .3
    camera.angularSensibility = 5000

    return camera
}
export default Camera