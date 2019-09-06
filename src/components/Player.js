import { 
    Vector3,
    UniversalCamera,
    MeshBuilder,
    PhysicsImpostor,
    ActionManager,
    ExecuteCodeAction,
    Texture
} from 'babylonjs'

import { FireMaterial } from 'babylonjs-materials'

import fire from '../img/fire.jpeg'

const Player = ( canvas, scene ) => {
    const camera = new UniversalCamera( 'player', new Vector3( 0, 4, 0 ), scene )
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

        setTimeout(() => camera.canFire = true, 3000)
        
        const fireball = new MeshBuilder.CreateSphere( 'fireball', { segments: 16, diameter: 1.5 }, scene )

        fireball.material = new FireMaterial( 'fireballMaterial', scene )
        fireball.material.diffuseTexture = new Texture( fire, scene )

        const backPosition = this.getFrontPosition(-3)
        fireball.position =  new Vector3( backPosition.x, this.position.y+1, backPosition.z+2 )
        const forceVector = this.getFrontPosition(10).subtract( fireball.position )
        forceVector.y += 5

        fireball.physicsImpostor = new PhysicsImpostor(
            fireball,
            PhysicsImpostor.SphereImpostor,
            { mass: 1 },
            scene
        )
        fireball.physicsImpostor.applyImpulse(
            forceVector,
            fireball.getAbsolutePosition()
        )
        fireball.actionManager = new ActionManager( scene )
        scene.trolls.forEach( troll => {
            fireball.actionManager.registerAction(
                new ExecuteCodeAction(
                    { 
                        trigger: ActionManager.OnIntersectionEnterTrigger,  
                        parameter: troll.trollBehavior.bounder
                    },
                    () => {
                        troll.trollBehavior.bounder.dispose()
                        troll.meshes[0].dispose()
                    }
                )
            )
        })
        setTimeout(() => fireball.dispose(), 1500)
    }
    return camera
}
export default Player