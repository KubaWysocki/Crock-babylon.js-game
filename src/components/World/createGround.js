import { 
    MeshBuilder,
    StandardMaterial, 
    Texture, 
    PhysicsImpostor,
    Quaternion,
    Vector3,
    Color3
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
    const ground = MeshBuilder.CreateGround( 'ground', { width: 1000, height: 1000, subdivisions: 100 }, scene)
        ground.material = groundMaterial

        ground.physicsImpostor = createPhysics( 'ground', ground, scene )

    //ramp    
    const rampMaterial = new StandardMaterial( 'rampMaterial', scene )
        rampMaterial.diffuseColor = new Color3.Purple()
        rampMaterial.backFaceCulling = false
    const ramp = MeshBuilder.CreateGround( 'ramp', { width: 10, height: 50 }, scene )
        ramp.material = rampMaterial
        ramp.rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Left(), Math.PI / 8 )
        ramp.position.set( 20, 3, 40 )
        
        ramp.physicsImpostor = createPhysics( 'ground', ramp, scene )
}
export default createGround