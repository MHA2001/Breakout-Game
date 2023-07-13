const grid = document.querySelector("main");
const  scoreDisplay = document.querySelector('#score')

const blockWidth = 100;
const blockHight = 20;
const borderWidth = 560;
const borderHight = 300;
const ballDiameter = 15;

let xDirection = 2
let yDirection = 2
let score = 0;

const userStart=[230,10]
let currentPosition = userStart;

const ballStart = [270, 40]
let ballCurrentPosition = ballStart;

let timerId

//Object block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHight];
  }
}

//add user
const user = document.createElement('div')
user.classList.add("user")
grid.appendChild(user)  

// add ball
const ball = document.createElement("div")
ball.classList.add("ball")
grid.appendChild(ball)

//all my blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),

  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),

  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

//draw all my blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.append(block);
  }
}

// draw the user 
function drawUser(){
    user.style.left = currentPosition[0] +'px';
    user.style.bottom = currentPosition[1] + 'px';
}

//draw the ball
function drawBall(){
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}

//move user
function moveUser (event){
    switch(event.key){
        case'ArrowLeft':
            if (currentPosition[0]>0){
                currentPosition[0] -=10;
                drawUser();
            }
        break;

        case'ArrowRight':
        if (currentPosition[0]<borderWidth - blockWidth){
            currentPosition[0] +=10;
            drawUser();
        }
        break;
    }
}

// move the ball 
function moveBall(){
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkCollision()
}

function changeDirection(){

    if (xDirection === 2 && yDirection === 2){
        yDirection =-2;
    }
    else if (xDirection == 2 && yDirection == -2){
        xDirection = -2;
    }
    else if(xDirection == -2 && yDirection == -2) {
        yDirection = 2
    }
    else if (xDirection == -2 && yDirection == 2){
        xDirection = 2;
        
    }
    return;
}


//check for collisions
function checkCollision(){
    // check for block collision
    for (let i = 0; i<blocks.length; i++){
        if ( 
            (ballCurrentPosition[0]>blocks[i].bottomLeft[0]&& ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter)) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[1].topLeft[1]
        ){
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i,1);
            changeDirection();
            score++
            scoreDisplay.textContent = score;

                //check for win
                if (blocks.length === 0){
                    scoreDisplay.textContent = "You Win"
                    clearInterval(timerId)
                    document.removeEventListener('keydown' , moveUser)
                }
        }
    }

    // check for user collisions
    if (
        (ballCurrentPosition[0]> currentPosition[0] && ballCurrentPosition[0]< currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1]> currentPosition[1] && ballCurrentPosition[1]< currentPosition [1] + blockHight-10)
    ){
        changeDirection();
    }

    // check for wall collisions
    if (ballCurrentPosition[0]>= (borderWidth-ballDiameter) ||
     ballCurrentPosition[1] >= (borderHight - ballDiameter) ||
     ballCurrentPosition[0]<= 0  ){
        changeDirection()
    }




    // check for game over 
    if (ballCurrentPosition[1]<=0 ){
        clearInterval(timerId)
        scoreDisplay.textContent = 'You lose'
        document.removeEventListener('keydown', moveUser)
    }

}

addBlocks();
drawUser();
drawBall();

document.addEventListener('keydown', moveUser)

timerId = setInterval(moveBall,15)