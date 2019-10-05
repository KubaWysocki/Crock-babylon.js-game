import { 
    MeshBuilder,
    StandardMaterial, 
    Texture, 
    Quaternion,
    Vector3,
    Color3
} from 'babylonjs'

import groundImg from '../../img/ground.jpg'

import createPhysics from '../Effects/createPhysics'

const createGround = ( scene ) => {
    //ground
    const texture = new Texture( groundImg, scene )
        texture.uScale = 70
        texture.vScale = 70
    const groundMaterial = new StandardMaterial( 'groundMaterial', scene )
        groundMaterial.diffuseTexture = texture
    const ground = MeshBuilder.CreateGround( 'ground', { width: 300, height: 300 }, scene)
        ground.material = groundMaterial

        ground.physicsImpostor = createPhysics( 'ground', ground, scene )

    //ramp    
    scene.ramps = []
    const rampMaterial = new StandardMaterial( 'rampMaterial', scene )
        rampMaterial.diffuseColor = new Color3.Purple()
        rampMaterial.backFaceCulling = false

    const ramp = MeshBuilder.CreateBox( 'ramp', { width: 10, height: .1, depth: 50 }, scene )
        ramp.rampDirection = new Vector3.Forward()

        ramp.material = rampMaterial

    const barier = MeshBuilder.CreateBox( 'barier', { width: 1, height: 2.3, depth: 50 }, scene )
        ramp.addChild( barier )
        barier.position.x += 4.5
        barier.position.y += 1.1
        barier.material = rampMaterial
        barier.physicsImpostor = createPhysics( 'ground', barier, scene )

    const ndBarier = barier.clone( 'barier2', ramp )
        ndBarier.position.x -= 9
        ndBarier.physicsImpostor = createPhysics( 'ground', ndBarier, scene )

        ramp.physicsImpostor = createPhysics( 'ground', ramp, scene )
        ramp.rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Left(), Math.PI / 8 )
        ramp.position.set( 20, 8.5, 40 )

    scene.ramps.push( ramp )
    scene.ramps.push( barier )
    scene.ramps.push( ndBarier )
}
export default createGround