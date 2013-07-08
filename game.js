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

borg = {x: 0, y:0, width: 400, height: 400, imageLocation: 'images/borg.png'};
borgHealth = new Entity(spaceCanvas.width-200, 30, 200, 30, 0, 'green');

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
    missile = new Entity(ship.x-(ship.width/2), ship.y-(ship.height/2), 10,10,0.005, 'white');
    bullets.push(missile);
  })
    moveMissile();
};

function moveMissile(){
  if(bullets.length>0){
    for (var i = 0; i < 5; i++){
      if(collides(bullets[i],borgShip)===true || collides(bullets[i+5], borgShip)===true){
        bullets.forEach(function(pew){
          context.clearRect(pew.x, pew.y, pew.width, pew.height);
        })
        clearInterval(animate);
        bullets.length = 0;
        if (borgHealth.width===30){
          attackBorg();
        }
        else{
          loseHealth();
        }
      }
      else{
        movement.left(bullets[i]);
        movement.up(bullets[i+5]);
        animate = setInterval(moveMissile, 50);
      }
    }
}
};
function loseHealth(){
  context.clearRect(borgHealth.x, borgHealth.y, borgHealth.width, borgHealth.height);
  if (borgHealth.width < 75){
    borgHealth.color = 'red';
  }
  borgHealth.width -= 10;
  borgHealth.draw();
}

function detectSpace(e){
  if(e.keyCode === 32){
    fireMissile();
  }
};

function attackBorg(){
  document.onkeypress = null;
  clearInterval(animate);
  tractorBeam(context);
  animate = setInterval(attackBorg,100);
  for (var i = 0; i < 5; i++) {
    if (collides(federation[i], borgShip)===true || collides(federation[i+5], borgShip)===true){
      loseGame();
    }

    else{
    movement.capture(federation[i+5]);
    movement.capture(federation[i]);
    }
  }
};



  // moves ships towards BORG
movement = {
  capture: function(ship){
    context.clearRect(ship.x, ship.y, ship.width+100, ship.height+100);
    ship.x += (220-ship.x)*ship.speed;
    ship.y += (95-ship.y)*ship.speed;
    ship.draw(context); 
  },
  left: function(pew){
    context.clearRect(pew.x, pew.y, pew.width*2, pew.height*2);
    pew.x -= 10*pew.speed;
    pew.draw(context);
  },
  up: function(pew){
    context.clearRect(pew.x, pew.y, pew.width*2, pew.height*2);
    pew.y -= 10*pew.speed;
    pew.draw(context);    
  }
};


function loseGame(){
  clearInterval(animate);
  context.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height)
  context.font = '30pt Ariel';
  context.fillStyle = 'white';
  context.fillText("You have been assimilated.",300,500);
};

function gameLoop(){
  federation.forEach(function(ships){
    ships.draw();
  })
  drawBorg();
  borgHealth.draw();
  document.onkeypress = detectSpace;
}
setTimeout(gameLoop, 98000);
}());