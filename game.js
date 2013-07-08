var spaceCanvas = document.getElementById('space');
var context = spaceCanvas.getContext('2d');
var animate = null;
var borgShip=null;
var federation=null;

function collides(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
};

function Entity(x,y,width,height,speed,color,imageLocation){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  this.color = color;
  this.imageLocation = imageLocation;
};
Entity.prototype.draw = function(){
  context.beginPath();
  context.rect(this.x, this.y, this.width, this.height);
  context.fillStyle = this.color;
  context.closePath();
  context.fill();   
};
Entity.prototype.destroy = function(){
  context.clearRect(this.x, this.y, this.width, this.height);
}
enterprise = new Entity(600,200,200,10,1,null, 'images/starfleet.png');
borg = new Entity(0, 0, 400, 400, 0, null, 'images/borg.png');
borgHealth = new Entity(spaceCanvas.width-200, 30, 200, 30, 10, 'green', null);

function tractorBeam(context){
    context.beginPath();
    context.moveTo(220,95);
    context.lineTo(federation.x+(federation.width/2), federation.y+(federation.height/2));
    context.lineWidth = 3;
    context.strokeStyle = 'green';
    context.stroke();
};

drawBorg = function(){
  borgShip = new Image();
  borgShip.src = borg.imageLocation;
  borgShip.onload = function(){
    context.drawImage(borgShip,borg.x,borg.y);
  }
};
drawFed = function(){
  federation = new Image();
  federation.src = enterprise.imageLocation;
  federation.onload = function(){
    context.drawImage(federation,enterprise.x,enterprise.y);
  }
};

function fireMissile(){
  missile = new Entity(enterprise.x, enterprise.y-(enterprise.height/2), 10,10,0.05,'white',null);
  while(collides(missile,borgShip)!=true){
    movement(missile, 10)(-15,0);
  }
    missile.destroy();
    loseHealth();
};

function moveMissile(){
  if(collides(missile,borgShip)===true){
    missile.destroy();
    loseHealth();
  }
  else{
    movement(missile, 10)(-15,0);
  }
};
function loseHealth(){
  if (borgHealth.width > 50){
    borgHealth.destroy();
    if (borgHealth.width < 100){
      borgHealth.color = 'red';
    }
    borgHealth.width -= borgHealth.speed;
    borgHealth.draw();
  }
  else{
    borgAttack();
  }
};

function detectKey(e){
  switch(e.keyCode){
    case(37):
      return enterprise.x -= enterprise.speed;
      break;
    case(39):
      enterprise.x += enterprise.speed;
      break;
    case(38):
      enterprise.y -= enterprise.speed;
      break;
    case(40):
      enterprise.y += enterprise.speed;
      break;
    case(32):
    console.log("space was pressed")
      fireMissile();
      break;
  }
};

function borgAttack(){
  document.onkeypress = null;
  tractorBeam(context);
    if (collides(federation, borgShip)===true){
      loseGame();
    }
    else{
    movement(federation,100)(220-federation.x, 95-federation.y);
    }
};

  // moves bullets towards BORG
function movement(ent, offset){
  return function(dx, dy){
    context.clearRect(ent.x,ent.y,ent.width+offset,ent.height+offset);
    ent.x += dx*ent.speed;
    ent.y += dy*ent.speed;
    ent.draw(context);
  }
}

function loseGame(){
  clearInterval(animate);
  context.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height)
  context.font = '30pt Droid Sans';
  context.fillStyle = 'white';
  context.fillText("You have been assimilated.",300,500);
};
function init(){
  document.onkeypress = detectKey;
}

function gameLoop(){
  drawBorg();
  drawFed();
  borgHealth.draw();
  context.font = '10pt Droid Sans';
  context.fillStyle = 'white';
  context.fillText("BORG shield level", borgHealth.x,borgHealth.y+(borgHealth.height*2));
}
init();
animate = setInterval(gameLoop,1);
// setTimeout(gameLoop, 98000);