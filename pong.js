var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 1080;
canvas.height = 1920;

var ballRadius = 30;

var x = canvas.width / 2;
var y = canvas.height - 30;

var ballSpeed = 6;
var speedIncrement = 1.2;
var dx = ballSpeed;
var dy = -ballSpeed;

var paddleHeight = 20;
var paddleWidth = 200;
var paddleX = (canvas.width - paddleWidth) / 2;

var paddleSpeed = 12;
var score = 0;
var scoreX = 20;
var scoreY = 60;

var rightPressed = false;
var leftPressed = false;


var brickWidth = 160;
var brickHeight = 50;
var brickPadding = 20;
var brickOffsetTop = 100;
var brickRowCount = 8;
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
document.addEventListener("mousemove", mouseMoveHandler, false);

function drawScore() {
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "#000000";
    ctx.font
    ctx.fillText(`Score: ${score}`, scoreX, scoreY);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
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
            ctx.fillStyle = "#0095DD";
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
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
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

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    score = paddleX;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function resizeCanvas() {
    canvas.width = 1080;
    canvas.height = 1920;
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // resizeCanvas();

    drawBall();
    drawPaddle();
    drawScore();
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
            dx = dx * speedIncrement;
            dy = dy * speedIncrement;
        }
        else {
            dy = -dy;
            // alert("GAME OVER");
            // document.location.reload();
            // clearInterval(interval); // Needed for Chrome to end game
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
}


var interval = setInterval(draw, 10);