import { 
    MeshBuilder,
    StandardMaterial, 
    Texture 
} from 'babylonjs'

import map from '../img/map.png'
import groundImg from '../img/ground.jpg'

const Ground = ( scene ) => {
    const ground = MeshBuilder.CreateGround(
        'ground',
        {
            width: 1000,
            height: 1000,
            subdivisions: 100
        },
        scene
    )
    const groundMaterial = new StandardMaterial( "groundMaterial", scene )
    const texture = new Texture( groundImg, scene )
    texture.uScale = 100
    texture.vScale = 100
    groundMaterial.diffuseTexture = texture
    ground.material = groundMaterial
    ground.checkCollisions = true
    // const ground = MeshBuilder.CreateGroundFromHeightMap( 
    //     'ground', 
    //     map, 
    //     {
    //         width: 2000, 
    //         height: 2000, 
    //         subdivisions: 100, 
    //         minHeight: -60, 
    //         maxHeight: 130,
    //         onReady: ( ground ) => {
    //             const groundMaterial = new StandardMaterial( "groundMaterial", scene )
    //             const texture = new Texture( groundImg, scene )
    //             texture.uScale = 100
    //             texture.vScale = 100
    //             groundMaterial.diffuseTexture = texture
    //             ground.material = groundMaterial
    //             ground.checkCollisions = true
    //         }
    //     }, 
    //     scene 
    // )
    return ground
}
export default Ground