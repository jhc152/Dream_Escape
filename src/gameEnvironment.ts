
import { AvatarAnchorPointType, AvatarAttach, ColliderLayer, Entity, GltfContainer, InputAction, Material, MaterialTransparencyMode, MeshCollider, MeshRenderer, RaycastQueryType, RaycastResult, TextShape, Transform, engine, pointerEventsSystem, raycastSystem } from "@dcl/sdk/ecs"

import { Color4, Vector3 } from "@dcl/sdk/math"
import { height, heightBase, radiusMultiplierBase, sceneSizeX, sceneSizeXBase, sceneSizeZ, sceneSizeZBase } from "./resources"
import { ShowSkybox } from "./modules/skybox"
import { movePlayerTo } from "~system/RestrictedActions"
import * as utils from '@dcl-sdk/utils'
import { GameOver, StartGame } from "."
import { GetRandomNumber } from "./utils"
import { SetShowInstructions } from "./ui"



let cubito: Entity | null
let elevatedPlatform2: Entity | null
let elevatedPlatform: Entity | null


const scaleElevatedPlatform = Vector3.create(sceneSizeXBase * radiusMultiplierBase, 1, sceneSizeZBase * radiusMultiplierBase)


let colorsPiso: any[] = [];
let colorPisoCurrent = Color4.create(22, 89, 95, .0001)


let entitySpawnRed : Entity 


export function GameEnvironmentSet(){


    

	//Elevated platform
	elevatedPlatform = engine.addEntity()
	Transform.create(elevatedPlatform, {
		//position: Vector3.create(sceneSizeX / 2, height / 2, sceneSizeZ / 2),
		position: Vector3.create(sceneSizeX / 2, heightBase / 2, sceneSizeZ / 2),
		scale: scaleElevatedPlatform
	})
	MeshCollider.setBox(elevatedPlatform)
	MeshRenderer.setBox(elevatedPlatform)




   // 


    entitySpawnRed = engine.addEntity()
  

   Transform.create(entitySpawnRed, { position: Vector3.create(sceneSizeX/2, .5 + (heightBase / 2) , sceneSizeX/2 + 10) })
   GltfContainer.create(entitySpawnRed, { src: 'models/spawnBaseRed.glb' })





    // Material.setPbrMaterial(elevatedPlatform, {
    //     albedoColor: Color4.create(51, 236, 255, 0.1),
    //     metallic: 0.8,
    //     roughness: 0,
        
    //   })



    //   Material.setPbrMaterial(elevatedPlatform, {
    //     albedoColor: Color4.create(10, 63, 68, 1),
    //     metallic: 0.8,
    //     roughness: 0,
        
    //   })




    const color1 =  Color4.create(22, 89, 95, .0001)
    const color2 =  Color4.create(76, 95, 22, .0001)
    const color3 =  Color4.create(86, 22, 95, .0001)


    colorsPiso.push(color1)
    colorsPiso.push(color2)
    colorsPiso.push(color3)


 


	//Teleport to the platform
	const clickableEntity = engine.addEntity()
	//MeshRenderer.setBox(clickableEntity)


    GltfContainer.create(clickableEntity, { src: 'models/robotTalking.glb' })



	MeshCollider.setBox(clickableEntity)
	Transform.create(clickableEntity, { 
        position: Vector3.create((sceneSizeX / 2) - 5, 1.25, sceneSizeZ / 2), 
        rotation: { x: 0, y: 50, z: 0, w: 0 } ,
        scale: Vector3.create(1.5, 1.5, 1.5)
    })

	pointerEventsSystem.onPointerDown(
		{
			entity: clickableEntity, opts: {
				button: InputAction.IA_POINTER,
				hoverText: 'Enter the dream'
			}
		}
		,
		function () {
            EnterTheDream()
		}
	)


    

    const sign = engine.addEntity(true)

    Transform.create(sign,{
        position: Vector3.create(0, 1.2 ,0),
        parent: clickableEntity,
        rotation: { x: 0, y: -50, z: 0, w: 0 } ,
    })
    TextShape.create(sign,{
        text: 'To dream',
        textColor: { r: 1, g: 1, b: 1, a: 1 },
        fontSize:8,
       
      })




    const instructionEntity = engine.addEntity()
	//MeshRenderer.setBox(instructionEntity)

    GltfContainer.create(instructionEntity, { src: 'models/robotTalking.glb' })
   
	MeshCollider.setBox(instructionEntity)
	Transform.create(instructionEntity, { 
        position: Vector3.create((sceneSizeX / 2) + 5, 1.25, sceneSizeZ / 2) ,
        rotation: { x: 0, y: 50, z: 0, w: 0 } ,
        scale: Vector3.create(1.5, 1.5, 1.5)
    })

	pointerEventsSystem.onPointerDown(
		{
			entity: instructionEntity, opts: {
				button: InputAction.IA_POINTER,
				hoverText: 'Instructions'
			}
		}
		,
		function () {
            SetShowInstructions(true)
		}
	)


    const signInstructions = engine.addEntity(true)

    Transform.create(signInstructions,{
        position: Vector3.create(0, 1.2 ,0),
        parent: instructionEntity,
        rotation: { x: 0, y: -50, z: 0, w: 0 } ,
    })
    TextShape.create(signInstructions,{
        text: 'Instructions',
        textColor: { r: 1, g: 1, b: 1, a: 1 },
        fontSize:8
       
       
      })






  /****TELEPORT TO END GAME */


    elevatedPlatform2 = engine.addEntity()
	Transform.create(elevatedPlatform2, {
		
		position: Vector3.create(sceneSizeX / 2, (heightBase / 2) - 2, sceneSizeZ / 2),
		scale: Vector3.create(sceneSizeX, 1, sceneSizeZ)
	})

    MeshCollider.setBox(elevatedPlatform2, ColliderLayer.CL_CUSTOM1)
   // MeshRenderer.setBox(elevatedPlatform2)

 
    
    

    // cubito = engine.addEntity()
	// Transform.create(cubito, {
	// 	scale: Vector3.create(.5, .5, .5),
    //     position: Vector3.create(0, 3, 0),
	// })

    // MeshRenderer.setBox(cubito)   
   

    // // Attach to loacl player
    // AvatarAttach.create(cubito,{
    //     anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG,
    // })



    const tree = engine.addEntity()

    GltfContainer.create(tree, { src: 'models/Tree.gltf' })
    Transform.create(tree, {
		//position: Vector3.create(sceneSizeX / 2, height / 2, sceneSizeZ / 2),
		position: Vector3.create((sceneSizeX / 2)-5, 0, (sceneSizeZ / 2)+10),
		scale: Vector3.create(1.6, 1.6, 1.6)
	})    



    const ground = engine.addEntity()

    GltfContainer.create(ground, { src: 'models/FloorBaseGrass.glb' })
    Transform.create(ground, {
		//position: Vector3.create(sceneSizeX / 2, height / 2, sceneSizeZ / 2),
		position: Vector3.create((sceneSizeX / 2), 0, (sceneSizeZ / 2)),
		scale: Vector3.create(9.6, 1.6,9.6)
	})    
    
    


  

    ShowEnvironment(false)
 

}




export function SetColorPiso(){


    let colorRandom =  GetRandomNumber(0, colorsPiso.length-1)   
    colorRandom = Math.floor(colorRandom);

    colorPisoCurrent = colorsPiso[colorRandom]

    if(elevatedPlatform == null) return;

    Material.setPbrMaterial(elevatedPlatform, {
        texture: Material.Texture.Common({
            src: 'images/piso6.png'
        }),

        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND,
        alphaTest: 1,
        metallic: 0.8,
        roughness: 0.2,
        emissiveIntensity : 0.05,
        emissiveColor: colorPisoCurrent,
    
    })


}




function EnterTheDream(){

    SetColorPiso();

    ShowSkybox(true)
    ShowEnvironment(true)
    movePlayerTo({ 
        newRelativePosition: Vector3.create(sceneSizeX / 2, 35, sceneSizeZ / 2),
        cameraTarget: Vector3.create(8, 1.5, 12), 
    })
    StartGame()
    AddDetectExitGame()

}



export function AddDetectExitGame(){
    engine.addSystem(detectExitGame)
}


export function RemoveDetectExitGame(){    
    engine.removeSystem(detectExitGame)
}

  






function detectExitGame(deltaTime: number){

    
        if (!Transform.has(engine.PlayerEntity)) return
        if(elevatedPlatform2 == null) return
        const playerPos = Transform.get(engine.PlayerEntity).position
      
       
          const transformCubito = Transform.getMutable(elevatedPlatform2)  
          
        
          // Move towards player until it's at attack distance
         // const distance = Vector3.distanceSquared(transformCubito.position, playerPos) // Check distance squared as it's more optimized


          //console.log("pos y" + playerPos .y )
      
          const salioEncuentro =  (playerPos .y > 10 && playerPos .y < 15)
          if (salioEncuentro) {
            ExiToDream()
          
          }
      
      
}



export function ShowEnvironment(value: boolean) {
    if(elevatedPlatform!= null){
        let newVector =(value)? scaleElevatedPlatform:Vector3.Zero()  

        Transform.getMutable(entitySpawnRed).scale = (value)?Vector3.One() :Vector3.Zero()  
        
        Transform.getMutable(elevatedPlatform).scale = newVector
    }
}




export function ExiToDream(){
    ExitToDreamFase1()
    GameOver()
}



export function ExitToDreamFase1(){
    RemoveDetectExitGame()
    ShowSkybox(false)
    ShowEnvironment(false)
    movePlayerTo({ newRelativePosition: Vector3.create(sceneSizeX / 2, .8, (sceneSizeZ / 2)+5) })
}
    


