export function getRandomHexColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  
  
  
  export function  GetRandomNumber   (minNumber:number, maxNumber:number){
    const min = minNumber;
    const max = maxNumber;
    const randomNumber = Math.random() * (max - min) + min;
    return randomNumber;
  }



    
  export function  GetRandomNumberInt   (minNumber:number, maxNumber:number){
    const min = minNumber;
    const max = maxNumber;
    let randomNumber = Math.random() * (max - min) + min;

    randomNumber = Math.floor(randomNumber);
    return randomNumber;
  }
  
  