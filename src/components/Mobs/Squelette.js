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

        this.animations = squelette.animationGroups
        this.animationDelay = performance.now()
        
        this.health = 10
        this.speed = .1
        
        this.bounder = new MeshBuilder.CreateCylinder(
            'boundingBox' + id, 
            { height: 4.6, diameter: 2 },
            this.scene
        )
        this.bounder.visibility = 0
        this.bounder.Squelette = this
        this.bounder.position.set( (Math.random()*200)-100, 5, (Math.random()*200)-100 )

        this.fireParticles = createFireParticles( this.bounder, 'squelette', false, this.scene )

        this.physicsImpostor = new PhysicsImpostor(
            this.bounder,
            PhysicsImpostor.CylinderImpostor,
            { mass: 1, friction: 1, restitution: 0 },
            this.scene
        )
        this.physicsImpostor.physicsBody.collisionFilterMask = 1

        this.animations[2].onAnimationGroupEndObservable.add(
            (e) => console.log(e)
        )
    }

    move() {
        let direction = this.player.position.subtract( this.bounder.position )
            direction.y = 0
        let distance = direction.length()
        let dir = direction.normalize()

        this.bounder.rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Down(), 0)
        this.squeletteMeshes[0].rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Up(), Math.atan2( dir.x, dir.z ))
        
        let currentTime = performance.now()
        let canAttack =  currentTime - this.animationDelay > 1500
        
        if( distance > 30 ) {
            this.animations[0].play()
        }
        else if( distance > 5 ) {
            this.bounder.moveWithCollisions( dir.multiplyByFloats( this.speed, this.speed, this.speed ) )
            this.animations[4].play()
        }
        else if( canAttack ) {
            if( Math.random() >= .3 ) this.animations[2].play()
            else this.animations[3].play()
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
        this.squeletteMeshes.forEach( mesh => mesh.dispose())
        this.animations.forEach( animation => animation.dispose())
        this.skeletons.forEach( skeleton => skeleton.dispose())
        this.scene.squelettes = this.scene.squelettes.filter( squelette => squelette.meshes[0]._isDisposed ? false : true )
        delete this
    }
}
export default Squelette