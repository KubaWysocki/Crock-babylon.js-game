import {
	PointLight,
	Color3,
	ExecuteCodeAction,
	ActionManager,
} from 'babylonjs'

import createPhysics from '../Effects/createPhysics'
import createBounder from '../Effects/createBounder'
import createParticles from '../Effects/createParticles'

const createPortal = ( scene ) => {
	const bounder = createBounder( 'portal', {}, scene )

	const portal = scene.portal.meshes[ 1 ]
	portal.parent = bounder
	portal.position.set( 0, 0, -2 )
	portal.isVisible = true

	portal.physicsImpostor = createPhysics( 'static', bounder, scene )
	portal.actionManager = new ActionManager( scene )
	portal.actionManager.registerAction(
		new ExecuteCodeAction(
			{
				trigger: ActionManager.OnIntersectionEnterTrigger,
				parameter: scene.getMeshByName('playerBounder')
			},
			() => {
				console.log('portal')
			}
		)
	)

	createParticles( 'portal', bounder, true, scene )

	const light = new PointLight( 'portalLight', bounder.position, scene)
	light.diffuse = new Color3( .3, 0, .7 )
	light.specular = new Color3( .3, 0, .7 )
	light.intensity = .5
}
export default createPortal