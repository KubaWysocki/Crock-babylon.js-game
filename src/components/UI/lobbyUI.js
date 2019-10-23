import {
	AdvancedDynamicTexture,
	Button,
	Rectangle
} from 'babylonjs-gui'

const lobbyUI = lobby => {
	const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI( 'start', true, lobby )

	const loadingBarFrame = new Rectangle()
	loadingBarFrame.width = '81%'
	loadingBarFrame.height = '8%'
	loadingBarFrame.color = 'black'
	loadingBarFrame.background = 'black'
	loadingBarFrame.top = '35%'

	advancedTexture.addControl( loadingBarFrame )

	const loadingBar = new Rectangle()
	loadingBar.width = '1%'
	loadingBar.height = '6%'
	loadingBar.color = 'red'
	loadingBar.background = 'red'
	loadingBar.top = '35%'
	loadingBar.left = '-39%'
	loadingBar.transformCenterX = 0
	loadingBar.scaleX = 1

	advancedTexture.addControl( loadingBar )
        
	const startButton = Button.CreateSimpleButton('startButton', 'Start Game')
	startButton.width = '18%'
	startButton.height = '8%'
	startButton.color = 'red'
	startButton.background = 'black'
	startButton.top = '35%'
	startButton.fontSize = '40px'

	return {
		advancedTexture,
		loadingBarFrame,
		loadingBar,
		startButton
	}
}
export default lobbyUI