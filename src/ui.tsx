import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { ResetDream } from '.'


let ItemsToComplete:number = 0
let ItemsObtained:number = 0
let full_hearts :number = 0
let remaining_hearts : number = 0
let level :number = 0
let damagin = false
let showFade = false
let countDown:number = 0
let showUI:boolean = false

let showPoap:boolean = false
let gameComplete : boolean = false

let showInstructions:boolean = false

const instrucciones = `Get ready to enter the dream by ensuring you have a calm and comfortable environment to focus on.\n

Enter the dream and complete the 10 different dreams without dying.
To advance in a dream, obtain the key that will take you to another dream. To obtain the key for a dream, 
collect the boxes scattered around the dream and place them inside the central switch. Once you have collected the necessary number of 
boxes to activate the switch, the enemies will disappear and the key will be revealed. Touch it and you will move on to the next dream.

Avoid getting hit by the enemy, as you only have 3 heart points or running out of time before obtaining the key.

Every time you move from one dream to another, your life will be restored. Be fast, you have 10 seconds for each required box.

If you die or wake up (fall) from the dream, you will have to start over.`


const uiComponent = () => { 


  const textToPoap = gameComplete ? ` Thanks for playing this demo\n
  Sorry, this poop machine was just illustrative, but come back soon.\n
  There will be more gameplay, more deep dreams, more enemies, more challenge, and of course your own art... this is just the beginning.
  \n\n
  greetings\n
  jhoico  
  `  
  
  :`To unlock the poap machine: \n Enter the lucid dream and achieve all 10 dream levels.`




  if(showInstructions){


    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 0 0 0',
        }}
        uiBackground={{ color: Color4.create(0, 0, 0, 1) }}
      >
         <Label                
                value = {instrucciones}
                color={Color4.White()}
                fontSize={15}
                textAlign='middle-center'

                uiTransform={{ width: '300', height: '250', margin: '0 0 0 20', } }
              />


          <Button
            uiTransform={{ width: 100, height: 40, margin: 20 }}
            value='Ok'
            variant='primary'
            fontSize={14}
            onMouseDown={() => {
              showInstructions = false
            }}
          />


        
      </UiEntity>
    );

  }




  if(showPoap){


    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 0 0 0',
        }}
        uiBackground={{ color: Color4.create(0, 0, 0, 1) }}
      >
         <Label                
                value = {textToPoap}
                color={Color4.White()}
                fontSize={29}
                uiTransform={{ width: '100%', height: 60, margin: '50 0 50 0', } }
              />


          <Button
            uiTransform={{ width: 100, height: 40, margin: 20 }}
            value='Ok'
            variant='primary'
            fontSize={14}
            onMouseDown={() => {
              showPoap = false
            }}
          />


        
      </UiEntity>
    );

  }


  if(showFade){
   
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 0 0 0',
        }}
        uiBackground={{ color: Color4.create(0, 0, 0, 1) }}
      >
         <Label                
                value={`Loading...Next Dream`}
                color={Color4.White()}
                fontSize={29}
                
                uiTransform={{ width: '100%', height: 30 } }
              />
      </UiEntity>
    );

  }else{
  
  
    if(!damagin){
    
      return (

        <UiEntity
            uiTransform={{
              width: '100%',
              height: '200',
              flexDirection: 'row',
              alignItems: 'baseline',
              //alignItems: 'flex-start',
              
              
              //justifyContent: 'flex-start',
              justifyContent: 'space-evenly',
              margin: '0 0 0 0',
              display: showUI ? 'flex': 'none',
            }}

            uiBackground={{ color: Color4.create(0, 0, 0, .1) }}
        >






                <UiEntity
                  uiTransform={{
                    width: 400,
                    height: 184,
                    //  { top: 16, right: 0, bottom: 8 left: 270 },
                    margin: '16px 0 0px 270px',
                    // { top: 4, bottom: 4, left: 4, right: 4 },
                    padding: 4,
                  }}
                  uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
                >
                  <UiEntity
                    uiTransform={{
                      width: '100%',
                      height: '100%',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    uiBackground={{ color: Color4.fromHexString("#70ac76ff") }}
                  >
                   
                    {/* <Label
                      onMouseDown={() => {console.log('Player Position clicked !')}}
                      value={`Player: ${getPlayerPosition()}`}
                      fontSize={18}
                      uiTransform={{ width: '100%', height: 30 } }
                    /> */}


                    <Label
                     
                      value={`Escape the Dream`}
                      fontSize={28}
                      uiTransform={{ width: '100%', height: 30 } }
                    />


                    <Label
                      onMouseDown={() => {console.log('Level :')}}
                      value={`Dreams Complete: ${level}`}
                      fontSize={18}
                      uiTransform={{ width: '100%', height: 30 } }
                    />
                    <Label
                      onMouseDown={() => {console.log('Heart :')}}
                      value={`Heart: ${remaining_hearts} / ${full_hearts}`}
                      fontSize={18}
                      uiTransform={{ width: '100%', height: 30 } }
                    />
                    <Label
                      onMouseDown={() => {console.log('Items On Target :')}}
                      value={`Items On Target: ${ItemsObtained} / ${ItemsToComplete}`}
                      fontSize={18}
                      uiTransform={{ width: '100%', height: 30 } }
                    />
                    <Button
                      uiTransform={{ width: 100, height: 40, margin: 8 }}
                      value='Reset Level'
                      variant='primary'
                      fontSize={14}
                      onMouseDown={() => {
                        ResetDream()
                      }}
                    />
                  </UiEntity>

                  
                  
                
                </UiEntity>




                <UiEntity
                  uiTransform={{
                    width: 400,
                    height: 184,
                    //  { top: 16, right: 0, bottom: 8 left: 270 },
                    margin: '16px 0 0px 0px',
                    // { top: 4, bottom: 4, left: 4, right: 4 },
                    padding: 4,
                    alignItems: 'center',            
              
                    justifyContent: 'center',
                  }}
                  uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.0) }}
                >
                    <Label                      
                      value={`${countDown}`}
                      fontSize={68}
                      font= 'monospace' 
                      uiTransform={{ width: '100%', height: 30 }}
                      
                    />


                </UiEntity>


          </UiEntity>



        )
    }else{

      return(
        <UiEntity
          uiTransform={{
            width: 4000,
            height: 1300,      
            margin: '0px 0 0px 0px',      
            padding: 0,
          }}
          uiBackground={{ color: Color4.create(1, 0, 0, 0.6) }}



        ></UiEntity>
            



      )


    }

 }





}








function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}





export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
 // ReactEcsRenderer.setUiRenderer(uiComponentDamage)
}


export function SetItemsToComplete(value:number){
  ItemsToComplete=value
}

export function SetItemsObtained(value:number){
  ItemsObtained = value
}



export function SetFullHeart(value:number){
  full_hearts =value
}

export function SetHeart(value:number){
  remaining_hearts =value
}

export  function SetDamage(value:boolean){
    damagin = value
}


export function ShowFade(value:boolean){
  showFade = value
}



export  function SetLevel(value:number){
  level = value
}




export function SetCountDown(value:number){
  countDown = value
}


export function SetShowUI(value:boolean){
  showUI = value
}


export function SetShowPoap(value:boolean){
  showPoap = value
}


export function SetGameComplete (value:boolean){
  gameComplete = value
}


export function SetShowInstructions (value:boolean){
  showInstructions = value
}

