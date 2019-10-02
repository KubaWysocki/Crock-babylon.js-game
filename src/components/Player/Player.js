import { 
    UniversalCamera,
    Vector3,
    MeshBuilder,
    ActionManager,
    ExecuteCodeAction,
    Texture,
    Ray,
    RayHelper,
    Color3,
    Sound,
    Quaternion,
    Animation
} from 'babylonjs'

import { FireMaterial } from 'babylonjs-materials'
import fire from '../../img/fire.jpeg'

import fireballSound from '../../audio/fireball.wav'

import createBounder from '../Effects/createBounder'
import createPhysics from '../Effects/createPhysics'
import createFireParticles from '../Effects/createFireParticles'

class Player extends UniversalCamera {
    constructor( canvas, scene, sword, name = 'player', position = new Vector3( -10, 14, -10 )) {
        super( name, position, scene )

        this.attachControl( canvas )
        this.canvas = canvas
        this.ellipsoid = new Vector3(.1, .1, .1)
        this.angularSensibility = 5000
        
        this.scene = scene

        this.bounder = createBounder( 'player', { position }, scene )

        this.physicsImpostor = createPhysics( 'player', this.bounder, scene )

        this.createSword( sword )

        this.fireballSound = new Sound('fireballSound', fireballSound, scene )
        
        this.health = 20
        this.speed = .15
        this.isOnRamp = false
        this.isInAir = false
        this.fireFireballLock = 0
        this.previousPosition = this.position
        this.fireLaserLock = 0
        this.died = false
    }
    
    createSword( sword ) {
        const swordMesh = sword.meshes[0]
        swordMesh.parent = this.bounder
        swordMesh.scaling = new Vector3( .02, .02, .02 )
        swordMesh.position.set( 1, 2.5, 1.5 )
        swordMesh.rotationQuaternion = new Quaternion.FromEulerAngles( Math.PI/9, Math.PI/2, Math.PI )

        swordMesh.animations[0] = new Animation( '', 'rotation', 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE )
        swordMesh.animations[0].setKeys([
            { frame: 0, value: new Vector3( Math.PI / 9,      Math.PI / 2,  Math.PI ) },
            { frame: 20, value: new Vector3( 0,     Math.PI / 2,  2 * Math.PI / 1.4 ) },
            { frame: 60, value: new Vector3( Math.PI / 9,     Math.PI / 2,  Math.PI ) }
        ])

        swordMesh.animations[1] = new Animation( '', 'position', 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE )
        swordMesh.animations[1].setKeys([
            { frame: 0, value: swordMesh.position },
            { frame: 20, value: new Vector3( .5, 2, 2.5 ) },
            { frame: 60, value: swordMesh.position }
        ])

        this.sword = sword
    }

    behavior({ isBPressed, isFPressed, isLeftMouseClicked, ...moveControls }) {
        if( !this.died ) {
            this.move( moveControls )
            this.fireFireballs( isBPressed )
            this.fireLaser( isFPressed )
            this.swordAttack( isLeftMouseClicked )
        }
        else this.detachControl( this.canvas )
    }

    swordAttack( isLeftMouseClicked ) {
        if( isLeftMouseClicked ) this.scene.beginAnimation( this.sword.meshes[0], 0, 60 )
    }
    
    move({ isWPressed, isSPressed, isAPressed, isDPressed, isSpacePressed }) {

        this.bounder.rotationQuaternion = new Quaternion.FromEulerAngles( 0, this.rotation.y, 0 )

        const applySpeed = ( vector, multiplier = 1 ) => 
            vector.multiplyByFloats( this.speed * multiplier, this.speed * multiplier, this.speed * multiplier )
        
        const adjustPosition = () => {
            this.position = new Vector3().copyFrom( this.bounder.position )
            this.position.y +=2
        }

        const rampRay = new Ray( this.bounder.position, new Vector3.Down(), 5 ).intersectsMeshes( this.scene.ramps )

        if( rampRay[0] ) this.isOnRamp = true
        else this.isOnRamp = false
        
        const jumpingRay = new Ray( this.bounder.position, new Vector3.Down(), 2.05 )
        const isInAirInfo = this.scene.pickWithRay( jumpingRay )

        let jumpVector = this.position.subtract( this.previousPosition ).normalize()
        this.previousPosition = this.position
        
        if( !isInAirInfo.pickedMesh && !this.isOnRamp ) {
            this.isInAir = true
            adjustPosition()
            return
        }
        else if( this.isInAir ) {
            this.physicsImpostor.setLinearVelocity( new Vector3.Zero() )
            setTimeout(() => this.isInAir = false, 500)
        }

        const frontVector = this.getFrontPosition(1).subtract( this.position )
            frontVector.y = 0
        const backVector = frontVector.negate()
        const leftVector = backVector.rotateByQuaternionToRef( new Quaternion.RotationAxis( new Vector3.Up(), Math.PI / 2 ), new Vector3 )
        const rightVector = leftVector.negate()

        if( isWPressed ) this.bounder.moveWithCollisions( applySpeed( frontVector, 1.2 ))
        if( isSPressed ) this.bounder.moveWithCollisions( applySpeed( backVector ))
        if( isAPressed ) this.bounder.moveWithCollisions( applySpeed( leftVector ))
        if( isDPressed ) this.bounder.moveWithCollisions( applySpeed( rightVector ))

        if( isSpacePressed && !this.isInAir && !this.isOnRamp ) {
            jumpVector = applySpeed( jumpVector, 900 )
            jumpVector.y = 60
            this.physicsImpostor.applyImpulse( jumpVector , this.bounder.position )
        }
        adjustPosition()
    }

    fireFireballs( isBPressed ) {
        const canFireFireball = performance.now() - this.fireFireballLock > 1000
        if( !isBPressed || !canFireFireball ) return
        
        this.fireFireballLock = performance.now()
        this.speed = .075
        
        setTimeout(() => performance.now() - this.fireFireballLock >= 1500 ? this.speed = .15 : null, 1500 )
        
        const fireball = new MeshBuilder.CreateSphere( 'fireball', { segments: 16, diameter: 1 }, this.scene )
            fireball.material = new FireMaterial( 'fireballMaterial', this.scene )
            fireball.material.diffuseTexture = new Texture( fire, this.scene )

        createFireParticles( 'fireball', fireball, true, this.scene )

        let backPosition = this.getFrontPosition(-3)
        const missingShots = () => Math.random()*4 -2
        fireball.position = new Vector3( backPosition.x + missingShots(), this.position.y+1, backPosition.z + missingShots() )
        let forceVector = this.getFrontPosition(15).subtract( fireball.position )
            forceVector.y += 5

        fireball.physicsImpostor = createPhysics( 'fireball', fireball, this.scene )

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
        const canFireLaser = performance.now() - this.fireLaserLock > 1000
        if( !isFPressed || !canFireLaser ) return

        this.fireLaserLock = performance.now()

        const direction = this.getFrontPosition(10).subtract( this.position )
            direction.y = 0
        const origin = new Vector3().copyFrom( this.position )
            origin.y -= .5

        const ray = new Ray( origin, direction, 100 )
        const rayHelper = new RayHelper( ray )
        rayHelper.show( this.scene, new Color3.Red )

        const pickInfo = this.scene.pickWithRay( ray )
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

        if( this.health <= 0 && !this.died ) {
            this.died = true
            createFireParticles( 'playerDeath', this.bounder, true, this.scene )
            document.getElementById('died').style.opacity = 1
        }
    }
}
export default Player