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

import fireballSound from '../../audio/fireball.wav'

import createBounder from '../Effects/createBounder'
import createPhysics from '../Effects/createPhysics'
import createFireParticles from '../Effects/createFireParticles'

class Player extends UniversalCamera {
    constructor( canvas, scene, name = 'player', position = new Vector3( -10, 14, -10 )) {
        super( name, position, scene )
        
        this.attachControl( canvas )
        this.ellipsoid = new Vector3(.1, .1, .1)
        this.angularSensibility = 5000
        
        this.scene = scene

        this.bounder = createBounder( 'player', { position }, scene )

        this.physicsImpostor = createPhysics( 'player', this.bounder, scene )

        this.fireballSound = new Sound('fireballSound', fireballSound, scene )
        this.bloodFrame = document.getElementById('bloodFrame')
        
        this.health = 20
        this.speed = .15
        this.speedLock
        this.canJump = true
        this.canFireFireballs = true
        this.canFireLaser = true
        this.died = false
    }

    behavior({ isBPressed, isFPressed, ...moveControls }) {
        if( !this.died ) {
            this.move( moveControls )
            this.fireFireballs( isBPressed )
            this.fireLaser( isFPressed )
        }
        else {
            this.detachControl()
        }
    }
    
    move({ isWPressed, isSPressed, isAPressed, isDPressed, isSpacePressed }) {
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

        if( isSpacePressed && this.canJump ) {
            const ray = new Ray( this.bounder.position, new Vector3.Down(), 2.1 )
            let pickInfo = this.scene.pickWithRay( ray )
            if( pickInfo.pickedMesh ){
                this.physicsImpostor.applyImpulse( new Vector3(0,80,0), this.bounder.position )
                this.canJump = false
                setTimeout(() => this.canJump = true, 600)
            }
        }

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

        createFireParticles( null, fireball, true, this.scene )

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
            if( pickInfo.pickedMesh.name.startsWith('squeletteBounder') ){
                pickInfo.pickedMesh.Squelette.death()
            }
        }
        setTimeout(() => rayHelper.hide(), 200)
    }

    getDamage( dmg ) {
        this.health -= dmg
        console.log(this.health)
        let opacityNumber = Number( this.bloodFrame.style.opacity )
        this.bloodFrame.style.opacity = opacityNumber + dmg / this.health
        setTimeout(() => this.bloodFrame.style.opacity = (opacityNumber - dmg / this.health), 700)

        if( this.health <= 0 && !this.died ) {
            this.died = true
            bloodFrame.style.opacity = 1
            createFireParticles( 'playerDeath', this.bounder, true, this.scene )
            document.getElementById('died').style.opacity = 1
        }
    }
}
export default Player