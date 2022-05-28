//getting the container from our html file
const container = document.querySelector(".container");
const blockWidth = 120;
const blockHeight = 25;
const scoreDisplay = document.querySelector("#score");
let score = 0;
// the gap between the blocks in one row:
const gapRow = 10;
//the gap between the blocks in one column
const gapColumn = 20;

//making the containerWidth and containerHeight global variables
//so I can use them way later.
let containerWidth = 0;
let containerHeight = 0;

//creating a class which gives the block coordinates.
class Block {
  constructor(x, y) {
    this.bottomLeft = [x, y];
    this.bottomRight = [x + blockWidth, y];
    this.topLeft = [x, y + blockHeight];
    this.topRight = [x + blockWidth, y + blockHeight];
  }
}

//setting the number of rows/columns for each difficulty
const easy = 3;
const medium = 4;
const godMode = 9;

let blockList = [];

//a function that makes a number of blocks
//based on the difficulty of the game.
function listBlocks(diffculty) {
  //blocks in one row will have a gap of 10px betwee eachother
  //so the next block needs to shift in the x coordinates
  //by the width of the previous block + gap
  let xShift = blockWidth + gapRow;
  //same as above but this time blocks need
  //to shift in the y coordinates by
  //the height of the previous block + gapColumn
  let yShift = blockHeight + gapColumn;

  //changing the container to fit the number of
  //blocks according to each game level.
  container.style.width = diffculty * xShift + gapRow + "px";
  container.style.height = diffculty * yShift + 10 * gapColumn;
  //setting the width and height of the container to this variables
  //so I can use them later.
  containerWidth = diffculty * xShift + gapRow;
  containerHeight = diffculty * yShift + 10 * gapColumn;
  for (let j = 0; j < diffculty; j++) {
    for (let k = 0; k < diffculty; k++) {
      blockList.push(new Block(10 + j * xShift, 10 + k * yShift));
    }
  }
}
listBlocks(easy);

// making a function that makes the blocks.
function addBlocks() {
  for (let i = 0; i < blockList.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    //the block will get the x coordinates
    //from the bottom left property of the Block we're on now that
    //is the item[i] in the blockList.
    block.style.left = blockList[i].bottomLeft[0] + "px";
    //same as above but this time getting the y coordinates.
    block.style.top = blockList[i].bottomLeft[1] + "px";
    container.appendChild(block);
  }
}
addBlocks();

//user's start coordinates.
let userStart = [containerWidth / 2 - blockWidth / 2, 10];
//the variable that's tracked for user's location.
let currentPosition = userStart;
//adding the user
const user = document.createElement("div");
user.classList.add("user");
user.style.left = currentPosition[0] + "px";
user.style.bottom = currentPosition[1] + "px";
container.appendChild(user);

//moving the user
function moveUser(event) {
  switch (event.key) {
    case "ArrowLeft":
      if (currentPosition[0] - gapRow > 0) {
        currentPosition[0] -= 30;
        user.style.left = currentPosition[0] + "px";
        user.style.bottom = currentPosition[1] + "px";
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] + blockWidth + gapRow < containerWidth) {
        currentPosition[0] += 30;
        user.style.left = currentPosition[0] + "px";
        user.style.bottom = currentPosition[1] + "px";
      }
      break;
    case "ArrowUp":
      if (currentPosition[1] < 80) {
        currentPosition[1] += 30;
        user.style.left = currentPosition[0] + "px";
        user.style.bottom = currentPosition[1] + "px";
      }
      break;
    case "ArrowDown":
      if (currentPosition[1] > 10) {
        currentPosition[1] -= 30;
        user.style.left = currentPosition[0] + "px";
        user.style.bottom = currentPosition[1] + "px";
      }
      break;
  }
}
document.addEventListener("keydown", moveUser);

//add Ball
const ball = document.createElement("div");
ball.classList.add("ball");
container.appendChild(ball);

let middlePoint = containerWidth / 2;

const ballStart = [middlePoint - 20, 40];

let ballCurrentPosition = ballStart;

function drawball() {
  ball.style.left = ballCurrentPosition[0];
  ball.style.bottom = ballCurrentPosition[1];
}

drawball();

//making the ball move

let xDirection = 2;
let yDirection = 2;

function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawball();
  collisions();
}

let timer = setInterval(moveBall, 20);

//collisions

function collisions() {
  //block collisions
  for (let i = 0; i < blockList.length; i++) {
    if (
      ballCurrentPosition[0] > blockList[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blockList[i].bottomRight[0] &&
      ballCurrentPosition[1] + 60 >
        containerHeight - blockList[i].bottomLeft[1] &&
      ballCurrentPosition[1] < containerHeight - blockList[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blockList.splice(i, 1);
      changeDirection();
    }
  }

  //wall collisions
  if (
    ballCurrentPosition[0] >= containerWidth - 40 ||
    ballCurrentPosition[1] >= containerHeight - 40 ||
    ballCurrentPosition[0] <= 0 ||
    ballCurrentPosition[1] <= 0
  ) {
    changeDirection();
  }

  //checking for user collision
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
    score++;
    scoreDisplay.innerHTML = score;
    if (blockList.length == 0) {
      score.innerHTML = "You Win!";
      clearInterval(timerId);
      document.removeEventListener("keydown", moveUser);
    }
  }

  //checking for game over
  if (ballCurrentPosition[1] == 0) {
    clearInterval(timer);
    scoreDisplay.innerHTML = "You lose!";
    document.removeEventListener("keydown", moveUser);
  }
}

//the function that makes the ball change direction after it collides
function changeDirection() {
  if (xDirection == 2 && yDirection == 2) {
    yDirection = -2;
    return;
  }
  if (xDirection == 2 && yDirection == -2) {
    xDirection = -2;
    return;
  }
  if (xDirection == -2 && yDirection == -2) {
    yDirection = 2;
    return;
  }
  if (xDirection == -2 && yDirection == 2) {
    xDirection = 2;
    return;
  }
}
