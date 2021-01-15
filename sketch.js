var db, dbref;
var dog, sadDog, happyDog;
var garden, washroom, bedroom;
var FoodStock, foodS;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var stateRef, GameState;
var currentTime;

function preload()
{
  //loading Images of the dog
  sadDog=loadImage("images/Dog.png");
  happyDog=loadImage("images/Happy.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
  bedroom=loadImage("images/Bed Room.png");
}


function setup() {
  createCanvas(400, 500);
  
  //connecting to database and creating an instance
  db = firebase.database();
  dbref = db.ref;

  foodObj = new Food();

  //reading value of "Food"
  FoodStock = db.ref("Food")
  FoodStock.on("value", readStock);

  stateRef = db.ref("gameState");
  stateRef.on("value", function(data){
    GameState = data.val();
  })

  //creating sprite for dog and adding image
  dog = createSprite(300,400,150,150);
  dog.addImage(sadDog)
  dog.scale = 0.2;

  feed=createButton("Feed the Dog");
  feed.position(100, 50);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(200,50);
  addFood.mousePressed(addFoods);

}


function draw() {  
  background("green");
  //46, 139, 87

  
  fedTime=db.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  
 

   currentTime = hour();
  if(currentTime===(lastFed+1)){
    updateState("Playing");
    foodObj.garden();
  }else if(currentTime===(lastFed+2)){
  updateState("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  updateState("Bathing");
    foodObj.washroom();
  }else{
  updateState("Hungry")
  foodObj.display();
  }

  
 
 if(GameState!="Hungry"){
   dog.remove();
   feed.hide();
   addFood.hide();

 }
 
 if(GameState === "Hungry"){
  feed.show();
  addFood.show();
  foodObj.display();
  dog.addImage(sadDog);
 }

   drawSprites();
}



function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function writeStock(a){
  //decreasing value of food
  if(a<=0 ){
    a = 0
  }
  else{
    a = a-1;
  }

  //updating value of food in the database
  db.ref("/").update({Food : a})
}


function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  db.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour(),
      gameState:"Hungry"
    })
  
  
}


//function to add food in stock
function addFoods(){
  foodS++;
  db.ref('/').update({
    Food:foodS
  })
}

function updateState(state){
  db.ref("/").update({
    gameState : state
  });
}
