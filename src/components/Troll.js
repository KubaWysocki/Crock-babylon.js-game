import {
    SceneLoader, 
    Vector3,
    MeshBuilder,
} from 'babylonjs'


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

        this.speed = .15
        this.animationDelay = performance.now()
        
        this.bounder = new MeshBuilder.CreateCylinder(
            'boundingBox' + id, 
            {
                height: 4.6,
                diameter: 2,
            },
            scene
        )
        this.bounder.isVisible = false
        this.bounder.checkCollisions = true

        this.bounder.position.set( (Math.random()*200)-100, 2.3, (Math.random()*200)-100 )
    }
    move() {
        const player = this.scene.getCameraByName('camera')

        let direction = player.position.subtract( this.bounder.position )
        direction.y = 0
        let distance = direction.length()
        let dir = direction.normalize()

        this.trollMesh.position.set( this.bounder.position.x, this.bounder.position.y - 2.3, this.bounder.position.z )

        this.trollMesh.rotation.y = Math.atan2( direction.x, direction.z )

        const currentTime = performance.now()
        const canAttack =  currentTime - this.animationDelay > 1200

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
}
export default troll