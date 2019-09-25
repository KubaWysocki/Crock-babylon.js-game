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
    Quaternion,
} from 'babylonjs'

import { FireMaterial } from 'babylonjs-materials'

import fire from '../../img/fire.jpeg'
import createFireParticles from '../Effects/createFireParticles'

import fireballSound from '../../audio/fireball.wav'

class Player extends UniversalCamera {
    constructor( canvas, scene, name = 'player', position = new Vector3( -10, 14, -10 )) {
        super( name, position, scene )
        this.attachControl( canvas )

        this.scene = scene

        this.ellipsoid = new Vector3(.1, .1, .1)
        this.angularSensibility = 5000

        this.bounder = MeshBuilder.CreateCylinder(
            'playerBounder',
            { height: 4, diameter: 2 },
            this.scene
        )
        this.bounder.isVisible = false
        this.bounder.position = new Vector3().copyFrom( this.position )
        this.bounder.position.y -= 2
        this.bounder.physicsImpostor = new PhysicsImpostor(
            this.bounder,
            PhysicsImpostor.CylinderImpostor,
            { mass: 1, friction: 1, restitution: 0 },
            this.scene
        )
        
        this.speed = .15
        this.speedLock
        this.canFireFireballs = true
        this.fireballSound = new Sound('fireballSound', fireballSound, this.scene )
        this.canFireLaser = true
    }

    move({ isWPressed, isSPressed, isAPressed, isDPressed }) {
        this.bounder.rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Up(), 0 )

        let frontVector = this.getFrontPosition(1).subtract( this.position )
            frontVector.y = 0
        let backVector = frontVector.negate()
        let leftVector = backVector.rotateByQuaternionToRef( new Quaternion.RotationAxis( new Vector3.Up(), Math.PI / 2 ), new Vector3 )
        let rightVector = leftVector.negate()

        const applySpeed = ( vector, multiplier = 1 ) => 
            vector.multiplyByFloats( this.speed * multiplier, this.speed * multiplier, this.speed * multiplier )

        if( isWPressed ) this.bounder.moveWithCollisions( applySpeed( frontVector, 1.2 ))
        if( isSPressed ) this.bounder.moveWithCollisions( applySpeed( backVector ))
        if( isAPressed ) this.bounder.moveWithCollisions( applySpeed( leftVector ))
        if( isDPressed ) this.bounder.moveWithCollisions( applySpeed( rightVector ))

        this.position = new Vector3().copyFrom( this.bounder.position )
        this.position.y +=2
    }

    fireFireballs( isBPressed ) {
        if( !isBPressed || !this.canFireFireballs ) return
        this.canFireFireballs = false
        this.speed = .05
        this.speedLock = performance.now()
        
        setTimeout(() => this.canFireFireballs = true, 1000)
        setTimeout(() => performance.now() - this.speedLock >= 1500 ? this.speed = .15 : null, 1500 )
        
        const fireball = new MeshBuilder.CreateSphere( 'fireball', { segments: 16, diameter: 1 }, this.scene )
            fireball.material = new FireMaterial( 'fireballMaterial', this.scene )
            fireball.material.diffuseTexture = new Texture( fire, this.scene )

        createFireParticles( fireball, null, true, this.scene )

        let backPosition = this.getFrontPosition(-3)
        const missingShots = () => Math.random()*4 -2
        fireball.position = new Vector3( backPosition.x + missingShots(), this.position.y+1, backPosition.z + missingShots() )
        let forceVector = this.getFrontPosition(15).subtract( fireball.position )
            forceVector.y += 5

        fireball.physicsImpostor = new PhysicsImpostor(
            fireball,
            PhysicsImpostor.SphereImpostor,
            { mass: 1 },
            this.scene
        )
        fireball.physicsImpostor.physicsBody.collisionFilterMask = 2
        fireball.physicsImpostor.applyImpulse(
            forceVector,
            fireball.position
        )
        
        fireball.actionManager = new ActionManager( this.scene )
        this.scene.squelettes.forEach( squelette => 
            fireball.actionManager.registerAction(
                new ExecuteCodeAction(
                    { 
                        trigger: ActionManager.OnIntersectionEnterTrigger,  
                        parameter: squelette.Squelette.bounder,
                    },
                    () => squelette.Squelette.getFireDamage()
                )
            )
        )
        this.fireballSound.play()
        setTimeout(() => fireball.dispose(), 1500)
    }

    fireLaser( isFPressed ) {
        if( !isFPressed || !this.canFireLaser ) return

        this.canFireLaser = false
        setTimeout(() => this.canFireLaser = true, 500)

        let direction = this.getFrontPosition(10).subtract( this.position )
            direction.y = 0
        let origin = new Vector3().copyFrom( this.position )
            origin.y -= .5

        const ray = new Ray( origin, direction, 100 )
        const rayHelper = new RayHelper( ray )
        rayHelper.show( this.scene, new Color3.Red )

        let pickInfo = this.scene.pickWithRay( ray )
        if( pickInfo.pickedMesh ){
            if( pickInfo.pickedMesh.name.startsWith('boundingBox') ){
                pickInfo.pickedMesh.Squelette.death()
            }
        }
        setTimeout(() => rayHelper.hide(), 200)
    }
}
export default Player