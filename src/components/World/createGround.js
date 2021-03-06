import {
    MeshBuilder,
    StandardMaterial,
    Texture,
    Quaternion,
    Vector3
} from 'babylonjs'

import groundImg from '../../img/ground.jpg'

import createPhysics from '../Effects/createPhysics'

const createGround = ( scene ) => {
    //ground
    const texture = new Texture( groundImg, scene )
    texture.uScale = 100
    texture.vScale = 100
    const groundMaterial = new StandardMaterial( 'groundMaterial', scene )
    groundMaterial.diffuseTexture = texture
    const ground = MeshBuilder.CreateGround( 'ground', { width: 300, height: 300 }, scene )
    ground.material = groundMaterial
    ground.physicsImpostor = createPhysics( 'static', ground, scene )

    //ramp
    const ramp = MeshBuilder.CreateBox( 'ramp', { width: 10, height: .1, depth: 50 }, scene )

    const barier = MeshBuilder.CreateBox( 'barier', { width: 1, height: 2.3, depth: 50 }, scene )
    barier.parent = ramp
    barier.position.x += 4.5
    barier.position.y += 1.1
    barier.physicsImpostor = createPhysics( 'static', barier, scene )

    const ndBarier = barier.clone( 'barier2', ramp )
    ndBarier.position.x -= 9
    ndBarier.physicsImpostor = createPhysics( 'static', ndBarier, scene )

    ramp.physicsImpostor = createPhysics( 'static', ramp, scene )
    ramp.rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Left(), Math.PI / 8 )
    ramp.position.set( 20, 9, 40 )

    scene.ramps = [ ramp, barier, ndBarier ]
}
export default createGround