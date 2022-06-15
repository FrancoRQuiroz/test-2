var canvas = document.getElementById("the-game");
var context = canvas.getContext("2d");
var game, snake, food;
let jugador = prompt("Ingrese su nombre:")


/*ACTIVIDAD 3/
const ws = new WebSocket('wss://ucp-games-2021.azurewebsites.net/multiplayer');
ws.addEventListener('open',function(event){
  ws.send(data);
  
})
ws.addEventListener('message',function(event){
  console.log('Respuesta',event.data);
})

var data = JSON.stringify({"game":"GameSnake","event":"size","value":1,"event":"puntos","value":1,"event":"partidas","value":1,"player":jugador});

document.getElementById('puntos').innerHTML = jugador + " partidas " + actividad.partidas + " puntos " + actividad.puntos + " tamaño " + actividad.size;
*/
game = {
  
  score: 0,
  fps: 8,
  over: false,
  message: null,
  
  start: function() {
    game.over = false;
    game.message = null;
    game.score = 0;
    game.fps = 8;
    snake.init();
    food.set();
  },
  
  stop: function() {
    game.over = true;
    game.message = 'GAME OVER - PRESS SPACEBAR';
    /*ACTIVIDAD 1*/
    console.log("Empezar de nuevo");
    let partidas = parseInt(window.localStorage.getItem('partidas'));
    partidas = partidas + 1;
    window.localStorage.setItem('partidas', partidas);
    snake.sumarpuntos('partidas');
  },
  
  drawBox: function(x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x - (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y + (size / 2));
    context.lineTo(x - (size / 2), y + (size / 2));
    context.closePath();
    context.fill();
  },
  
  drawScore: function() {
    context.fillStyle = '#999';
    context.font = (canvas.height) + 'px Impact, sans-serif';
    context.textAlign = 'center';
    context.fillText(game.score, canvas.width / 2, canvas.height * 0.9);
    
  },
  
  drawMessage: function() {
    if (game.message !== null) {
      context.fillStyle = '#00F';
      context.strokeStyle = '#FFF';
      context.font = (canvas.height / 10) + 'px Impact';
      context.textAlign = 'center';
      context.fillText(game.message, canvas.width / 2, canvas.height / 2);
      context.strokeText(game.message, canvas.width / 2, canvas.height / 2);
    }
  },
  
  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
};



snake = {
  
  size: canvas.width / 40,
  x: null,
  y: null,
  color: '#0F0',
  direction: 'left',
  sections: [],
  
  init: function() {
    snake.sections = [];
    snake.direction = 'left';
    snake.x = canvas.width / 2 + snake.size / 2;
    snake.y = canvas.height / 2 + snake.size / 2;
    for (var i = snake.x + (5 * snake.size); i >= snake.x; i -= snake.size) {
      snake.sections.push(i + ',' + snake.y); 
    }
  },
  
  move: function() {
    switch (snake.direction) {
      case 'up':
        snake.y -= snake.size;
        break;
      case 'down':
        snake.y += snake.size;
        break;
      case 'left':
        snake.x -= snake.size;
        break;
      case 'right':
        snake.x += snake.size;
        break;
    }
    snake.checkCollision();
    snake.checkGrowth();
    snake.sections.push(snake.x + ',' + snake.y);
  },
  
  draw: function() {
    for (var i = 0; i < snake.sections.length; i++) {
      snake.drawSection(snake.sections[i].split(','));
    }    
  },
  
  drawSection: function(section) {
    game.drawBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.color);
  },
  
  checkCollision: function() {
    if (snake.isCollision(snake.x, snake.y) === true) {
      game.stop();
      
    }
  },
  
  isCollision: function(x, y) {
    if (x < snake.size / 2 ||
        x > canvas.width ||
        y < snake.size / 2 ||
        y > canvas.height ||
        snake.sections.indexOf(x + ',' + y) >= 0) {
      return true;
    }
  },
  /*FUNCION SUMARPUNTOS*/ 
  sumarpuntos: function(key){
    var actividad = JSON.parse(localStorage.getItem('actividad'));
    
    if(actividad == null){
     actividad = {
        partidas : 0,
        puntos : 0,
        size : 0,
      }
    }

   if( key == 'puntos'){
      actividad.puntos++;
   }

   if( key == 'size'){
    actividad.size++;
   }

  if( key == 'partidas'){
   actividad.partidas++;
   }

    window.localStorage.setItem('actividad',JSON.stringify(actividad));

    console.table(actividad);
  },
  
  checkGrowth: function() {
    if (snake.x == food.x && snake.y == food.y) {
      game.score++;

      snake.sumarpuntos("puntos");

      if (game.score % 5 == 0 && game.fps < 60) {
        game.fps++;
      }
      food.set();

     snake.sumarpuntos("size");
      
    } else {
      snake.sections.shift();
    }
  }
  
};


food = {
  
  size: null,
  x: null,
  y: null,
  color: '#0FF',
  
  set: function() {
    food.size = snake.size;
    food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
    food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
  },
  
  draw: function() {
    game.drawBox(food.x, food.y, food.size, food.color);
    
  }
};

var inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
};

var keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_game: [13, 32]
};

function getKey(value){
  for (var key in keys){
    if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
}

addEventListener("keydown", function (e) {
    var lastKey = getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0
        && lastKey != inverseDirection[snake.direction]) {
      snake.direction = lastKey;
    } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) {
      game.start();
    }
}, false);

var requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

function loop() {
  if (game.over == false) {
    game.resetCanvas();
    game.drawScore();
    snake.move();
    food.draw();
    snake.draw();
    game.drawMessage();
  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
}
/*ACTIVIDAD 2*/
var Size = localStorage.key("size");
let size = window.localStorage.getItem("size");
/*window.localStorage.setItem("size", Number(1));*/

var Puntos = localStorage.key("puntos");
let puntos = window.localStorage.getItem('puntos');
window.localStorage.setItem('puntos', Number(0));

var Partidas = localStorage.key("partidas");
let partidas = window.localStorage.getItem("partidas");

if( partidas == null){
  window.localStorage.setItem("partidas", Number(0));
}
if(size < 1){
  window.localStorage.setItem("size", Number(1));
}
/*Splash Screen y Boton de Instalacion*/
window.onload = (e) => { 
  // Declare init HTML elements
  const buttonAdd = document.querySelector('#buttonAdd');

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
     // Show prompt modal if user previously not set to dismissed or accepted
     if(!statusPrompt.get()) {
      // Change status prompt
      promptToggle(prompt, 'show', 'hide');
    }
  });

  // Add event click function for Add button
  buttonAdd.addEventListener('click', (e) => {
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
}







requestAnimationFrame(loop);