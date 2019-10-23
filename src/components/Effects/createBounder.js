import {
    MeshBuilder,
    Vector3,
    Quaternion
} from 'babylonjs'

function createBounder( type, { id, position }, scene ){
    let bounder
    const name = `${type}Bounder${id ? id : ''}`
    const options = {}

    switch( type ){
    case 'player':
        options.height = 4.5
        options.diameter = 2

        bounder = MeshBuilder.CreateCylinder( name, options, scene )
        bounder.isVisible = false
        bounder.position = new Vector3().copyFrom( position )
        break
    case 'squelette':
        options.height = 4.6
        options.diameter = 2

        bounder = MeshBuilder.CreateCylinder( name, options, scene )
        bounder.visibility = 0
        bounder.position = new Vector3( Math.random()*200-100, 5, Math.random()*200-100 )
        break
    case 'portal':
        options.height = .8
        options.depth = 3.7
        options.width = 3.3

        bounder = MeshBuilder.CreateBox( name, options, scene )
        bounder.position = new Vector3( Math.random()*200-100, 3, Math.random()*200-100 )
        bounder.rotationQuaternion = new Quaternion.FromEulerAngles( -Math.PI/2, Math.PI * Math.random(), 0 )
        bounder.scaling = new Vector3( 1.7, 1.7, 1.7 )
        bounder.isVisible = false
        break
    }
    return bounder
}
export default createBounder