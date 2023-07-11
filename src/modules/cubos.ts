import {
    engine,
    GltfContainer,
    InputAction,
    PBPointerEvents,
    PointerEventType,
    PointerEvents,
    Schemas,
    Transform,
    pointerEventsSystem,
    AudioSource,
    AvatarAttach,
    AvatarAnchorPointType,
    inputSystem
  } from '@dcl/sdk/ecs'
  import { Quaternion, Vector3 } from '@dcl/sdk/math'
  import * as utils from '@dcl-sdk/utils'
  import { createSound } from './sound'
import { heightBase } from '../resources'
  
  export const PowerCube = engine.defineComponent('PowerCube', {
    isGrabbed: Schemas.Boolean,
    cubeId: Schemas.String 
  
  })
  
  // Sounds
  const cubePickUpSound = createSound('sounds/cubePickup.mp3')
  const cubePutDownSound = createSound('sounds/cubePutDown.mp3')
  
  // Configuration
  const Z_OFFSET = 1.2
  const GROUND_HEIGHT = 0.55
  
  let cubeIdCounter = 0;
  let cubeIdGrabbed: string;
  
  let cubeId: string;
  
  export function createPowerCube(position: Vector3, gltfSrc: string) {
    const entity = engine.addEntity()
    Transform.create(entity, { position: position })
    GltfContainer.create(entity, { src: gltfSrc })
  
    cubeId = `powerCube_${cubeIdCounter++}`; 
  
    PowerCube.create(entity, { isGrabbed: false, cubeId: cubeId }); // Asigna el identificador único al componente
  
   
  
    pointerEventsSystem.onPointerDown(
      entity,
      () => {
        const powerCube = PowerCube.getMutable(entity)
  
        if (!powerCube.isGrabbed) {
  
          cubeIdGrabbed= powerCube.cubeId     
          
          const transform = Transform.getMutable(entity)
          powerCube.isGrabbed = true
          AudioSource.getMutable(cubePickUpSound).playing = true
  
          // Calculates the crate's position relative to the camera
          transform.position = Vector3.Zero()
          transform.rotation = Quaternion.Identity()
          transform.position.y = -1
          transform.position.z += Z_OFFSET
  
          const dummyParent = engine.addEntity()
          Transform.create(dummyParent, {})
  
          transform.parent = dummyParent
  
          AvatarAttach.createOrReplace(transform.parent, {
            anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
          })
  
          const pointerEvent = PointerEvents.getMutable(entity).pointerEvents[0]
          if (pointerEvent && pointerEvent.eventInfo) {
            pointerEvent.eventInfo.showFeedback = false
          }
        }
      },
      {
        //button: InputAction.IA_PRIMARY,
        button: InputAction.IA_POINTER,
  
        hoverText: 'Click to Grab, Up to release',
        maxDistance: 6
      }
    )
  
    utils.triggers.addTrigger(entity, 2, 2, [{ type: 'box', scale: Vector3.create(1, 1, 1) }])
  
    return entity
  }
  
  engine.addSystem(() => {
    //if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)) {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_UP)) {
      
       let cubeIdLocal = cubeIdGrabbed
  
      for (const [entity] of engine.getEntitiesWith(PowerCube)) {
        const powerCube = PowerCube.get(entity)
  
        cubeIdGrabbed = ''
  
        console.log(powerCube.cubeId)
        
        if (powerCube.cubeId === cubeIdLocal) {
          const powerCube = PowerCube.getMutable(entity)
          const transform = Transform.getMutable(entity)
          powerCube.isGrabbed = false
          AudioSource.getMutable(cubePutDownSound).playing = true
  
          const cameraTransform = Transform.get(engine.PlayerEntity)
          const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), Z_OFFSET), cameraTransform.rotation)
  
          transform.position = Vector3.add(cameraTransform.position, forwardVector)
          transform.position.y =  1 + (heightBase / 2) + 0.25// GROUND_HEIGHT
  
  
          console.log("solte en : "+transform.position.x + " ::: " + transform.position.z)
  
          transform.rotation = Quaternion.fromLookAt(transform.position, cameraTransform.position)
          transform.rotation.x = 0
          transform.rotation.z = 0
  
          transform.parent = undefined
  
          const pointerEvent = PointerEvents.getMutable(entity).pointerEvents[0]
          if (pointerEvent && pointerEvent.eventInfo) {
            pointerEvent.eventInfo.showFeedback = true
          }
        }
      }
    }
  })
  