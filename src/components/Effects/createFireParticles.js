import {
    Vector3,
    Texture,
    ParticleSystem,
    Color4
} from 'babylonjs'

import fire from '../../img/fireParticle.jpg'
import particle from '../../img/starParticle.png'

const createFireParticles = ( type, emitter, startOnCreate, scene ) => {
    const fireParticles = new ParticleSystem( "fireParticles", 3000, scene )
        fireParticles.particleTexture = new Texture( fire, scene )
        
        fireParticles.emitter = emitter
        fireParticles.emitRate = 400

        fireParticles.direction1 = new Vector3( -.2, 1, -.2 )
        fireParticles.direction2 = new Vector3( .2, 1, .2 )
        fireParticles.minEmitPower = .25
        fireParticles.maxEmitPower = 1.8
        fireParticles.minLifeTime = .1
        fireParticles.maxLifeTime = .3
        fireParticles.minSize = .1
        fireParticles.maxSize = 1

        fireParticles.color1 = new Color4( 1, .5, 0, .7)
        fireParticles.color2 = new Color4( 1, .2, .2, 1)

    switch( type ) {
        case 'fireSquelette':
            fireParticles.minEmitBox = new Vector3(-.5, -.3, -.5)
            fireParticles.maxEmitBox = new Vector3(.5, 1.3, .5)
            break
        case 'fireball': 
            break
        case 'fireSqueletteDeath': 
            fireParticles.minEmitBox = new Vector3(-.5, -1, -.5)
            fireParticles.maxEmitBox = new Vector3(.5, 1.5, .5)
            break
        case 'meeleSqueletteDeath': 
            fireParticles.minEmitBox = new Vector3(-.5, -1, -.5)
            fireParticles.maxEmitBox = new Vector3(.5, 1.5, .5)
            fireParticles.color1 = new Color4( 1, 1, 1, .8)
            fireParticles.color2 = new Color4( .1, .1, .1, 1)
            fireParticles.particleTexture = new Texture( particle, scene )
            break
        case 'playerDeath': 
            fireParticles.minEmitBox = new Vector3(-2, -2, -2)
            fireParticles.maxEmitBox = new Vector3(2, 2.5, 2)
            fireParticles.emitRate = 3000
            break
    }

    fireParticles.gravity = new Vector3( 0, 5, 0 )

    if( startOnCreate ) fireParticles.start()

    return fireParticles
}
export default createFireParticles