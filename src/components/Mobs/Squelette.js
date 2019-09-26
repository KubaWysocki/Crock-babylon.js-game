import {
    Vector3,
    MeshBuilder,
    Quaternion,
    PhysicsImpostor
} from 'babylonjs'

import createFireParticles from '../Effects/createFireParticles'

class Squelette {
    constructor( squelette, scene, id ) {
        squelette.Squelette = this
        
        this.scene = scene
        this.player = this.scene.getCameraByName('player')
        
        this.squeletteMeshes = squelette.meshes
        this.squeletteMeshes[0].scaling = new Vector3( .025, .025, .025 )

        this.skeletons = squelette.skeletons
      
        this.createBounderAndPhysics( id )
        this.configureAnimations( squelette.animationGroups )

        this.fireParticles = createFireParticles( this.bounder, 'squelette', false, this.scene )

        this.health = 10
        this.speed = .15
    }

    createBounderAndPhysics( id ) {
        this.bounder = new MeshBuilder.CreateCylinder(
            'boundingBox' + id, 
            { height: 4.6, diameter: 2 },
            this.scene
        )
        this.bounder.visibility = 0
        this.bounder.Squelette = this
        this.bounder.position.set( (Math.random()*200)-100, 5, (Math.random()*200)-100 )

        this.physicsImpostor = new PhysicsImpostor(
            this.bounder,
            PhysicsImpostor.CylinderImpostor,
            { mass: 1, friction: 1, restitution: 0 },
            this.scene
        )
        this.physicsImpostor.physicsBody.collisionFilterMask = 1
    }

    configureAnimations( animations ) {
        this.animations = animations
        this.animationDelay = performance.now()
        this.activeAnimation = null

        this.animations[2].onAnimationLoopObservable.add(() => {
            console.log('low attack')
            this.playAnimation( 0 )
        })
        this.animations[3].onAnimationLoopObservable.add(() => {
            console.log('high attack')
            this.playAnimation( 0 )
        })
    }

    playAnimation( index ) {
        if( this.animations[index] === this.activeAnimation ) return

        this.activeAnimation = this.animations[index]
        this.animations.forEach( a => a.stop() )
        this.animations[index].play( true )
    }

    move() {
        let direction = this.player.position.subtract( this.bounder.position )
        let distance = direction.length()
            direction.y = 0
        let dir = direction.normalize()

        this.bounder.rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Up(), 0)
        this.squeletteMeshes[0].rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Up(), Math.atan2( dir.x, dir.z ))
        
        let currentTime = performance.now()
        let canAttack =  currentTime - this.animationDelay > 1800
        
        if( distance > 30 ) {
            this.playAnimation( 0 )
        }
        else if( distance > 5 ) {
            this.bounder.moveWithCollisions( dir.multiplyByFloats( this.speed, this.speed, this.speed ) )
            this.playAnimation( 4 )
        }
        else if( canAttack ) {
            if( Math.random() >= .3 ) this.playAnimation( 2 )
            else this.playAnimation( 3 )
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
                        new Vector3().copyFrom( this.bounder.position ), 
                        'killSquelette',
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