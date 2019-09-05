import { 
    Vector3,
    UniversalCamera,
    MeshBuilder,
    StandardMaterial,
    VideoTexture,
    PhysicsImpostor
} from 'babylonjs'

import { FireMaterial } from 'babylonjs-materials'

import fire from '../img/fire.png'
import distortion from '../img/distortion.png'
import opacity from '../img/opacity.png'

const Player = ( canvas, scene ) => {
    const camera = new UniversalCamera( 'camera', new Vector3( 0, 4, 0 ), scene )
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

    camera.canFire = true

    camera.fire = function ( isBPressed ) {
        if( !isBPressed || !camera.canFire ) return
        camera.canFire = false

        setTimeout(() => camera.canFire = true, 300)
        
        const fireball = new MeshBuilder.CreateSphere( "fireball", { segments: 16, diameter: 2 }, scene )

        fireball.material = new FireMaterial( 'fireballMaterial', scene )
        fireball.material.diffuseTexture = new BABYLON.Texture( fire, scene )
        fireball.material.distortionTexture = new BABYLON.Texture( distortion, scene )
        fireball.material.opacityTexture = new BABYLON.Texture( opacity, scene )

        const backPosition = this.getFrontPosition(-3)
        fireball.position =  new Vector3( backPosition.x, this.position.y +2, backPosition.z+2 )
        const forceVector = this.getFrontPosition(10).subtract( fireball.position )
        forceVector.y += 5

        fireball.physicsImpostor = new PhysicsImpostor(
            fireball,
            PhysicsImpostor.SphereImpostor,
            { mass: 1 },
            scene
        )
        fireball.physicsImpostor.applyImpulse(
            forceVector.multiplyByFloats(2,1,2),
            fireball.getAbsolutePosition()
        )

        setTimeout(() => fireball.dispose(), 1500)
    }
    
    return camera
}
export default Player