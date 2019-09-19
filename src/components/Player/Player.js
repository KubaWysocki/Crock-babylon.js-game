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
    Sound,
} from 'babylonjs'

import { FireMaterial } from 'babylonjs-materials'

import fire from '../../img/fire.jpeg'
import createFireParticles from '../Effects/FireParticles'

import fireballSound from '../../audio/fireball.wav'

class Player extends UniversalCamera {
    constructor( canvas, name, position, scene ){
        super( name, position, scene )
        this.attachControl( canvas, false )

        this.scene = scene

        this.keysUp = [87]
        this.keysDown = [83]
        this.keysRight = [68]
        this.keysLeft = [65]

        this.applyGravity = true
        this.ellipsoid = new Vector3(2, 2, 2)
        this.checkCollisions = true
        this.angularSensibility = 5000
        
        this.speed = .3
        this.speedLock
        this.canFireFireballs = true
        this.fireballSound = new Sound('fireballSound', fireballSound, this.scene )
        this.canFireLaser = true
    }

    fireFireballs( isBPressed ) {
        if( !isBPressed || !this.canFireFireballs ) return
        this.canFireFireballs = false
        this.speed = .1
        this.speedLock = performance.now()
        
        setTimeout(() => this.canFireFireballs = true, 1000)
        setTimeout(() => performance.now() - this.speedLock >= 1500 ? this.speed = .3 : null, 1500 )
        
        const fireball = new MeshBuilder.CreateSphere( 'fireball', { segments: 16, diameter: 1 }, this.scene )
            fireball.material = new FireMaterial( 'fireballMaterial', this.scene )
            fireball.material.diffuseTexture = new Texture( fire, this.scene )

        const fireballParticles = createFireParticles( fireball, '', this.scene )

        const backPosition = this.getFrontPosition(-3)
        const missingShots = () => ((Math.random()*4) -2)
        fireball.position =  new Vector3( backPosition.x + missingShots(), this.position.y+1, backPosition.z + missingShots() )
        const forceVector = this.getFrontPosition(10).subtract( fireball.position )
            forceVector.y += 5

        fireball.physicsImpostor = new PhysicsImpostor(
            fireball,
            PhysicsImpostor.SphereImpostor,
            { mass: 1 },
            this.scene
        )
        fireball.physicsImpostor.applyImpulse(
            forceVector.multiplyByFloats( 1.2, 1.2, 1.2 ),
            fireball.getAbsolutePosition()
        )
        
        fireball.actionManager = new ActionManager( this.scene )
        this.scene.squelettes.forEach( squelette => {
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
        this.fireballSound.play()
        setTimeout(() => fireball.dispose(), 1500)
    }

    fireLaser( isFPressed ) {
        if( !isFPressed || !this.canFireLaser ) return
        this.canFireLaser = false

        setTimeout(() => this.canFireLaser = true, 500)

        const direction = this.getFrontPosition(10).subtract( this.position )
            direction.y = 0
        const origin = new Vector3( this.position.x, this.position.y - .5, this.position.z )

        const ray = new Ray( origin, direction, 100 )
        const rayHelper = new RayHelper( ray )
        rayHelper.show( this.scene, new Color3.Red )

        const pickInfo = this.scene.pickWithRay( ray )
        if( pickInfo.pickedMesh ){
            if( pickInfo.pickedMesh.name.startsWith('boundingBox') ){
                pickInfo.pickedMesh.squeletteMesh.dispose()
                pickInfo.pickedMesh.dispose()
            }
        }
        setTimeout(() => rayHelper.hide(), 200)
    }
}
export default Player