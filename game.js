var spaceCanvas = document.getElementById('space');
var context = spaceCanvas.getContext('2d');
var animate = null;
var borgShip;
var federation;

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
Entity.prototype.drawImg = function(name){
  var self = this;
  name = new Image();
  name.src = self.imageLocation;
  name.onload = function(){
    context.drawImage(name, self.x, self.y);
  }
}
Entity.prototype.destroy = function(){
  context.clearRect(this.x, this.y, this.width, this.height);
}
enterprise = new Entity(600,200,200,10,10,null, 'images/starfleet.png');
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

function fireMissile(ent){
  missile = new Entity(ent.x-10, ent.y-(ent.height/2), 10,10,0.05,'white',null);
  missile.draw();
  while(collides(missile,borgShip)!==true){
    movement(missile, 10)(-0.1,0);
  }
    missile.destroy();
    loseHealth();
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
      enterprise.x -= enterprise.speed;
      break;
    case(39):
      enterprise.x += enterprise.speed;
      break;
    case(38):
      enterprise.y -= enterprise.speed;
      break;
    case(40):
      enterprise.y += enterprise.speed;
      console.log("down");
      break;
    case(32):
      fireMissile(enterprise);
      console.log("space");
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
    ent.draw();
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
  borg.drawImg(borgShip);
  enterprise.drawImg(federation);
  borgHealth.draw();
  context.font = '10pt Droid Sans';
  context.fillStyle = 'white';
  context.fillText("BORG shield level", borgHealth.x,borgHealth.y+(borgHealth.height*2));
}
init();
animate = setInterval(gameLoop,1);
// setTimeout(gameLoop, 98000);