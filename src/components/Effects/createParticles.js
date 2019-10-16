import {
    Vector3,
    Texture,
    ParticleSystem,
    Color4
} from 'babylonjs'

import fire from '../../img/fireParticle.jpg'
import star from '../../img/starParticle.png'

const createParticles = ( type, emitter, startOnCreate, scene ) => {
    const fireTexture = new Texture( fire, scene )
    const starTexture = new Texture( star, scene )

    const particles = new ParticleSystem( 'particles', 3000, scene )
        
        particles.emitter = emitter

        particles.gravity = new Vector3( 0, 5, 0 )
        particles.direction1 = new Vector3( -.2, 1, -.2 )
        particles.direction2 = new Vector3( .2, 1, .2 )
        particles.minEmitPower = .25
        particles.maxEmitPower = 2
        particles.minLifeTime = .1
        particles.maxLifeTime = .3
        particles.minSize = .1
        particles.maxSize = 1

    const fireParticles = () => {
        particles.emitRate = 400
        particles.color1 = new Color4( 1, .5, 0, .7 )
        particles.color2 = new Color4( 1, .2, .2, 1 )
        particles.particleTexture = fireTexture
    }

    switch( type ) {
        case 'fireball':
            fireParticles()
            break
        case 'fireSquelette':
            fireParticles()
            particles.minEmitBox = new Vector3( -.5, -.3, -.5 )
            particles.maxEmitBox = new Vector3( .5, 1.3, .5 )
            break
        case 'fireSqueletteDeath': 
            fireParticles()
            particles.minEmitBox = new Vector3( -.5, -1, -.5 ) 
            particles.maxEmitBox = new Vector3( .5, 1.5, .5 )
            break
        case 'meeleSqueletteDeath': 
            particles.emitRate = 500
            particles.minEmitBox = new Vector3( -.5, -1, -.5 )
            particles.maxEmitBox = new Vector3( .5, 1.5, .5 )
            particles.color1 = new Color4( 1, 1, 1, .8)
            particles.color2 = new Color4( .1, .1, .1, 1)
            particles.particleTexture = starTexture
            break
        case 'playerDeath': 
            fireParticles()
            particles.emitRate = 3000
            particles.minEmitBox = new Vector3( -2, -2, -2 )
            particles.maxEmitBox = new Vector3( 2, 2.5, 2 )
            break
        case 'portal': 
            particles.emitRate = 10000
            particles.minEmitBox = new Vector3( -.9, -.05, -2 )
            particles.maxEmitBox = new Vector3( .9, -.05, 1.35 )
            particles.color1 = new Color4( 0, 0, 1, 1 )
            particles.color2 = new Color4( .3, 0, .7, .7 )
            particles.particleTexture = starTexture
            break
    }

    if( startOnCreate ) particles.start()

    return particles
}
export default createParticles