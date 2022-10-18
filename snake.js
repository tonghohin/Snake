const x = document.querySelector("#playground");
const playground = x.getContext("2d");
const gameover = document.querySelector("#gameover");
const gameovermessage = document.querySelector("#gameovermessage");
const startagain = document.querySelector("#startagain");
const bestscore = document.querySelector("#bestscore");
const score = document.querySelector("#score");
score.innerHTML = 0;

let stillAlive = true;
let canChangePosition = true;

// background
playground.fillStyle = "rgb(250, 215, 143)";
playground.fillRect(0, 0, 510, 510);

// initial snake
const snake = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 20, y: 0 },
  { x: 30, y: 0 },
  { x: 40, y: 0 },
  { x: 50, y: 0 },
];
for (let i = 0; i < snake.length; i++) {
  playground.fillStyle = "darkgreen";
  playground.fillRect(snake[i].x, snake[i].y, 10, 10);
}

// initial apple
let appleX = 100;
let appleY = 100;
playground.fillStyle = "red";
playground.fillRect(appleX, appleY, 10, 10);

// fill the last block of the snake with the playground color
function clearOldSnake() {
  playground.fillStyle = "rgb(250, 215, 143)";
  playground.fillRect(snake[0].x, snake[0].y, 10, 10);
}

// configure direction
// use canChangePosition to avoid bugs when user clicks two different directions very fast
// prevent going to left at the start
let direction;
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "Down" && canChangePosition) {
        direction = "Up";
        console.log(direction);
        canChangePosition = false;
      }
      break;

    case "ArrowDown":
      if (direction !== "Up" && canChangePosition) {
        direction = "Down";
        console.log(direction);
        canChangePosition = false;
      }
      break;

    case "ArrowRight":
      if (direction !== "Left" && canChangePosition) {
        direction = "Right";
        console.log(direction);
        canChangePosition = false;
      }
      break;

    case "ArrowLeft":
      if (
        direction !== "Right" &&
        direction !== undefined &&
        canChangePosition
      ) {
        direction = "Left";
        console.log(direction);
        canChangePosition = false;
      }
      break;

    case "Enter":
      if (gameover.style.display === "block") {
        location.reload();
      }
  }
});

// first check snake going which direction
// then remove the last pair of coordinates (snake's tail) from the array
// then add a pair at the begginning (snake's head)
// run every 50 milliseconds if stillAlive === true
function changeDirection() {
  switch (direction) {
    case "Right":
      snake.shift();
      snake.push({
        x: snake[snake.length - 1].x + 10,
        y: snake[snake.length - 1].y,
      });
      break;

    case "Left":
      snake.shift();
      snake.push({
        x: snake[snake.length - 1].x - 10,
        y: snake[snake.length - 1].y,
      });
      break;

    case "Up":
      snake.shift();
      snake.push({
        x: snake[snake.length - 1].x,
        y: snake[snake.length - 1].y - 10,
      });
      break;

    case "Down":
      snake.shift();
      snake.push({
        x: snake[snake.length - 1].x,
        y: snake[snake.length - 1].y + 10,
      });
  }

  newSnake();

  if (stillAlive) {
    setTimeout(function () {
      clearOldSnake();
      changeDirection();
    }, 50);
  }
}

// fill newly added snake's head
// canChangePosition true again
function newSnake() {
  playground.fillStyle = "darkgreen";
  playground.fillRect(
    snake[snake.length - 1].x,
    snake[snake.length - 1].y,
    10,
    10
  );
  canChangePosition = true;
  appleEaten();
  gameOverOutOfPlayground();
  gameOverHitSelf();
}

// appleCoordinates.length = 51, with all the usable coordinates
const appleCoordinates = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170,
  180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320,
  330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470,
  480, 490, 500,
];

// check if snake's head coordinates === apple's
function appleEaten() {
  if (
    snake[snake.length - 1].x === appleX &&
    snake[snake.length - 1].y === appleY
  ) {
    changeApplePosition();
    addSnake();
    addScore();
  }
}

// check if apple coordinates === any of snake coordinates
// if true, run this function again to check again
// if false, fill the apple
function changeApplePosition() {
  appleX = appleCoordinates[Math.floor(Math.random() * 51)];
  appleY = appleCoordinates[Math.floor(Math.random() * 51)];

  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === appleX && snake[i].y === appleY) {
      changeApplePosition();
      console.log("ATTENTION!!!!!!");
    }
  }

  playground.fillStyle = "red";
  playground.fillRect(appleX, appleY, 10, 10);
}

// add three blocks at the tail each time
function addSnake() {
  if (snake[0].x < snake[1].x && snake[0].y === snake[1].y) {
    snake.unshift(
      { x: snake[0].x - 10, y: snake[0].y },
      { x: snake[1].x - 10, y: snake[1].y },
      { x: snake[2].x - 10, y: snake[2].y }
    );
  } else if (snake[0].x > snake[1].x && snake[0].y === snake[1].y) {
    snake.unshift(
      { x: snake[0].x + 10, y: snake[0].y },
      { x: snake[1].x + 10, y: snake[1].y },
      { x: snake[2].x + 10, y: snake[2].y }
    );
  } else if (snake[0].x === snake[1].x && snake[0].y < snake[1].y) {
    snake.unshift(
      { x: snake[0].x, y: snake[0].y - 10 },
      { x: snake[1].x, y: snake[1].y - 10 },
      { x: snake[2].x, y: snake[2].y - 10 }
    );
  } else if (snake[0].x === snake[1].x && snake[0].y > snake[1].y) {
    snake.unshift(
      { x: snake[0].x, y: snake[0].y + 10 },
      { x: snake[1].x, y: snake[1].y + 10 },
      { x: snake[2].x, y: snake[2].y + 10 }
    );
  }
}

function addScore() {
  score.innerHTML++;
  if (Number(score.innerHTML) > Number(bestscore.innerHTML)) {
    bestscore.innerHTML++;
  }
}

// snake goes out of playgorund
function gameOverOutOfPlayground() {
  if (
    snake[snake.length - 1].x < 0 ||
    snake[snake.length - 1].x > 500 ||
    snake[snake.length - 1].y < 0 ||
    snake[snake.length - 1].y > 500
  ) {
    gameover.style.display = "block";
    stillAlive = false;
    setBestScore();
  }
}

// check if snake's head coordinates === any of the body
function gameOverHitSelf() {
  for (let i = 0; i < snake.length - 1; i++) {
    if (
      snake[i].x === snake[snake.length - 1].x &&
      snake[i].y === snake[snake.length - 1].y
    ) {
      gameover.style.display = "block";
      stillAlive = false;
      setBestScore();

      playground.fillStyle = "Purple";
      playground.fillRect(
        snake[snake.length - 1].x,
        snake[snake.length - 1].y,
        10,
        10
      );
    }
  }
}

// store best score
bestscore.innerHTML = localStorage.getItem("BestScore");
function setBestScore() {
  if (Number(score.innerHTML) > localStorage.getItem("BestScore")) {
    localStorage.setItem("BestScore", Number(score.innerHTML));
    gameovermessage.innerHTML = "NEW HIGH SCORE!";
  }
}

startagain.addEventListener("click", () => {
  location.reload();
});

changeDirection();
