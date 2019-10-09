import {
    Scene, 
    FollowCamera, 
    Vector3,
    Animation
} from 'babylonjs'

import {
    AdvancedDynamicTexture,
    Button,
    Rectangle
} from 'babylonjs-gui'

import createFireball from '../Player/createFireball'

const loadingScreen = ( engine, canvas, options ) => {
    const lobby = new Scene( engine )
    const camera = new FollowCamera( "FollowCam", new Vector3( 0,0,-15 ), lobby )

    const fireballSpinner = createFireball( lobby )    
        fireballSpinner.position = new Vector3( 2, 0, 0 )

        fireballSpinner.animations[0] = new Animation( '', 'position', 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT )
        fireballSpinner.animations[0].setKeys([
            { frame: 0, value: fireballSpinner.position },
            { frame: 15, value: new Vector3( 0, 0, 0 ) }
        ])

    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI( 'start', true, lobby )

    const loadingBar = new Rectangle()
        loadingBar.width = '81%'
        loadingBar.height = '8%'
        loadingBar.color = "black"
        loadingBar.background = "black"
        loadingBar.top = '35%'

        advancedTexture.addControl( loadingBar )

    const loadingIndicator = new Rectangle()
        loadingIndicator.width = '1%'
        loadingIndicator.height = '6%'
        loadingIndicator.color = "red"
        loadingIndicator.background = "red"
        loadingIndicator.top = '35%'
        loadingIndicator.left = '-39%'
        loadingIndicator.transformCenterX = 0
        loadingIndicator.scaleX = 1

        advancedTexture.addControl( loadingIndicator )
        
    const button = Button.CreateSimpleButton("startButton", "Start Game")
        button.width = '18%'
        button.height = '8%'
        button.color = "red"
        button.background = "black"
        button.top = '35%'
        button.fontSize = '40px'

        button.onPointerUpObservable.add(() => {
            lobby.dispose()
            advancedTexture.dispose()
            engine.changeScene()
            canvas.requestPointerLock()
            window.addEventListener( 'click', () => canvas.requestPointerLock() )
        })

    let numberOfMeshes = 0
    for( let mesh in options ) numberOfMeshes += options[ mesh ]

    const createStartButton = () => {
        if( !createStartButton.isCreated ) {
            lobby.beginAnimation( fireballSpinner, 0, 15 )
            setTimeout(() => {
                advancedTexture.removeControl( loadingBar )
                advancedTexture.removeControl( loadingIndicator )
    
                advancedTexture.addControl( button )
                createStartButton.isCreated = true
            }, 500)
        }
    }
    createStartButton.isCreated = false

    let alpha = 4.5
    lobby.registerBeforeRender(() => {
        alpha += .05
        loadingIndicator.scaleX = 1 + (engine.importProgress / numberOfMeshes) * 79
        if( engine.importProgress !== numberOfMeshes ) fireballSpinner.position = new Vector3( 2 * Math.sin(alpha), 2 * Math.cos(alpha), 0 )
        else createStartButton()
    })
    return lobby
}
export default loadingScreen