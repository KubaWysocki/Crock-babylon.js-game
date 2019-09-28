import { PhysicsImpostor, PhysicsViewer } from 'babylonjs'

function createPhysics ( type, mesh, scene ) {
    let physicsImpostor
    const options = {}

    switch( type ) {
        case 'player':
            options.mass = 10
            options.friction = 1
            options.restitution = 0

            physicsImpostor = new PhysicsImpostor( mesh, PhysicsImpostor.CylinderImpostor, options, scene )
            break;
        case 'squelette': 
            options.mass = 100
            options.friction = 1
            options.restitution = 0

            physicsImpostor = new PhysicsImpostor( mesh, PhysicsImpostor.CylinderImpostor, options, scene )
            physicsImpostor.physicsBody.collisionFilterMask = 1
            break
        case 'ground': 
            options.mass = 0
            options.friction = 1
            options.restitution = 0

            physicsImpostor = new PhysicsImpostor( mesh, PhysicsImpostor.BoxImpostor, options, scene )
            physicsImpostor.physicsBody.collisionFilterMask = -1
            break
    }
    return physicsImpostor
}
export default createPhysics