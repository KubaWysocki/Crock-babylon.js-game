import {
    Vector3,
    Texture,
    ParticleSystem,
    Color4
} from 'babylonjs'

import particleTexture from '../../img/particle.png'

const createFireParticles = ( type, emitter, startOnCreate, scene ) => {
    const fireParticles = new ParticleSystem( "fireParticles", 3000, scene )
        fireParticles.particleTexture = new Texture( particleTexture, scene )
        
    fireParticles.emitter = emitter
    fireParticles.emitRate = 1000
    fireParticles.color1 = new Color4( .7, .2, .2, .2)
    fireParticles.color2 = new Color4( 1, 0, 0, 1)

    switch( type ) {
        case 'fireSquelette':
            fireParticles.minEmitBox = new Vector3(-.5, 0, -.5)
            fireParticles.maxEmitBox = new Vector3(.5, 1.5, .5)
            break
        case 'fireball': 
            fireParticles.minEmitBox = new Vector3(-.5, -.5, -.5)
            fireParticles.maxEmitBox = new Vector3(.5, .5, .5)
            break
        case 'fireSqueletteDeath': 
            fireParticles.minEmitBox = new Vector3(-.5, -1, -.5)
            fireParticles.maxEmitBox = new Vector3(.5, 1.5, .5)
            break
        case 'meeleSqueletteDeath': 
            fireParticles.minEmitBox = new Vector3(-.5, -1, -.5)
            fireParticles.maxEmitBox = new Vector3(.5, 1.5, .5)
            fireParticles.color1 = new Color4( 1, 1, 1, .8)
            fireParticles.color2 = new Color4( .2, .2, .2, .5)
            break
        case 'playerDeath': 
            fireParticles.minEmitBox = new Vector3(-2, -2, -2)
            fireParticles.maxEmitBox = new Vector3(2, 2.5, 2)
            fireParticles.emitRate = 100000
            break
    }

    fireParticles.minSize = .1
    fireParticles.maxSize = .4
    fireParticles.minLifeTime = .01
    fireParticles.maxLifeTime = .3

    fireParticles.gravity = new Vector3( 0, 9.81, 0)

    if( startOnCreate ) fireParticles.start()

    return fireParticles
}
export default createFireParticles