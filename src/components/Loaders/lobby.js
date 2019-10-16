import {
    Scene, 
    FollowCamera, 
    Vector3,
    Animation
} from 'babylonjs'

import createFireball from '../Player/createFireball'
import loadingUI from '../UI/lobbyUI'
import modelLoader from './modelLoader'
import Game from '../../Game'

const lobby = ( engine, canvas ) => {
    const lobbyScene = new Scene( engine )
    new FollowCamera( "lobbyCam", new Vector3( 0, 0, 85 ), lobbyScene )

    const fireballSpinner = createFireball( lobbyScene )
        fireballSpinner.position = new Vector3( 2, 0, 100 )

        fireballSpinner.animations[0] = 
            new Animation( '', 'position', 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT )
        fireballSpinner.animations[0].setKeys([
            { frame: 0, value: fireballSpinner.getAbsolutePosition() },
            { frame: 15, value: new Vector3( 0, 0, 100 ) }
        ])

    const { advancedTexture, startButton, ...controls } = loadingUI( lobbyScene )

    startButton.onPointerUpObservable.add(() => {
        advancedTexture.removeControl( startButton )
        canvas.requestPointerLock()
        window.addEventListener( 'click', () => canvas.requestPointerLock() )
        Game( engine, canvas )
            .then(() => {
                lobbyScene.dispose()
                advancedTexture.dispose()
            })
    })

    let modelCounter = 0
    const incrementCounter = () => modelCounter += 1
    const numOfMeshesToLoad = 3

    modelLoader( lobbyScene, incrementCounter )
        .then(() => {
            lobbyScene.beginAnimation( fireballSpinner, 0, 15 )

            setTimeout(() => {
                advancedTexture.removeControl( controls.loadingBarFrame )
                advancedTexture.removeControl( controls.loadingBar )
    
                advancedTexture.addControl( startButton )
            }, 1000)
        })

    let alpha = 4.5
    lobbyScene.registerBeforeRender(() => {
        if( modelCounter !== numOfMeshesToLoad ) {
            alpha += .05
            fireballSpinner.position = new Vector3( 2 * Math.sin(alpha), 2 * Math.cos(alpha), 100 )
        }
        controls.loadingBar.scaleX = 1 + ( modelCounter / numOfMeshesToLoad ) * 79
    })

    return lobbyScene
}
export default lobby