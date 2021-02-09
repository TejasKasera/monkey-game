var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey,monkey_running,monkey_collided;
var ground,invisibleGround,groundImage;

var banana ,bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var gameOver,gameOverImage;
var restart,restartImage;
var score;


function preload(){
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  
  gameOverImage = loadImage("go.png");
   
  bananaImage = loadImage("banana.png");
  
  obstacleImage = loadImage("obstacle.png");
  
  restartImage = loadImage("reset.jpg");
}

function setup() {
  createCanvas(400,200);

  
  monkey = createSprite(50,160,20,50);
  monkey.addAnimation("running", monkey_running);
  monkey.scale = 0.1;
  
  ground = createSprite(200,200,800,10);
  ground.addAnimation("ground");
  ground.x = ground.width /2;
  
  gameOver = createSprite(200,70,10,10);
  gameOver.addAnimation("gameOver",gameOverImage);
  gameOver.scale = 0.3;
  gameOver.visible = false;
  
  restart = createSprite(200,150,10,10);
  restart.addAnimation("restart",restartImage);
  restart.scale = 0.1;
  restart.visible = false;
  
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstacleGroup = createGroup();
  bananaGroup = createGroup();

  
  monkey.setCollider("circle",0,0,200);
   //monkey.debug = true
  
  score = 0;
  
}

function draw() {
  
  background("white");
  //displaying score
  text("Score: "+ score, 50,50);
  
  
  if(gameState === PLAY){
 
    monkey.changeAnimation("running",monkey_running);
    
    gameOver.visible = false;
    restart.visible = false;
    
    
    
    ground.velocityX = -(4 + 3* score/100)
    
    
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& monkey.y >= 160) {
        monkey.velocityY = -12;

    }
    
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8
  
    //spawn the clouds
    spawnBanana();
  
    //spawn obstacles on the ground
    spawnObstacle();
    
    if(obstacleGroup.isTouching(monkey)){
        //monkey.velocityY = -12;
        gameState = END;
    }
  }
   else if (gameState === END) {
     
     
     monkey.pause()   
     
     if(mousePressedOver(restart)) {
      reset();
    }
     
     gameOver.visible = true;
     restart.visible = true;
     
     
      ground.velocityX = 0;
      monkey.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
     
     obstacleGroup.setVelocityXEach(0);
     bananaGroup.setVelocityXEach(0);    
     
     
   }
  
 
  //stop trex from falling down
  monkey.collide(invisibleGround);
  
  
  /*
    if(bananaGroup.isTouching(monkey)) {
     bananaGroup.destroyEach();
     score = score+1;
     }
     */
    
    for(var i = 0;i<bananaGroup.length;i++){ 
      if (bananaGroup.get(i).isTouching(monkey)) {
          bananaGroup.get(i).destroy();
        score = score + 1;
      }
    }
     

  drawSprites();
}

function reset(){
  gameState = PLAY; 
  obstacleGroup.destroyEach();
  bananaGroup.destroyEach();
  //change the monkey animation
  monkey.changeAnimation("running",monkey_running);
  monkey.play();
  score = 0; 
}


function spawnObstacle(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,187,10,40);
   obstacle.velocityX = -(6 + score/100);
   
     obstacle.addImage(obstacleImage);

   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1  ;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstacleGroup.add(obstacle);
 }
}

function spawnBanana() {
  //write code here to spawn the banana
  if (frameCount % 60 === 0) {
    var banana = createSprite(600,120,40,10);
    banana.y = Math.round(random(80,120));
    banana.addImage(bananaImage);
    banana.scale = 0.11;
    banana.velocityX = -4;
    
     //assign lifetime to the variable
    banana.lifetime = 200;
    
    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    //add each banana to the group
    bananaGroup.add(banana);
  }
}

