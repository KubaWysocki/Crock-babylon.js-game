import {
    Vector3,
    MeshBuilder,
} from 'babylonjs'

import createFireParticles from '../Effects/FireParticles'


class Squelette {
    constructor( squelette, scene, id ) {
        squelette.Squelette = this
        
        this.scene = scene
        this.squeletteMesh = squelette.meshes[0]
        this.animations = squelette.animationGroups

        this.squeletteMesh.name = 'squelette' + id
        this.squeletteMesh.rotationQuaternion = null
        this.squeletteMesh.scaling = new Vector3( .025, .025, .025 )

        this.health = 10
        this.speed = .15
        this.animationDelay = performance.now()
        
        this.bounder = new MeshBuilder.CreateCylinder(
            'boundingBox' + id, 
            {
                height: 4.6,
                diameter: 1.8,
            },
            scene
        )
        this.bounder.squeletteMesh = this.squeletteMesh
        this.bounder.visibility = 0
        this.bounder.checkCollisions = true

        this.bounder.position.set( (Math.random()*200)-100, 2.3, (Math.random()*200)-100 )
    }
    move() {
        const player = this.scene.getCameraByName('player')
        let direction = player.position.subtract( this.bounder.position )
        direction.y = 0
        let distance = direction.length()
        let dir = direction.normalize()

        this.squeletteMesh.position.set( this.bounder.position.x, this.bounder.position.y - 2.3, this.bounder.position.z )

        //change to rotationQuaternion
        this.squeletteMesh.rotation.y = Math.atan2( direction.x, direction.z )

        const currentTime = performance.now()
        const canAttack =  currentTime - this.animationDelay > 2000

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
    }
    getFireDamage() {
        const fireParticles = createFireParticles( this.bounder, 'squelette', this.scene )
        let hitPoints = 0
        const fireDamageInterval = setInterval(() => { 
            if(hitPoints < 3) {
                this.health -= 1
                hitPoints++    
                if( this.health < 0 ) {
                    const deadParticles = createFireParticles( 
                        new Vector3( this.bounder.position.x, this.bounder.position.y, this.bounder.position.z ), 
                        'killSquelette',
                        this.scene 
                    )
                    setTimeout(() => deadParticles.stop(), 300)

                    this.bounder.dispose()
                    this.squeletteMesh.dispose()
                    this.scene.squelettes = this.scene.squelettes.filter( squelette => squelette.Squelette.bounder._isDisposed ? false : true )
                }
            }
            else {
                clearInterval( fireDamageInterval )
                fireParticles.stop()
            }
        }, 200 )
    }
}
export default Squelette