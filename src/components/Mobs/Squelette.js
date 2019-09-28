import {
    Vector3,
    MeshBuilder,
    Quaternion,
    PhysicsImpostor
} from 'babylonjs'

import createBounder from '../Effects/createBounder'
import createPhysics from '../Effects/createPhysics'
import createFireParticles from '../Effects/createFireParticles'

class Squelette {
    constructor( squelette, scene, id ) {
        squelette.Squelette = this
        
        this.scene = scene
        this.player = this.scene.getCameraByName('player')
        
        this.squeletteMeshes = squelette.meshes
        this.squeletteMeshes[0].scaling = new Vector3( .025, .025, .025 )

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
    }

    configureAnimations( animations ) {
        this.animations = animations
        this.animationDelay = performance.now()
        this.activeAnimation = this.animations[1]

        animations[2].onAnimationLoopObservable.add(() => {
            this.playAnimation( 0 )
            this.isAttacking = false 
            if( this.distance < 10 ) this.player.getDamage( 1 )
        })
        animations[3].onAnimationLoopObservable.add(() => {
            this.playAnimation( 0 )
            this.isAttacking = false 
            if( this.distance < 15 ) this.player.getDamage( 2 )
        })
    }

    playAnimation( index ) {
        if( this.animations[index] === this.activeAnimation ) return

        this.activeAnimation.stop()
        this.activeAnimation = this.animations[index]
        this.activeAnimation.play( true )
    }

    move() {
        let direction = this.player.position.subtract( this.bounder.position )
        this.distance = direction.length()
        
        if( this.isAttacking ) return

        direction.y = 0
        let dir = direction.normalize()

        this.bounder.rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Up(), 0)
        this.squeletteMeshes[0].rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Up(), Math.atan2( dir.x, dir.z ))
        
        let currentTime = performance.now()
        let canAttack =  currentTime - this.animationDelay > 1800
        
        if( this.distance > 30 ) {
            this.playAnimation( 0 )
        }
        else if( this.distance > 5 ) {
            this.bounder.moveWithCollisions( dir.multiplyByFloats( this.speed, this.speed, this.speed ) )
            this.playAnimation( 4 )
        }
        else if( canAttack ) {
            if( Math.random() >= .3 ) this.playAnimation( 2 )
            else this.playAnimation( 3 )

            this.isAttacking = true
            this.animationDelay = currentTime
        }

        this.squeletteMeshes[0].position = new Vector3().copyFrom( this.bounder.position )
        this.squeletteMeshes[0].position.y -= 2.3
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