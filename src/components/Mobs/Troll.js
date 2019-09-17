import {
    SceneLoader, 
    Vector3,
    MeshBuilder,
} from 'babylonjs'

import createFireParticles from '../Effects/FireParticles'


const troll = ( scene, quantity ) => {
    scene.trolls = []
    for( let i=0; i<quantity; i++ ) {
        SceneLoader.ImportMeshAsync( "", "./src/models/squelette_lourd/", "scene.gltf", scene )
            .then( result => {
                scene.trolls[i] = result
                new trollBehavior( result, scene, i )
            })
    }
    
}
class trollBehavior {
    constructor( troll, scene, id ) {
        troll.trollBehavior = this
        
        this.scene = scene
        this.trollMesh = troll.meshes[0]
        this.animations = troll.animationGroups

        this.trollMesh.name = 'troll' + id
        this.trollMesh.rotationQuaternion = null
        this.trollMesh.scaling = new Vector3( .025, .025, .025 )

        this.health = 10
        this.speed = .15
        this.animationDelay = performance.now()
        
        this.bounder = new MeshBuilder.CreateCylinder(
            'boundingBox' + id, 
            {
                height: 4.6,
                diameter: 1.8,
            },
            this.scene
        )
        this.bounder.trollMesh = this.trollMesh
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

        this.trollMesh.position.set( this.bounder.position.x, this.bounder.position.y - 2.3, this.bounder.position.z )

        this.trollMesh.rotation.y = Math.atan2( direction.x, direction.z )

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
        const fireParticles = createFireParticles( this.bounder, 'troll', this.scene )
        let dmg = 0
        const fireDamageInterval = setInterval(() => { 
            if(dmg < 3) {
                this.health -= 1
                dmg++    
                if( this.health < 0 ) {
                    const fireParticles = createFireParticles( 
                        new Vector3( this.bounder.position.x, this.bounder.position.y, this.bounder.position.z ), 
                        'killTroll',
                        this.scene 
                    )
                    setTimeout(() => {
                        fireParticles.stop()
                    }, 300);
                    this.bounder.dispose()
                    this.trollMesh.dispose()
                    this.scene.trolls = this.scene.trolls.filter( troll => troll.trollBehavior.bounder._isDisposed ? false : true )
                }
            }
            else {
                clearInterval( fireDamageInterval )
                fireParticles.stop()
            }
        }, 200 )
    }
}
export default troll