import { 
    Vector3,
    UniversalCamera,
    MeshBuilder,
    PhysicsImpostor,
    ActionManager,
    ExecuteCodeAction,
    Texture,
    Ray,
    RayHelper,
    Color3,
} from 'babylonjs'

import { FireMaterial } from 'babylonjs-materials'

import fire from '../../img/fire.jpeg'
import createFireParticles from '../Effects/FireParticles'

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
    camera.angularSensibility = 5000
    
    camera.speed = .3
    camera.speedLock = performance.now()
    camera.canFireFireballs = true

    camera.fireFireballs = function( isBPressed ) {
        if( !isBPressed || !camera.canFireFireballs ) return
        camera.canFireFireballs = false
        camera.speed = .1
        camera.speedLock = performance.now()
        
        setTimeout(() => camera.canFireFireballs = true, 2000)
        setTimeout(() => performance.now() - camera.speedLock > 1000 ? camera.speed = .3 : null, 1000 )
        
        const fireball = new MeshBuilder.CreateSphere( 'fireball', { segments: 16, diameter: 1 }, scene )
            fireball.material = new FireMaterial( 'fireballMaterial', scene )
            fireball.material.diffuseTexture = new Texture( fire, scene )

        const fireballParticles = createFireParticles( fireball, '', scene )

        const backPosition = this.getFrontPosition(-3)
        const missingShots = () => ((Math.random()*4) -2)
        fireball.position =  new Vector3( backPosition.x + missingShots(), this.position.y+1, backPosition.z + missingShots() )
        const forceVector = this.getFrontPosition(10).subtract( fireball.position )
            forceVector.y += 5

        fireball.physicsImpostor = new PhysicsImpostor(
            fireball,
            PhysicsImpostor.SphereImpostor,
            { mass: 1 },
            scene
        )
        fireball.physicsImpostor.applyImpulse(
            forceVector.multiplyByFloats( 1.2, 1.2, 1.2 ),
            fireball.getAbsolutePosition()
        )
        fireball.actionManager = new ActionManager( scene )
        scene.squelettes.forEach( squelette => {
            fireball.actionManager.registerAction(
                new ExecuteCodeAction(
                    { 
                        trigger: ActionManager.OnIntersectionEnterTrigger,  
                        parameter: squelette.Squelette.bounder,
                    },
                    () => {
                        squelette.Squelette.getFireDamage()
                    }
                )
            )
        })
        setTimeout(() => fireball.dispose(), 1500)
    }

    camera.canFireLaser = true

    camera.fireLaser = function( isFPressed ) {
        if( !isFPressed || !camera.canFireLaser ) return
        camera.canFireLaser = false

        setTimeout(() => camera.canFireLaser = true, 500)

        const direction = this.getFrontPosition(10).subtract( this.position )
            direction.y = 0
        const origin = new Vector3( this.position.x, this.position.y - .5, this.position.z )

        const ray = new Ray( origin, direction, 100 )
        const rayHelper = new RayHelper( ray )
        rayHelper.show( scene, new Color3.Red )

        const pickInfo = scene.pickWithRay( ray )
        if( pickInfo.pickedMesh ){
            if( pickInfo.pickedMesh.name.startsWith('boundingBox') ){
                pickInfo.pickedMesh.squeletteMesh.dispose()
                pickInfo.pickedMesh.dispose()
            }
        }

        setTimeout(() => rayHelper.hide(), 200)
    }
    return camera
}
export default Player