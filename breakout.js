var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 1080;
canvas.height = 1920;

var ballRadius = 30;

var x = canvas.width / 2;
var y = canvas.height - 30;

var ballStartSpeed = 6;
var speedIncrement = 1;
var dx = ballStartSpeed;
var dy = -ballStartSpeed;

var paddleHeight = 30;
var paddleWidth = 250;
var paddleX = (canvas.width - paddleWidth) / 2;

var paddleSpeed = 16;
var score = 0;
var scoreX = 20;
var scoreY = 60;
var lives = 3;

var rightPressed = false;
var leftPressed = false;


var brickWidth = 160;
var brickHeight = 50;
var brickPadding = 13;
var brickOffsetTop = 100;
var brickRowCount = 12;
var brickColumnCount = 6;
var brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding)) + brickPadding) / 2;



var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchmove", handleTouchmove, false);


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
     navigator.serviceWorker.register('sw.js').then( () => {
      console.log('Service Worker Registered')
     })
   })
  }



function drawScore() {
    ctx.font = "bold 64px Arial";
    ctx.fillStyle = "#11abed";
    ctx.font
    ctx.fillText(`Score: ${score}`, scoreX, scoreY);
}

function drawLives() {
    ctx.font = "bold 64px Arial";
    ctx.fillStyle = "#11abed";
    ctx.fillText("Lives: " + lives, canvas.width - 300, scoreY);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#11abed";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#11abed";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 0) {
                continue;
            }

            var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#11abed";
            ctx.fill();
            ctx.closePath();
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];

            if (brick.status == 0) {
                continue;
            }
            if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                dy = -dy;
                brick.status = 0;
                score++;

                if (score == brickColumnCount * brickRowCount) {
                    alert("You Win!");
                    document.location.reload();
                }
            }
        }
    }
}

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}


function handleTouchmove(e) {
    e.preventDefault(); // we don't want to scroll
    var touch = e.touches[0];
    var relativeX = touch.clientX / window.innerWidth * canvas.width;

    paddleX = relativeX - paddleWidth / 2;

    if (paddleX < 0) {
        paddleX = 0;
    }
    else if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
    }
}




function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    drawBricks();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;

            if (dy < 0) {
                dy -= speedIncrement;
            } else {
                dy += speedIncrement;
            }

            if (dx < 0) {
                dx -= speedIncrement;
            } else {
                dx += speedIncrement;
            }
        }
        else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = ballStartSpeed;
                dy = -ballStartSpeed;
                paddleX = (canvas.width - paddleWidth) / 2;

            }
        }
    }

    if (rightPressed) {
        paddleX += paddleSpeed;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= paddleSpeed;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }



    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();

