import {
    AudioSource,
    engine,
    Entity,
    GltfContainer,
    PointerEvents,
    PointerEventType,
    Transform,
    VisibilityComponent
  } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { Particle, particleSystem } from './particles'
import { createSound } from './sound'
import * as utils from '@dcl-sdk/utils'
import { SetItemsObtained } from '../ui'
import { GetRandomNumber } from '../utils'
import { height, heightBase, sceneSizeX, sceneSizeZ } from '../resources'
import { CreateCard, FinishLevel } from '..'

  
  
let powerBaseParent = engine.addEntity()   
  

Transform.create(powerBaseParent, { position: Vector3.create(0, 0, 0) })

  ShowPowerBase(false)
  
  // Power glows
  const powerBlueGlowEntity = engine.addEntity()
  GltfContainer.create(powerBlueGlowEntity, { src: 'models/powerBlueGlow2.glb' })
  Transform.create(powerBlueGlowEntity , {parent:powerBaseParent})
  
  Transform.getMutable(powerBlueGlowEntity).scale = Vector3.Zero()
  
  const powerRedGlowEntity = engine.addEntity()
  GltfContainer.create(powerRedGlowEntity, { src: 'models/powerRedGlow3.glb' })
  Transform.create(powerRedGlowEntity, {parent:powerBaseParent})
  


  // Forcefield
  // const forcefieldEntity = engine.addEntity()
  // GltfContainer.create(forcefieldEntity, { src: 'models/forcefield.glb' })
  // Transform.create(forcefieldEntity)
  
  // Sounds
  const powerUp = createSound('sounds/powerUp.mp3')
  const powerDown = createSound('sounds/powerDown.mp3')
  
  
  
  //control items on me
  let itemsOnMe = 0;
  let itemsRequired = 2
  let triggerDetect ;
  
  let entityThis: Entity | null = null 



  export function createPowerBase(position: Vector3, gltfSrc: string, itemsToComplete: number) {


    //root
   
  
    Transform.getMutable(powerBlueGlowEntity).position =  { x: position.x-8, y: 0.5+ (heightBase / 2), z:  position.z-3.5 }
  
    //Transform.getMutable(powerRedGlowEntity).position = { x:  position.x-8, y:0, z:  position.z-3.5 }
    Transform.getMutable(powerRedGlowEntity).position = { x:  position.x, y: 0.5+ (heightBase / 2), z:  position.z }
  
   
  
  
    entityThis = engine.addEntity()
  
    itemsRequired = itemsToComplete
  
    Transform.create(entityThis, { position:position, parent: powerBaseParent})
    GltfContainer.create(entityThis, { src: gltfSrc })
    PointerEvents.create(entityThis, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            showFeedback: false
          }
        }
      ]
    })
  
  
  
    triggerDetect =  utils.triggers.addTrigger( entityThis, 2, 2,
      [
        {
          type: 'box',
          scale: Vector3.create(4, 4, 4),
          position: Vector3.create(0, 0.75, 0)
        }
      ],
      (entity) => {
        console.log('on enter', { entity })
        
        //if (args.length > 0)
        togglePower(true)
      },
  
      (entity) => {
        console.log('on exit', { entity })
        //if (args.length === 0)
        togglePower(false)
      }
    )
  }
  
  
  
  
  function togglePower(isPowerOn: boolean) {
  
    if (isPowerOn) {
  
      console.log("  OOOOOOOO NNNNNNNN")
      itemsOnMe++;
      SetInfoItemsOnMe()
  
  
      console.log(" ite requiered : " + itemsRequired)
  
      if(itemsOnMe == itemsRequired){
  
  
        // NOTE: particles have colliders so need to move them elsewhere
        for (const [entity] of engine.getEntitiesWith(Particle)) {
          VisibilityComponent.createOrReplace(entity, { visible: false })
        }
  
        // TODO: change this workaround until the DisableComponent is available
        // Hide the blue glow
        Transform.getMutable(powerBlueGlowEntity).scale = Vector3.One()
        Transform.getMutable(powerRedGlowEntity).scale = Vector3.Zero()
        // Transform.getMutable(forcefieldEntity).scale = Vector3.Zero()
  
        engine.removeSystem(particleSystem)
        AudioSource.getMutable(powerDown).playing = true

        FinishLevel()

        
  
        
      }
  
    
  
    }   
   
    
    else {
     
      console.log("  OOOOOOOO FFFFFFF")    
      if(itemsOnMe != 0) itemsOnMe--
      if(itemsOnMe <0 ) itemsOnMe = 0
      SetInfoItemsOnMe()
      
      // TODO: change this workaround until the DisableComponent is available
      Transform.getMutable(powerBlueGlowEntity).scale = Vector3.Zero()
      Transform.getMutable(powerRedGlowEntity).scale = Vector3.One()
  
      //Transform.getMutable(forcefieldEntity).scale = Vector3.One()
  
      // try {
      //   engine.addSystem(particleSystem)
      // } catch (err) {}
      AudioSource.getMutable(powerUp).playing = true
  
      for (const [entity] of engine.getEntitiesWith(Particle)) {
        VisibilityComponent.deleteFrom(entity)
      }
    }
  }
  
  
  function SetInfoItemsOnMe(){
    SetItemsObtained(itemsOnMe)
  }
  
  
  
  export function ResetPowerBase(){
    
    Transform.getMutable(powerBlueGlowEntity).scale = Vector3.Zero()
    Transform.getMutable(powerRedGlowEntity).scale = Vector3.One()
  
    //Transform.getMutable(forcefieldEntity).scale = Vector3.One()
  
    // try {
    //   engine.addSystem(particleSystem)
    // } catch (err) {}
    AudioSource.getMutable(powerUp).playing = true
  
    for (const [entity] of engine.getEntitiesWith(Particle)) {
      VisibilityComponent.deleteFrom(entity)
    }
    itemsOnMe = 0;
  
    SetItemsObtained(itemsOnMe)
  
  
    let  randomNewX = GetRandomNumber(5  , 25)

    randomNewX = sceneSizeX/2
  
    ResetPowerBasePosition(randomNewX)
  
  }
  
  
  
  export function ResetPowerBaseItemsRequired( newRequired:number) {
    itemsRequired = newRequired
  
    console.log(" new requiered : " + itemsRequired)
  }
  
  
  
  export function ResetPowerBasePosition( newX: number){

    if(entityThis != null){
      const mutableTransform = Transform.getMutable(entityThis)
      // Set the position with an object
  
  
  
      mutableTransform.position = { x: newX, y: mutableTransform.position.y , z: mutableTransform.position.z  }
  
  
      Transform.getMutable(powerBlueGlowEntity).position =  { x: newX-8, y: 0.5 + (heightBase / 2), z:  mutableTransform.position.z-3.5 }
      //Transform.getMutable(powerRedGlowEntity).position = { x:  newX-8, y:0, z:  mutableTransform.position.z-3.5 }
      Transform.getMutable(powerRedGlowEntity).position = { x:  newX, y: 0.5+ (heightBase / 2), z:  mutableTransform.position.z}
    }
  
  
  }
  




  export function ShowPowerBase(value: boolean){
      if(powerBaseParent!= null){         
        let newVector =(value)? Vector3.One():Vector3.Zero()  
        Transform.getMutable(powerBaseParent).scale = newVector          
      }
  }