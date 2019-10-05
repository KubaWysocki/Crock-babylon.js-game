import {  
    MeshBuilder,
    Vector3
} from 'babylonjs'

function createBounder ( type, { id, position }, scene ) {
    let bounder
    const name = type + 'Bounder' + (id ? id : '')
    const options = {}

    switch( type ) {
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
    }
    return bounder
}
export default createBounder