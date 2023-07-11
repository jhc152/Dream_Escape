import { 
    MeshCollider, 
    Transform, 
    engine, 
    InputAction, 
    Material, 
    MeshRenderer, 
    PointerEventType, 
    inputSystem, 
    pointerEventsSystem ,
    AudioSource, 
    CameraModeArea,
    ColliderLayer,
    GltfContainer
    
       
    

} from '@dcl/sdk/ecs'
import { MovePlayerToRequest, movePlayerTo } from '~system/RestrictedActions'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { height, sceneSizeX, sceneSizeZ, radiusMultiplier, radiusMultiplierBase, sceneSizeXBase, sceneSizeZBase, heightBase } from './resources'
import { CreateSkybox, SetMaterialsSkybox, ShowSkybox } from './modules/skybox'
import { ExiToDream, ExitToDreamFase1, GameEnvironmentSet, SetColorPiso } from './gameEnvironment'
import { GetRandomNumber } from './utils'
import { createPowerCube } from './modules/cubos'
import { SetCountDown, SetDamage, SetFullHeart, SetGameComplete, SetHeart, SetItemsToComplete, SetLevel, SetShowPoap, SetShowUI, ShowFade, setupUi } from './ui'
import { createSound } from './modules/sound'
import { RemoveMovementSystem, createZombie } from './modules/enemie'
import { ResetPowerBase, ResetPowerBaseItemsRequired, ShowPowerBase, createPowerBase } from './modules/powerBase'
import { createCard } from './modules/cards'







/***********************VARIABLES  */

let randomX = 0
let randomZ = 0
let objetos: any[] = [];


const GROUND_HEIGHT = 0.55
const GROUND_ONAIR = 0.55
let powerBaseObj ;

let zombieEntity:any;

const HEART_INIT = 3;
let heartLevel = 3;

let itemCard:any;

const deathSound = createSound('sounds/muerte1.wav')
const damageSound = createSound('sounds/damage2.mp3')


/*time vulnerabilidad*/
let vulnerable = true 
let timeVulnerable = 0
const waitTimeVulnerable  = 30


/*time damged see*/

let timeDamageSee = 0
const waitTimeDamageSee  = 8







let level_current  =0


/************************MAIN  */


export function main() {
  
  ShowPoapMachine()

  
  /*audio background*/

  const audioBackground = createSound('sounds/ambient2.mp3')
  
 
  AudioSource.getMutable(audioBackground).loop = true;
  AudioSource.getMutable(audioBackground).volume = 1
  AudioSource.getMutable(audioBackground).playing = true


  setupUi()
	
  //creando el skybox
  GameEnvironmentSet()
  CreateSkybox()
  ShowSkybox(false)



  powerBaseObj = createPowerBase(Vector3.create(sceneSizeX/2,   0.5 + (heightBase / 2) + 0.024, sceneSizeZ/2), 'models/powerBase.glb', 2)
	
}








export function StartGame(){

  SetShowUI(true)
  CreateEntorno()
}


















function CreateEntorno(){

  

  heartLevel=3

  //setando la vida de nuevo
  SetFullHeart(heartLevel)
  SetHeart(heartLevel)

 

  //eliminando elementos anteriores
  ProtectTheGame()

  RandomEnemie()


  //creando cubos

  const  maxCubesAdd = Math.floor( level_current/2)
  
  const minCubes = 2
  const maxCubes = 6 + maxCubesAdd
  let itemsToCreate =  GetRandomNumber(minCubes, maxCubes)   
  itemsToCreate = Math.floor(itemsToCreate);
  

  SetItemsToComplete(itemsToCreate) 
  
  console.log("itemsToCreate " + itemsToCreate)
  //reseteando cuantos ocupa
  ResetPowerBaseItemsRequired (itemsToCreate)

  for (let i = 0; i < itemsToCreate; i++) {
    console.log("caja "+i)
    createItemToGrab ()    
  } 



  ShowPowerBase(true)

  CreateCountDown()


}




function RandomEnemie(){

  
    let betweenRandom = ((sceneSizeXBase-15) / 2) * radiusMultiplierBase
    let randomXEnemie = GetRandomNumber(-betweenRandom, betweenRandom)
    randomXEnemie = randomXEnemie + sceneSizeXBase/2

    let betweenRandomZ =  ((sceneSizeZBase-15) / 2)  * radiusMultiplierBase
    let randomZEnemie = GetRandomNumber(-betweenRandomZ, betweenRandomZ)
    randomZEnemie = randomZEnemie + sceneSizeZBase/2

    //creando  enemigo
    zombieEntity = createZombie(Vector3.create(randomXEnemie,  .5+  (heightBase / 2)+  0.933,   randomZEnemie))


}


function ProtectTheGame(){




  SetFullHeart(heartLevel)
  SetHeart(heartLevel)

  if(zombieEntity != null){
    RemoveMovementSystem()
    engine.removeEntity(zombieEntity)
  }

  if(itemCard!= null){
    engine.removeEntity(itemCard)
  }

  
  
  vulnerable = true
  engine.removeSystem(TimerBeforeVulnerable)

   //borrando cajas
   for (let index = 0; index < objetos.length; index++) {
    const element = objetos[index];
    engine.removeEntity(element)    
  }

  //clear array objetos de grab (cajas)
  objetos = [];

  ShowPowerBase(false)


  ResetPowerBase()

 

}













export function DamagePlayer() {
  console.log('me hizo danio el enemigo');

  if(vulnerable){
    AudioSource.getMutable(damageSound).volume = 1
    AudioSource.getMutable(damageSound).playing = true
    vulnerable =false
    heartLevel--;
    SetDamage (true)
    engine.addSystem(TimerDamageSee)

    SetHeart(heartLevel)
    if (heartLevel <= 0 ) {
     
      GameOver() 
    } 

    timeVulnerable = 0
    engine.addSystem(TimerBeforeVulnerable)
  }
}




export function TimerDamageSee() {  
  timeDamageSee ++  
  if(timeDamageSee >= waitTimeDamageSee ){
    timeDamageSee = 0
    SetDamage(false)
    engine.removeSystem(TimerDamageSee)
  }
}


// Define the system
export function TimerBeforeVulnerable() {
  
  timeVulnerable ++
 // console.log("time "+timeVulnerable)

  if(timeVulnerable >= waitTimeVulnerable ){
    vulnerable = true
    engine.removeSystem(TimerBeforeVulnerable)
  }
}















///creando caja para agarrar
function createItemToGrab (){

  const minX = 28  
  const maxX = 68

  const minZ = 28  
  const maxZ = 68  

  randomX = GetRandomNumber(minX, maxX)
  randomZ = GetRandomNumber(minZ, maxZ)

  const powerCubeEntity = createPowerCube ( Vector3.create(randomX,  (heightBase/2)+1, randomZ), 'models/powerCube.glb')
  objetos.push(powerCubeEntity);

}
















/*ya que obtuvo el item de meta*/

export async function TargetaObtenida(){


  IncrementLevel()

 
}







export function IncrementLevel(){


  //incrementa level

  level_current++
  SetLevel(level_current)

  if(level_current<=10){

      ShowFade(true)
      timeLoading = 0 
      SetMaterialsSkybox()
      SetColorPiso()
      engine.addSystem(AwaitTimeNextLevel) 


  }else{

    //sueños terminados

    SetGameComplete(true)
    ExiToDream()

  }

}




let timeLoading = 0
export function AwaitTimeNextLevel( deltaTime: number) {
  
  timeLoading ++
 // console.log("time "+timeVulnerable)

  if(timeLoading >= 20 ){
   
    engine.removeSystem(AwaitTimeNextLevel)
    ShowNextLevel()
    
  }
}



function ShowNextLevel(){
 
 

  if(zombieEntity != null){
    RemoveMovementSystem()
    engine.removeEntity(zombieEntity)
  }

  //borrando cajas
  for (let index = 0; index < objetos.length; index++) {
    const element = objetos[index];
    engine.removeEntity(element)    
  }

  //clear array objetos de grab (cajas)
  objetos = [];


  ResetPowerBase()


  const randomPosXPlayer =   sceneSizeX / 2 //GetRandomNumber(1  , 29)
  console.log("nuevaX : " + randomPosXPlayer)



  const moveRequest: MovePlayerToRequest = {
    newRelativePosition: {
      x: randomPosXPlayer,
      y: 35,
      z: sceneSizeZ / 2
    }  // Coordenadas de la ubicación a la que quieres teletransportarte
  };  

  heartLevel = HEART_INIT;

  SetFullHeart(heartLevel)
  SetHeart(heartLevel)

  movePlayerTo (moveRequest)
  CreateEntorno()

  ShowFade(false)

  

}





















/***************************GAME OVER ******** */




export async function  GameOver() {
  
  SetShowUI(false)


  SetCountDown(0)
  engine.removeSystem(UpdateCountDown)

  level_current= 0
  SetLevel(level_current)

  heartLevel=3
  RemoveMovementSystem()
  if(zombieEntity != null){   
    engine.removeEntity(zombieEntity)
  }     

 
  AudioSource.getMutable(deathSound).volume = 1
  AudioSource.getMutable(deathSound).playing = true



  ExitToDreamFase1()

  ExitTheDream()

  level_current = 0;
  SetLevel(level_current)


  //TargetaObtenida ()  
}




export function FinishLevel(){

  //remove cubes

    //borrando cajas
    for (let index = 0; index < objetos.length; index++) {
      const element = objetos[index];
      engine.removeEntity(element)    
    }
  
    //clear array objetos de grab (cajas)
    objetos = [];
  


  //remove enemies


  if(zombieEntity != null){
    RemoveMovementSystem()
    engine.removeEntity(zombieEntity)
  }


  CreateCard()
}




export function CreateCard(){  
  const cardPos = Vector3.create(sceneSizeX/2, 1 + (heightBase / 2) + 1, sceneSizeX/2 + 10)
  itemCard = createCard(cardPos, 'models/card.glb')
}





export function ExitTheDream(){
  SetCountDown(0)
  engine.removeSystem(UpdateCountDown)
  ProtectTheGame()
}



let timerToCountDown = 0

function CreateCountDown(){

  timerToCountDown = objetos.length * 10
  SetCountDown(timerToCountDown)

  engine.removeSystem(UpdateCountDown)

  engine.addSystem(UpdateCountDown)

}





function UpdateCountDown(deltaTime: number){
  
  timerToCountDown -= deltaTime
  if(timerToCountDown <= 0){
    engine.removeSystem(UpdateCountDown)
    SetCountDown(0)
    GameOver() 
  }else{
    SetCountDown(Math.floor(timerToCountDown))
  }
  


}


export function ResetDream(){

  if(zombieEntity != null){
    RemoveMovementSystem()
    engine.removeEntity(zombieEntity)
  }

  ShowFade(true)
  timeLoading = 0 
  SetMaterialsSkybox()
  SetColorPiso()
  engine.addSystem(AwaitTimeNextLevel) 

}

















function ShowPoapMachine(){


  


  const createdTime = new Date()
  const minutesWait = .1 //Delay before being able to claim a POAP in minutes
  const timeDelay = minutesWait * 60 * 1000 


  let positionButton = Vector3.create((sceneSizeX/2), 0, (sceneSizeZ/2)-15)

  

  //Create POAP DISPENSER
  

  let poapDispenser = engine.addEntity()
  MeshCollider.setBox(poapDispenser, ColliderLayer.CL_POINTER)
  let poapButton = engine.addEntity()
  MeshCollider.setBox(poapButton)

  let clickFaikMetamask :boolean = false
  

  /*  POAP DISPENSER  */
  GltfContainer.create(poapDispenser, {
    src: 'models/poap/POAP_dispenser.glb',
  })

  Transform.create(poapDispenser, {
    position: positionButton,
    scale:  Vector3.create(1, 1, 1),
  })


  /* POAP BUTTON */
  GltfContainer.create(poapButton, {
    src: 'models/poap/POAP_button.glb',
  })

  Transform.create(poapButton, {
    position: positionButton,
    scale: Vector3.create(1, 1, 1),
  })

  
  const clickableEntity = engine.addEntity()
  MeshCollider.setBox(clickableEntity)
  Transform.create(clickableEntity, {
    position: Vector3.add( Vector3.create(0 ,1,.5), positionButton),
    scale: Vector3.create(.35, .35, .25),
  })


  
  pointerEventsSystem.onPointerDown(
    {
      entity: clickableEntity,
      opts: { button: InputAction.IA_POINTER, hoverText: 'Get Attendance Token',  },
      
    },
    function () {  
      activatePoapMachine()        
    }
  )
      


  function activatePoapMachine (){
    SetShowPoap(true)
  }




}