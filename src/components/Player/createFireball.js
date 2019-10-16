import { 
    MeshBuilder,
    Texture
} from 'babylonjs'

import { FireMaterial } from 'babylonjs-materials'
import fire from '../../img/fire.jpeg'

import createParticles from '../Effects/createParticles'

const createFireball = ( scene ) => {
    const fireball = new MeshBuilder.CreateSphere( 'fireball', { segments: 16, diameter: 1 }, scene )
        fireball.material = new FireMaterial( 'fireballMaterial', scene )
        fireball.material.diffuseTexture = new Texture( fire, scene )

    createParticles( 'fireball', fireball, true, scene )

    return fireball
}

export default createFireball