import { Entity, Material, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { height, radiusMultiplier, sceneSizeX, sceneSizeZ } from "../resources"
import { GetRandomNumberInt } from "../utils";






let skyboxRoot: Entity | null ;


let skyboxPZ: Entity  ;
let skyboxNZ: Entity  ;
let skyboxPY: Entity  ;
let skyboxNY: Entity  ;
let skyboxPX: Entity  ;
let skyboxNX: Entity  ;

export function CreateSkybox (){

    //#region SkyBox
	

	//root
	skyboxRoot = engine.addEntity()    

	Transform.create(skyboxRoot, { position: Vector3.create(sceneSizeX / 2, height / 2, sceneSizeZ / 2) })

	//front
	skyboxPZ = engine.addEntity()
	Transform.create(skyboxPZ, {
		position: Vector3.create(0, 0, sceneSizeZ / 2 * radiusMultiplier),
		scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
		parent: skyboxRoot
	})
	MeshRenderer.setPlane(skyboxPZ)
	

	//back
	skyboxNZ = engine.addEntity()
	Transform.create(skyboxNZ, {
		position: Vector3.create(0, 0, -sceneSizeZ / 2 * radiusMultiplier),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
		parent: skyboxRoot
	})
	MeshRenderer.setPlane(skyboxNZ)
	

	//Top
	skyboxPY = engine.addEntity()
	Transform.create(skyboxPY, {
		position: Vector3.create(0, height / 2 * radiusMultiplier, 0),
		rotation: Quaternion.fromEulerDegrees(-90, 0, 0),
		scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
		parent: skyboxRoot
	})
	MeshRenderer.setPlane(skyboxPY)


	//Bottom
	skyboxNY = engine.addEntity()
	Transform.create(skyboxNY, {
		position: Vector3.create(0, -height / 2 * radiusMultiplier, 0),
		rotation: Quaternion.fromEulerDegrees(90, 0, 0),
		scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
		parent: skyboxRoot
	})
	MeshRenderer.setPlane(skyboxNY)
	

	//Right
	skyboxPX = engine.addEntity()
	Transform.create(skyboxPX, {
		position: Vector3.create(sceneSizeX / 2 * radiusMultiplier, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 90, 0),
		scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
		parent: skyboxRoot
	})
	MeshRenderer.setPlane(skyboxPX)
	

	// Left
	skyboxNX = engine.addEntity()
	Transform.create(skyboxNX, {
		position: Vector3.create(-sceneSizeX / 2 * radiusMultiplier, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, -90, 0),
		scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
		parent: skyboxRoot
	})
	MeshRenderer.setPlane(skyboxNX)


    SetMaterialsSkybox()
	
	//#endregion

}



export function SetMaterialsSkybox(){


    const folderNumber = GetRandomNumberInt(1,5)     

    //front
    Material.setBasicMaterial(skyboxPZ, {
		texture: Material.Texture.Common({
			src: "images/skybox/" + folderNumber + "/pz.jpg"
		})
	})

    //back
    Material.setBasicMaterial(skyboxNZ, {
		texture: Material.Texture.Common({
			src: "images/skybox/" + folderNumber + "/nz.jpg"
		})
	})


    //top
    Material.setBasicMaterial(skyboxPY, {
		texture: Material.Texture.Common({
			src: "images/skybox/" + folderNumber + "/py.jpg"
		})
	})

    //bottom
    Material.setBasicMaterial(skyboxNY, {
		texture: Material.Texture.Common({
			src: "images/skybox/" + folderNumber + "/ny.jpg"
		})
	})


    //right
    Material.setBasicMaterial(skyboxPX, {
		texture: Material.Texture.Common({
			src: "images/skybox/" + folderNumber + "/px.jpg"
		})
	})


    //left
    Material.setBasicMaterial(skyboxNX, {
		texture: Material.Texture.Common({
			src: "images/skybox/" + folderNumber + "/nx.jpg"
		})
	})


}



export function ShowSkybox(value: boolean) {
    if(skyboxRoot!= null){
        if(value)SetMaterialsSkybox()
        let newVector =(value)? Vector3.One():Vector3.Zero()  
        Transform.getMutable(skyboxRoot).scale = newVector

        
    }
}