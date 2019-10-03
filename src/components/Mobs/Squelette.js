import {
    Vector3,
    Quaternion,
    Ray,
} from 'babylonjs'

import createBounder from '../Effects/createBounder'
import createPhysics from '../Effects/createPhysics'
import createFireParticles from '../Effects/createFireParticles'

import applySpeed from '../utilities/applySpeed'

class Squelette {
    constructor( squelette, scene, id ) {
        squelette.Squelette = this

        this.scene = scene
        
        this.squeletteMeshes = squelette.meshes
        this.squeletteMeshes[0].scaling = new Vector3( .025, .025, .025 )
        this.squeletteMeshes.forEach( mesh => mesh.isPickable = false )

        this.skeletons = squelette.skeletons

        this.configureAnimations( squelette.animationGroups )
      
        this.bounder = createBounder( 'squelette', { id }, scene )
        this.bounder.Squelette = this

        this.physicsImpostor = createPhysics( 'squelette', this.bounder, scene )

        this.fireParticles = createFireParticles( 'squelette', this.bounder, false, scene )

        this.distance
        this.health = 10
        this.speed = .15
        this.isAttacking = false
        this.highAttackDir
        this.takeAWalk = performance.now() + Math.random()*10000
        this.walkDirection = new Vector3( Math.random()-.5, 0, Math.random()-.5 ).normalize()
    }

    configureAnimations( animations ) {
        this.animations = animations
        this.animationDelay = performance.now()
        this.activeAnimation = this.animations[1]

        animations[2].onAnimationLoopObservable.add(() => {
            this.playAnimation( 0 )
            this.isAttacking = false 
            if( this.distance < 10 ) {
                this.player.getDamage( 1 )
                const playerHitVector = this.player.bounder.position.subtract( this.bounder.position ).normalize()
                this.player.physicsImpostor.applyImpulse(
                    applySpeed( playerHitVector, this.player.speed * 500 ),
                    this.player.position
                )
            }
        })
        animations[3].onAnimationLoopObservable.add(() => {
            this.playAnimation( 0 )
            this.isAttacking = false 
            
            const highAttackHit = new Ray( this.bounder.position, this.highAttackDir, 13 ).intersectsMesh( this.player.bounder )
            if( highAttackHit.hit ) this.player.getDamage( 2 )
        })
    }

    playAnimation( index ) {
        if( this.animations[index] === this.activeAnimation ) return

        this.activeAnimation.stop()
        this.activeAnimation = this.animations[index]
        this.activeAnimation.play( true )
    }

    move() {
        //move to constructor
        if( !this.player ) this.player = this.scene.getCameraByName('player')

        const direction = this.player.position.subtract( this.bounder.position )
        this.distance = direction.length()
        
        this.squeletteMeshes[0].position = new Vector3().copyFrom( this.bounder.position )
        this.squeletteMeshes[0].position.y -= 2.3

        direction.y = 0
        const dir = direction.normalize()
        const flatDistance = direction.length()

        this.bounder.rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Up(), 0)
        this.physicsImpostor.setAngularVelocity( new Vector3.Zero())
        
        if( this.isAttacking ) return
        
        const currentTime = performance.now()
        const canAttack =  currentTime - this.animationDelay > 1800
        
        if( this.distance > 30 ) {
            if( currentTime - this.takeAWalk < 3000 ){
                this.bounder.moveWithCollisions( applySpeed( this.walkDirection, this.speed * .5 ) )
                this.squeletteMeshes[0].rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Up(), Math.atan2( this.walkDirection.x, this.walkDirection.z ))
                this.playAnimation( 4 )
            }
            else if( currentTime - this.takeAWalk < 15000){
                this.playAnimation( 0 )
            }
            else {
                this.takeAWalk = currentTime
                this.walkDirection = new Vector3( Math.random()-.5, 0, Math.random()-.5 ).normalize()
            }
        }
        else if( this.distance > 5 ) {
            this.bounder.moveWithCollisions( applySpeed( dir, this.speed ) )
            this.squeletteMeshes[0].rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Up(), Math.atan2( dir.x, dir.z ))
            this.playAnimation( 4 )
        }
        else {
            if( canAttack ){
                if( Math.random() >= .3 ) this.playAnimation( 2 )
                else {
                    this.playAnimation( 3 )
                    this.highAttackDir = dir
                }
                this.isAttacking = true
                this.animationDelay = currentTime
            }
            else if( flatDistance < 4 ) {
                this.bounder.moveWithCollisions( applySpeed( dir.negate(), this.speed ) )
                this.playAnimation( 4 )
            }
            else this.playAnimation( 0 )
        } 
    }

    getFireDamage() {
        this.fireParticles.start()
        let hitPoints = 0
        const fireDamageInterval = setInterval(() => { 
            if(hitPoints < 3) {
                this.health -= 1
                hitPoints++    
                if( this.health < 0 ) {
                    const deadParticles = createFireParticles( 
                        'killSquelette',
                        new Vector3().copyFrom( this.bounder.position ), 
                        true,
                        this.scene 
                    )
                    setTimeout(() => deadParticles.dispose(), 300)
                    this.death()
                }
            }
            else {
                clearInterval( fireDamageInterval )
                this.fireParticles.stop()
            }
        }, 200 )
    }
    
    getSwordDamage() {
        this.health -= 1
        const pushVector = this.bounder.position.subtract( this.player.position ).normalize()
        this.physicsImpostor.applyImpulse(
            applySpeed( pushVector, this.speed * 10000 ),
            this.bounder.position
        )
        if( this.health <= 0 ) this.death()
    }

    death() {
        this.bounder.dispose()
        this.physicsImpostor.dispose()
        this.squeletteMeshes.forEach( mesh => mesh.dispose())
        this.animations.forEach( animation => animation.dispose())
        this.skeletons.forEach( skeleton => skeleton.dispose())
        this.scene.squelettes = this.scene.squelettes.filter( squelette => squelette.meshes[0]._isDisposed ? false : true )
        delete this
    }
}
export default Squelette