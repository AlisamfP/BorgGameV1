(function(){
var spaceCanvas = document.getElementById('space');
var context = spaceCanvas.getContext('2d');
var animate = null;
var federation = [];
var bullets = [];

function collides(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
};

function Entity(x,y,width,height,speed,color){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  this.color = color;
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

borg = {x: 0, y:0, width: 400, height: 400, imageLocation: 'images/borg.png'};
borgHealth = new Entity(spaceCanvas.width-200, 30, 200, 30, 10, 'green');

  // loop to create federation ships
for (i=0; i<5; i++){
  federation[i] = new Entity(600, (i+1)*75, 50, 10, 0.03, 'white');
  federation[i+5] = new Entity((i+1)*75, 600, 10, 50, 0.03, 'white');
};


function tractorBeam(context){
  federation.forEach(function(ship){
    context.beginPath();
    context.moveTo(220,95);
    context.lineTo(ship.x+(ship.width/2), ship.y+(ship.height/2));
    context.lineWidth = 3;
    context.strokeStyle = 'green';
    context.stroke();
  })
};

drawBorg = function() {
  borgShip = new Image();
  borgShip.src = borg.imageLocation;
  borgShip.onload = function(){
    context.drawImage(borgShip, borg.x, borg.y);
  }
};

function fireMissile(){
  federation.forEach(function(ship){
    missile = new Entity(ship.x-(ship.width/2), ship.y-(ship.height/2), 10,10,0.05, 'white');
    bullets.push(missile);
  })
    moveMissile();
};

function moveMissile(){
  if(bullets.length>0){
    for (var i = 0; i < 5; i++){
      if(collides(bullets[i],borgShip)===true || collides(bullets[i+5], borgShip)===true){
        bullets.forEach(function(pew){
          pew.destroy();
        })
        clearInterval(animate);
        bullets.length = 0;
        if (borgHealth.width < 50){
          borgAttack();
        }
        else{
          loseHealth();
        }
      }
      else{
        movement(bullets[i], 10)(-10,0);
        movement(bullets[i+5], 10)(0,-10);
        animate = setInterval(moveMissile, 50);
      }
    }
}
};
function loseHealth(){
  borgHealth.destroy();
  if (borgHealth.width < 100){
    borgHealth.color = 'red';
  }
  borgHealth.width -= borgHealth.speed;
  borgHealth.draw();
}

function detectSpace(e){
  if(e.keyCode === 32){
    fireMissile();
  }
};

function borgAttack(){
  document.onkeypress = null;
  clearInterval(animate);
  tractorBeam(context);
  animate = setInterval(borgAttack,100);
  for (var i = 0; i < 5; i++) {
    if (collides(federation[i], borgShip)===true || collides(federation[i+5], borgShip)===true){
      loseGame();
    }

    else{
    movement(federation[i+5],100)(220-federation[i+5].x, 95-federation[i+5].y);
    movement(federation[i],100)(220-federation[i].x, 95-federation[i].y);
    }
  }
};

  // moves ships towards BORG
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
  federation.forEach(function(ships){
    ships.draw();
  })
  drawBorg();
  borgHealth.draw();
  context.font = '10pt Droid Sans';
  context.fillStyle = 'white';
  context.fillText("BORG shield level", borgHealth.x,borgHealth.y+(borgHealth.height*2));
  document.onkeypress = detectSpace;
}
setTimeout(init, 10);
}());