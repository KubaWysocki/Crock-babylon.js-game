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

const createGround = ( scene ) => {
    const ground = MeshBuilder.CreateGround(
        'ground',
        { width: 1000, height: 1000, subdivisions: 100 },
        scene
    )
    const groundMaterial = new StandardMaterial( 'groundMaterial', scene )
    const texture = new Texture( groundImg, scene )
        texture.uScale = 100
        texture.vScale = 100
        groundMaterial.diffuseTexture = texture
        ground.material = groundMaterial

        ground.physicsImpostor = new PhysicsImpostor( 
            ground,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, friction: 1, restitution: 0 }, 
            scene
        )
        ground.physicsImpostor.physicsBody.collisionFilterGroup = -1

    const rampMaterial = new StandardMaterial( 'rampMaterial', scene )
        rampMaterial.diffuseColor = new Color3.Purple()
        rampMaterial.backFaceCulling = false
    const ramp = MeshBuilder.CreateGround( 'ramp', { width: 10, height: 50 }, scene )
        ramp.material = rampMaterial
        ramp.rotationQuaternion = new Quaternion.RotationAxis( new Vector3.Left(), Math.PI / 10 )
        ramp.position.set( 20, 7, 40 )
        ramp.physicsImpostor = new PhysicsImpostor( 
            ramp,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, friction: 1, restitution: 0 }, 
            scene
        )
        ramp.physicsImpostor.physicsBody.collisionFilterGroup = -1
}
export default createGround