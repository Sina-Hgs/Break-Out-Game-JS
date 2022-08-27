//getting the container from our html file
const container = document.querySelector(".container");
const header = document.querySelector("#header");
const blockWidth = 120;
const blockHeight = 25;
const scoreDisplay = document.querySelector("#score");
let score = 0;
// getting the buttons
const buttons = document.querySelector("#buttons-container");
const easyLevel = document.querySelector("#easy-btn");
const mediumLevel = document.querySelector("#medium-btn");
const godModeLevel = document.querySelector("#godMode-btn");

//setting the number of rows/columns for each difficulty
const easy = 5;
const medium = 7;
const godMode = 15;

// the gap between the blocks in one row:
const gapRow = 10;
//the gap between the blocks in one column
const gapColumn = 20;

//defining these variables as global variables so I can use the later in functions.
let containerWidth;
let containerHeight;

let blockList = [];

let user;
let userStart;
let currentPosition;

let ballStart;
let ballCurrentPosition;

let xDirection = 2;
let yDirection = 2;

let timer;

//creating a class which gives the block coordinates.
class Block {
  constructor(x, y) {
    this.bottomLeft = [x, y];
    this.bottomRight = [x + blockWidth, y];
    this.topLeft = [x, y + blockHeight];
    this.topRight = [x + blockWidth, y + blockHeight];
  }
}

//a function that makes a number of blocks
//based on the difficulty of the game.
function listBlocks(diffculty) {
  header.style.display = "none";
  scoreDisplay.innerHTML = `Your score: ${score}`;
  //blocks in one row will have a gap of 10px between eachother
  //so the next block needs to shift in the x coordinates
  //by the width of the previous block + gap
  let xShift = blockWidth + gapRow;
  //same as above but this time blocks need
  //to shift in the y coordinates by
  //the height of the previous block + gapColumn
  let yShift = blockHeight + gapColumn;

  //changing the container to fit the number of
  //bloccontainerHeightks according to each game level.
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

  //user's start coordinates.
  userStart = [containerWidth / 2 - blockWidth / 2, 10];
  //the variable that's tracked for user's location.
  currentPosition = userStart;

  ballStart = [containerWidth / 2 - 20, 40];

  ballCurrentPosition = ballStart;

  addBlocks();
  addUser();

  // moving the user with arrow keys
  document.addEventListener("keydown", moveUserKey);

  // moving user with touch
  // The eventListener is added to the container instead of the user
  // so the player can swip anywhere inside the playground and move the user block
  // without having to keep his finger on the user block
  container.addEventListener(
    "touchmove",
    (touch) => {
      touch.preventDefault();
      // getting the margin around container from the css file
      let containerMargin = window
        .getComputedStyle(container)
        .getPropertyValue("margin")
        .split("px");
      // making sure the user doesn't get beyond container's left and right walls
      if (
        touch.touches[0].clientX - 0.5 * blockWidth + 2 * gapColumn >
          containerMargin[0] &&
        touch.touches[0].clientX <
          containerWidth + 0.5 * blockWidth - 2 * gapColumn - 25
      ) {
        currentPosition[0] = touch.touches[0].clientX - blockWidth;
        user.style.left = `${currentPosition[0]}px`;
      }

      // making sure the user doesn't get more than 80 pixels high or
      // below the container's floor
      if (
        touch.touches[0].clientY > containerHeight - 80 &&
        touch.touches[0].clientY < containerHeight + 20
      ) {
        currentPosition[1] =
          containerHeight - touch.touches[0].clientY + blockHeight;
        user.style.bottom = `${currentPosition[1]}px`;
      }
    },
    { passive: false }
  );

  // adding the ball to the html file
  const ball = document.createElement("div");
  ball.classList.add("ball");
  container.appendChild(ball);

  //add Ball
  function addBall() {
    ball.style.left = ballCurrentPosition[0];
    ball.style.bottom = ballCurrentPosition[1];
  }

  //making the ball move
  function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    addBall();
    collisions();
  }

  timer = setInterval(moveBall, 24);
}

// Event Listeners for the buttons
easyLevel.addEventListener("click", () => {
  listBlocks(easy);
  buttons.style.display = "none";
});
mediumLevel.addEventListener("click", () => {
  listBlocks(medium);
  buttons.style.display = "none";
});
godModeLevel.addEventListener("click", () => {
  listBlocks(godMode);
  container.style.transform = "scale(0.6)";
  buttons.style.display = "none";
});

// making a function that adds the blocks.
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

//adding the user
function addUser() {
  user = document.createElement("div");
  user.classList.add("user");
  user.style.width = blockWidth;
  user.style.height = blockHeight;
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
  container.appendChild(user);
}

//moving the user with arrow keys
function moveUserKey(event) {
  event.preventDefault();
  switch (event.key) {
    case "ArrowLeft":
      if (currentPosition[0] - gapColumn > 0) {
        currentPosition[0] -= 30;
        user.style.left = currentPosition[0] + "px";
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] + blockWidth + gapColumn < containerWidth) {
        currentPosition[0] += 30;
        user.style.left = currentPosition[0] + "px";
      }
      break;
    case "ArrowUp":
      if (currentPosition[1] < 80) {
        currentPosition[1] += 30;
        user.style.bottom = currentPosition[1] + "px";
      }
      break;
    case "ArrowDown":
      if (currentPosition[1] > 20) {
        currentPosition[1] -= 30;
        user.style.bottom = currentPosition[1] + "px";
      }
      break;
  }
}

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
      score++;
      scoreDisplay.innerHTML = `Your score: ${score}`;
      if (blockList.length == 0) {
        scoreDisplay.innerHTML = "You Win!";
        clearInterval(timer);
        document.removeEventListener("keydown", moveUserKey);
      }
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
    ballCurrentPosition[0] >= currentPosition[0] &&
    ballCurrentPosition[0] <= currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] >= currentPosition[1] &&
    ballCurrentPosition[1] <= currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  //checking for game over
  if (ballCurrentPosition[1] == 0) {
    clearInterval(timer);
    scoreDisplay.innerHTML = "You lose!";
    document.removeEventListener("keydown", moveUserKey);
    document.createElement("div");
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
