import { 
    MeshBuilder, 
    StandardMaterial, 
    Vector3, 
    Color3, 
    PointLight, 
    HemisphericLight 
} from 'babylonjs'

const createLight = ( scene ) => {
    const light1 = new PointLight( 'light1', new Vector3(0,0,0), scene )
        light1.diffuse = new Color3.White
        light1.specular = new Color3.White
        light1.intensity = 2

    const light2 = new HemisphericLight( 'light2', new Vector3(0,-1,0), scene )

    const sphere = MeshBuilder.CreateSphere( 'sphere', { segments:16, diameter:3 }, scene )
    const sphereMaterial = new StandardMaterial( 'sphereMaterial', scene )
        sphereMaterial.ambientColor = new Color3( 1, 1, 1 )
        sphereMaterial.emissiveColor = new Color3( 1, 1, 1 )

        sphere.material = sphereMaterial
        sphere.position.y = 15

    light1.parent = sphere
}
export default createLight