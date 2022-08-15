let canvas = document.querySelector("#canvas1");
let ctx = canvas.getContext("2d");
canvas.width = 800 ;
canvas.height= 500 ; 
let score = 0 ;
let gameframe = 0 ; 
ctx.font = '50px Georgia';
let gamespeed = 5; 
let Gameover = false ;
// mouse 
let canvasposition = canvas.getBoundingClientRect();
const Mouse = {
    x : canvas.width/2,
    y : canvas.height/2, 
    click : false ,
}
canvas.addEventListener("mousedown" , (event)=>{
    Mouse.click = true ; 
    Mouse.x  = event.x - canvasposition.left ; 
    Mouse.y = event.y - canvasposition.top; 
})
canvas.addEventListener("mouseup" , (event)=>{
    Mouse.click = false ; 
})
// player ********
const playerleft = new Image();
playerleft.src = './spritesheets/__cartoon_fish_06_red_idle.png' ; 
const playerright = new Image();
playerright.src = './output-onlinepngtools.png' ; 
class Player{
    constructor(){
        this.x = canvas.width;  // 800 
        this.y = canvas.height/2 ; // 250
        this.radiuos = 50 ; 
        this.angle =0 ; 
        this.framex =0 ;
        this.framey = 0 ; 
        this.frame= 0 ;
        this.spritwidth = 498 ; 
        this.spritheight = 327 ;
    }
    update(){
        const dx = this.x - Mouse.x ; 
        const dy = this.y - Mouse.y ; 
        let theta = Math.atan2(dy , dx );
        this.angle= theta;
        if (Mouse.x != this.x){
            this.x -= dx/30 ;
        }
        if (Mouse.y != this.y){
            this.y -= dy/30 ;
        }
    }
    draw(){
      if(Mouse.click){
          ctx.lineWidth = 0.2 ;
          ctx.beginPath();
          ctx.moveTo(this.x , this.y );
          ctx.lineTo(Mouse.x , Mouse.y );   
          ctx.stroke();
      } 
      ctx.fillStyle = 'red '; 
      ctx.beginPath(); 
      ctx.arc(this.x , this.y , this.radiuos , 0 , 2 * Math.PI  )
      ctx.fill();
      ctx.closePath()
      ctx.fillRect(this.x , this.y , this.radiuos , 10 );
      ctx.save(); // end  circle 
      ctx.translate(this.x , this.y);
      ctx.rotate(this.angle);
      if(this.x > Mouse.x){
      ctx.drawImage(playerleft , this.framex * this.spritwidth ,this.framey * this.spritheight,
        this.spritwidth, this.spritheight , 0 - 60 , 0 - 45 , this.spritwidth/4 , this.spritheight/4 )
    }else {
        ctx.drawImage(playerright , this.framex * this.spritwidth ,this.framey * this.spritheight,
            this.spritwidth, this.spritheight , 0 - 60 , 0 - 45 , this.spritwidth/4 , this.spritheight/4 )
    }
    ctx.restore();
}
}
const player = new Player(); 
// bubbbles 
const bubblearray = [] ;
const bubbleImage = new Image();
bubbleImage.src = './bubble_pop_one/bubble_pop_frame_01.png' ;
class Bubble{
    constructor(){
        this.x= Math.random() * canvas.width ; 
        this.y=canvas.height + 100 ; 
        this.radiuos = 50 ;
        this.speed = Math.random() * 5 + 1;
        this.distance ;
        this.counted = false ; 
        this.sound = Math.random() <= 0.5 ? "sound1" : "sound2" ;
    }
    update(){
        this.y -= this.speed;   
        const dx = this.x - player.x;  
        const dy = this.y - player.y; 
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
      /*  ctx.fillStyle = 'blue'; 
        ctx.beginPath(); 
        ctx.arc(this.x , this.y , this.radiuos , 0 , 2 * Math.PI  )
        ctx.fill();
        ctx.closePath()
        ctx.stroke(); */
        ctx.drawImage(bubbleImage , this.x - 65  , this.y - 65, this.radiuos * 2.6 , this.radiuos * 2.6  );
    }
}
const bubblebob1 = document.createElement("audio");
bubblebob1.src = './Plop.ogg'  
const bubblebob2 = document.createElement("audio");
bubblebob2.src = './bubbles-single2.wav' 

function handlebubbl(){
    if(gameframe % 50 == 0){
     bubblearray.push(new Bubble());
    }
    for(let i = 0 ; i < bubblearray.length ; i++){
         bubblearray[i].update();
         bubblearray[i].draw();
         if (bubblearray[i].y < 0 - bubblearray[i].radiuos * 2 ){
            bubblearray.splice(i , 1);
            i--;
        } else if(bubblearray[i].distance < bubblearray[i].radiuos + player.radiuos){
        if(!bubblearray[i].counted){
             if(bubblearray[i].sound == 'sound1'){
                 bubblebob1.play();
             }else {
                 bubblebob2.play(); 
             }
            score++ ;
            bubblearray[i].counted = true; 
            bubblearray.splice(i , 1);
            i--;
        }
    }
        } 
    for(let i = 0 ; i < bubblearray.length ; i++){
          
    }
}
// repeating background ;
const background = new Image();
background.src = './background1.png'
const Bg = {
  x1 : 0 , 
  x2 : canvas.width,
  y1 : 0 , 
  width : canvas.width , 
  height : canvas.height , 
}

function handlebackground(){
    Bg.x1-= gamespeed;
    if(Bg.x1 < -Bg.width) Bg.x1 = Bg.width ; 
    Bg.x2-= gamespeed;
    if(Bg.x2 < -Bg.width) Bg.x2 = Bg.width ; 
    ctx.drawImage(background , Bg.x1, Bg.y1 , Bg.width , Bg.height);
    ctx.drawImage(background , Bg.x2, Bg.y1 , Bg.width , Bg.height);
}
// enmy ///////////
const enemyimage= new Image() ; 
enemyimage.src = './spritesheets/__yellow_cartoon_fish_01_swim.png';    

class Enemy{
    constructor(){
        this.x = canvas.width + 200 ; 
        this.y = Math.random() * (canvas.height - 150) + 90 ; 
        this.radiuos = 60 ; 
        this.speed = Math.random() * 2 + 3;
        this.frame = 0 ; 
        this.framex = 0 ; 
        this.framey = 0 ; 
        this.spritwidth = 418  ;
        this.spritheight = 397 ; 
    }
    draw(){
        ctx.fillStyle = 'red '; 
      ctx.beginPath(); 
      ctx.arc(this.x , this.y , this.radiuos , 0 , 2 * Math.PI  )
      ctx.fill();
      ctx.drawImage(enemyimage , this.framex * this.spritwidth  , this.framey * this.spritheight
         , this.spritwidth , this.spritheight , 
        this.x - 55  , this.y - 60, this.spritwidth / 4 , this.spritheight / 4 )
    }
    update(){
       this.x -= this.speed; 
       if(this.x < 0 - this.radiuos * 2 ){
        this.x = canvas.width + 200 ; 
        this.y = Math.random() * (canvas.height - 150) + 90 ; 
        this.speed = Math.random() * 2 + 3;
   }
   if (gameframe % 5 == 0 ){
       this.frame++ ; 
       if(this.frame > 12 ) this.frame = 0  ;
       if(this.frame == 3 || this.frame == 7 || this.frame == 11 ) {
           this.framex = 0 ;
       }else {
           this.framex++ ;
       }
       if(this.frame < 3 ) this.framey = 0 
       else if(this.frame < 7 )this.framey = 1 ;
       else if(this.frame < 11 ) this.framey = 2;   
       else this.framey = 0 ; 
   }
  // collestion detection between enemy plyer ;
    const dx = this.x - player.x ; 
    const dy = this.y - player.y ; 
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radiuos + player.radiuos ){
        handlegameover();
    }
    }
}
const enemy1 = new Enemy();
function handleEnemies(){
    enemy1.update();
    enemy1.draw();
}
function handlegameover(){
    ctx.fillStyle = "red" ; 
    ctx.fillText("Game over score is :" + score , 130 , 100 );
    Gameover = true ; 
}
function animate(){
    ctx.clearRect(0 , 0 , canvas.width,canvas.height);
    handlebubbl();
    handlebackground();
    handleEnemies();
    player.update();
    player.draw()
    ctx.fillStyle = "black"
    ctx.fillText("score :" + score , 10 ,50 );
    gameframe++ ; 
   if(!Gameover) requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize" , function(){
    canvasposition = canvas.getBoundingClientRect();
})