import { PhysicsImpostor } from 'babylonjs'

function createPhysics ( type, mesh, scene ) {
    let physicsImpostor
    const options = {}

    switch( type ) {
        case 'static': 
            options.mass = 0
            options.friction = 1
            options.restitution = 0

            physicsImpostor = new PhysicsImpostor( mesh, PhysicsImpostor.BoxImpostor, options, scene )
            if(physicsImpostor.physicsBody) //this if somehow makes it work properly 
                physicsImpostor.physicsBody.collisionFilterGroup = -1
            break
        case 'player':
            options.mass = 20
            options.friction = 1
            options.restitution = 0

            physicsImpostor = new PhysicsImpostor( mesh, PhysicsImpostor.CylinderImpostor, options, scene )
            break;
        case 'squelette': 
            options.mass = 70
            options.friction = 1
            options.restitution = 0

            physicsImpostor = new PhysicsImpostor( mesh, PhysicsImpostor.CylinderImpostor, options, scene )
            physicsImpostor.physicsBody.collisionFilterMask = 1
            break
        case 'fireball':
            options.mass = 1

            physicsImpostor = new PhysicsImpostor( mesh, PhysicsImpostor.SphereImpostor, options, scene )
            physicsImpostor.physicsBody.collisionFilterMask = 2
            break
    }
    return physicsImpostor
}
export default createPhysics