var name = sessionStorage.getItem("name");
const firebaseConfig = {
    apiKey: "AIzaSyAEUlVvqRpBgQZE0MES9s1UWW2FNsdiIWo",
    authDomain: "picklebutt-arcade.firebaseapp.com",
    projectId: "picklebutt-arcade",
    storageBucket: "picklebutt-arcade.appspot.com",
    messagingSenderId: "796801287786",
    appId: "1:796801287786:web:493f3203017be7cbb96c13",
};
const db = window.db;
const set = window.set;
const dataRef = window.dataRef;
const fetchDataAndDraw = window.fetchDataAndDraw;
const update = window.update;
const Top10 = window.fetchData;
const updateFrogger = window.updateFrogger
var handle = sessionStorage.getItem('name');
const basePath = './picklebutt-frogger/';


console.log("name", handle);
const gameArea = document.querySelector(".gamearea");
const game = {
  x: 20,
  y: 18,
  elements: [],
  active: 7,
  speed: 10,
  counter: 0,
  inPlay: true,
  logSize: 3,
  totalScore : 0   
};
const keyz = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};
const obs = [];
function moveObstacles() {
  obs.forEach((el) => {
    let temp = el.pos;
    if (el.dir == "left") {
      el.pos--;
      if (el.pos < el.row * game.x) {
        el.pos += game.x;
      }
    } else {
      el.pos++;
      if (el.pos > (el.row + 1) * game.x - 1) {
        el.pos -= game.x;
      }
    }
    if (el.type == "log") {
      for (let x = 0; x < game.logSize; x++) {
        game.elements[temp + x].classList.remove(el.type);
      }
      for (let x = 0; x < game.logSize; x++) {
        if (el.pos + x < (el.row + 1) * game.x) {
          game.elements[el.pos + x].classList.add(el.type);
        }
      }
    } else {
      game.elements[temp].classList.remove(el.type);
      game.elements[el.pos].classList.add(el.type);
    }
  });
}
// gameArea.addEventListener("click", (e) => {
//   if (game.inPlay) {
//     stopGame();
//   } else {
//     startGame();
//   }
// });\
async function mover() {
  // console.log(keyz)
  game.counter++;
  if (game.counter > game.speed) {
    game.counter = 0;

    game.elements[game.active].classList.remove("frog-pickle");
    if (keyz.ArrowLeft && game.active % game.x != 0) {
      game.active--;
    } else if (keyz.ArrowRight && (game.active + 1) % game.x != 0) {
      game.active++;
    }
    if (keyz.ArrowUp && game.active > game.x - 1) {
      game.active -= game.x;
    } else if (keyz.ArrowDown && game.active < game.x * game.y - game.x) {
      game.active += game.x;
    }
    for (keyPress in keyz) {
      keyz[keyPress] = false;
    }
    moveObstacles()
    // obs.forEach((el, index) => {
    //   let temp = el.pos;
    //   if (el.dir == "left") {
    //     el.pos--;
    //     if (el.pos < el.row * game.x) {
    //       el.pos += game.x;
    //     }
    //   } else {
    //     el.pos++;
    //     if (el.pos > (el.row + 1) * game.x - 1) {
    //       el.pos -= game.x;
    //     }
    //   }
    //   if (el.type == "log") {
    //     for (let x = 0; x < game.logSize; x++) {
    //       game.elements[temp + x].classList.remove(el.type);
    //     }
    //     for (let x = 0; x < game.logSize; x++) {
    //         // console.log('log', el.pos + x, (el.row + 1) * game.x, game.elements[el.pos + x].classList)
    //       if (el.pos + x < (el.row + 1) * game.x) {
    //         game.elements[el.pos + x].classList.add(el.type);
    //       }
    //     }
    //   } else {
    //     game.elements[temp].classList.remove(el.type);
    //     game.elements[el.pos].classList.add(el.type);
    //   }
    //   // if (game.elements[game.active].classList.contains('safe')){
    //   //     console.log('you win')
    //   // }
    // });
  }
  let current = game.elements[game.active].classList;

  if (current.contains("safe")) {
    // console.log("you win");
    
    //   game.inPlay = false  
    stopGame();
    game.totalScore += 100;
    score = game.totalScore;
        const data = {
          Name: handle,
          Score: score
        }
      await  updateFrogger(handle, data)
  
    openModal(`You win! ${score} points!`)  
    
    return 
  } else if (current.contains("car") || current.contains("car2") ) {
    console.log("you lose");
    // game.inPlay = false
    // stopGame();
    // openModal('You got hit by a car!')
  } else if (current.contains("water")) {
    if (current.contains("log")) {

    //   game.elements[game.active].classList.remove("frog-pickle");
      console.log("you safe");
      if (current.contains("left")) {
        // game.active--;
        keyz.ArrowLeft = true;
      } else {
        keyz.ArrowRight = true;
      }
    } else {
      // stopGame();
      // openModal('You fell in the water!')
      //    game.inPlay = false
    }

    // game.inPlay = false
  }

  game.elements[game.active].classList.add("frog-pickle");
  if (game.inPlay) {
    startGame();
  }
}

document.addEventListener("DOMContentLoaded", init);

document.addEventListener("keydown", (e) => {
  //   console.log(e.code);
  if (e.code in keyz) keyz[e.code] = true;
});
document.addEventListener("keyup", (e) => {
  //   if (e.code in keyz) keyz[e.code] = false;
});
function init() {
//   console.log(game);
//   game.message = createMyElements(gameArea, "div", "message", "message");
  game.board = createMyElements(gameArea, "div", "", "gameBoard");
  game.rect = game.board.getBoundingClientRect();
  createBoard();
  game.active = Math.floor(game.x * game.y - game.x / 2);
  game.animation = requestAnimationFrame(mover);
}

function createMyElements(parent, elementType, html, classname) {
  const element = document.createElement(elementType);
  parent.appendChild(element);
  element.innerHTML = html;
  element.classList.add(classname);
  return element;
}
// function createBoard() {
//   const total = game.x * game.y;
//   const safety = Math.floor(game.x * Math.random());
//   let steps = 0;
//   let tempClass = "land";
//   let row = 0;
//   let dir = "right";
//   for (let i = 0; i < total; i++) {
//     steps++;
//     if (i % 4 == 0) {
//       steps = Math.floor(Math.random() * 2);
//     }
//     let temp = createMyElements(game.board, "div", "", "box");
//     if (i == safety) {
//       temp.classList.add("safe");
//     }
//     if (i % game.x == 0) {
//       row = i / game.x;
//       console.log("moin", row);
//       if (row > 0 && row < game.y / 2) {
//         tempClass = "water";
//       } else if (row > game.y / 2 && row < game.y - 1) {
//         tempClass = "road";
//       } else {
//         tempClass = "land";
//       }
//       //   tempClass = tempClass == 'land' ? 'water' : 'land'
//     }
//     dir = row % 2 == 0 ? "left" : "right";
//     temp.classList.add(tempClass);
//     if (tempClass == "road" && steps == 0) {
//       temp.classList.add("car");
//       steps = 0;
//       obs.push({ type: "car", pos: i, dir: dir, row: row });
//     }
//     if (tempClass == "water" && steps == 0) {
//       temp.classList.add("log");
//     //   steps = 0;
//       obs.push({ type: "log", pos: i, dir: dir, row: row });
//     }
//     temp.classList.add(dir);
//     game.elements.push(temp);
//   }
//   game.board.style.setProperty(
//     "grid-template-columns",
//     "repeat(" + game.x + ", 1fr)"
//   );
// }
function createBoard() {
  const total = game.x * game.y;
  const safety = Math.floor(game.x * Math.random());
  let tempClass = "land";
  let row = 0;
  let dir = "right";
  
  for (let i = 0; i < total; i++) {
    let temp = createMyElements(game.board, "div", "", "box");
    
    // Set the safety class
    if (i == safety) {
      temp.classList.add("safe");
    }
    
    // Determine the class for each cell based on the row
    if (i % game.x == 0) {
      row = Math.floor(i / game.x);
      
      if (row > 0 && row < game.y / 2) {
        tempClass = "water";
      } else if (row > game.y / 2 && row < game.y - 1) {
        tempClass = "road";
      } else {
        tempClass = "land";
      }
    }
    
    temp.classList.add(tempClass);
    if (tempClass == "road" && Math.random() < 0.1) {
      // // Add car
      // temp.classList.add("car");
      // obs.push({ type: "car", pos: i, dir: dir, row: row });
      let carClass = dir === "left" ? "car2" : "car";

      // Add the determined class
      temp.classList.add(carClass);
    
      // Push the object to the array
      obs.push({ type: carClass, pos: i, dir: dir, row: row });
    } else if (tempClass == "water" && Math.random() < 0.2) {
      // Add log
      temp.classList.add("log");
      obs.push({ type: "log", pos: i, dir: dir, row: row });
    }
    
    // Update direction for the next row
    dir = row % 2 == 0 ? "left" : "right";
    
    // Add direction class to the cell
    temp.classList.add(dir);
    
    // Add the cell to the elements array
    game.elements.push(temp);
  }
  
  // Set the grid template columns
  game.board.style.setProperty(
    "grid-template-columns",
    "repeat(" + game.x + ", 1fr)"
  );
}

// function stopGame() {
//   game.inPlay = false;
  
//   game.elements[game.active].classList.remove("frog-pickle");
  
// //   game.active = Math.floor(game.x * game.y - game.x / 2);
//   game.active += game.x;
//   if(game.active >= game.elements.length){
//     game.active =  game.elements.length - 10
//  }
//   cancelAnimationFrame(game.animation);
// }
function stopGame() {
    game.inPlay = false;
  
    // Remove frog class from the current position
    game.elements[game.active].classList.remove("frog-pickle");
  
    // Reset the frog position to the bottom line
    game.active = Math.floor(game.x * game.y - game.x / 2);
  
    // Check if the frog position is out of bounds and adjust if needed
    if (game.active >= game.elements.length) {
      game.active = game.elements.length - game.x;
    }
  
    // Request a new animation frame
    cancelAnimationFrame(game.animation);
  }
  


function startGame() {
  game.inPlay = true;
  game.animation = requestAnimationFrame(mover);
}



//////
function openModal(message) {
    // Get the modal and the message element
    var modal = document.getElementById('myModal');
    var modalMessage = document.getElementById('modalMessage');
  
    // Set the message
    modalMessage.textContent = message;
  
    // Display the modal
    modal.style.display = 'block';
  }
  
  function closeModal() {
    // Hide the modal
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
  }
  
  // Close the modal if the user clicks outside the modal content
  window.onclick = function(event) {
    var modal = document.getElementById('myModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
  