import {
    Vector3,
    Texture,
    ParticleSystem,
    Color4
} from 'babylonjs'
import particleTexture from '../../img/particle.png'


const createFireParticles = ( emitter, type, scene ) => {
    const fireballParticles = new ParticleSystem( "fireballParticles", 1500, scene )
        fireballParticles.particleTexture = new Texture( particleTexture, scene )
        
    fireballParticles.emitter = emitter
    switch( type ) {
        case 'troll':
            fireballParticles.minEmitBox = new Vector3(-.5, 0, -.5)
            fireballParticles.maxEmitBox = new Vector3(.5, 1.5, .5)
            break
        case 'killTroll': 
            fireballParticles.minEmitBox = new Vector3(-.5, -1, -.5)
            fireballParticles.maxEmitBox = new Vector3(.5, 1.5, .5)
            break
        default: 
            fireballParticles.minEmitBox = new Vector3(-.5, -.5, -.5)
            fireballParticles.maxEmitBox = new Vector3(.5, .5, .5)
    }

    fireballParticles.minSize = .1
    fireballParticles.maxSize = .4
    fireballParticles.minLifeTime = .01
    fireballParticles.maxLifeTime = .3  
    fireballParticles.emitRate = 1000
    fireballParticles.color1 = new Color4( .7, .2, .2, .2)
    fireballParticles.color2 = new Color4( 1, 0, 0, 1)

    fireballParticles.gravity = new Vector3( 0, 9.81, 0)
    fireballParticles.start()

    return fireballParticles
}
export default createFireParticles