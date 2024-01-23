function getRandomInt(max) {
return Math.floor(Math.random() * max);
}

function redraw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.strokeRect(0, 0, cells_width * size, cells_height * size);

    ctx.fillStyle = "green";
    ctx.fillRect(head.x * size, head.y * size, size, size);
    for (const element of body) {
        ctx.fillRect(element.x * size, element.y * size, size, size);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(food.x*size, food.y*size, size, size);
}

function new_game(){
    head = {
    x: 1 + getRandomInt(cells_width - 2),
    y: 1 + getRandomInt(cells_height - 2)
    };

    x = head.x;
    y = head.y;
    while(x == head.x && y == head.y){
        x = 1 + getRandomInt(cells_width - 2);
        y = 1 + getRandomInt(cells_height - 2);
    }
    food = {
        x: x,
        y: y
    };
    direction = Direction.Right;
    body = [];
    timeOut = 1000;
    redraw();
    game_end = false;
}

function interrupt_game(){
    new_game();
    label.innerText = "Your score is " + (body.length + 1);
}

const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/snake_game/');

function sendMessage(message) {
        chatSocket.send(JSON.stringify({
            'message': message
        }));
    }

function saveScore(score){
chatSocket.send(JSON.stringify({
            'score': score
        }));
}

chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const message = data['message'];
        // Handle incoming message
    };

 chatSocket.onclose = function(e) {
        console.error('Socket closed unexpectedly');
    };


const new_game_button = document.getElementById("new_game_button");
new_game_button.addEventListener("click", interrupt_game);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const size = 20;
const cells_width = Math.floor(width / size);
const cells_height = Math.floor(height / size);
const label = document.getElementById('infoLabel');

let head;

let x;
let y;
let food;
let body;


const Direction = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
};

let timeOut;
let direction;

document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowUp") {
      direction = Direction.Up;
    }
    if (event.key == "ArrowDown") {
      direction = Direction.Down;
    }
    if (event.key == "ArrowLeft") {
      direction = Direction.Left;
    }
    if (event.key == "ArrowRight") {
      direction = Direction.Right;
    }
});

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


let tail_x = -1;
let tail_y = -1;
let last_x = -1;
let last_y = -1;
let game_end = false;
new_game();
const timer = ms => new Promise(res => setTimeout(res, ms))

async function main_loop(){
    if (game_end == false){
        console.log("move");
        console.log(direction);
        if (body.length == 0){
            tail_x = head.x;
            tail_y = head.y;
        }
        else{
            tail_x = body[0].x;
            tail_y = body[0].y;
        }
        last_x = head.x;
        last_y = head.y;
        if (direction == Direction.Up){
            head.y = head.y - 1;
        }

        if (direction == Direction.Down){
            head.y = head.y + 1;
        }
        if (direction == Direction.Left){
            head.x = head.x - 1;
        }
        if (direction == Direction.Right){
            head.x = head.x + 1;
        }

        if (head.x < 0 | head.x >= cells_width | head.y < 0 | head.y >= cells_height){
            label.innerText = "Game over, your score is " + (body.length + 1);
            saveScore(body.length + 1)
            console.log("Game over, outside game field");
            game_end = true;
            return;
        }
        if (body.length == 0){

        }
        else{
            body = body.slice(1);
            body.push({
                x:last_x,
                y:last_y
            });
        }
        if (head.x == food.x && head.y == food.y){
            console.log("Met food");
            let new_food_x = 1 + getRandomInt(cells_width - 2);
            let new_food_y = 1 + getRandomInt(cells_width - 2);
            let flag = true;
            while (flag){
                if (head.x == new_food_x && head.y == new_food_y){
                    new_food_x = 1 + getRandomInt(cells_width - 2);
                    new_food_y = 1 + getRandomInt(cells_width - 2);
                    flag = true;
                }
                else{
                    flag = false
                    for (const element of body) {
                        if (element.x == new_food_x && element.y == new_food_y){
                            flag = true;
                        }
                    }
                    if (flag){
                        new_food_x = 1 + getRandomInt(cells_width - 2);
                        new_food_y = 1 + getRandomInt(cells_width - 2);
                    }
                }
            }
            food = {
                x: new_food_x,
                y: new_food_y
            };
            body.unshift({
                x:tail_x,
                y:tail_y
            });
            //change size, check if not collisions, check to gen not inside of snake
            timeOut = timeOut * 0.95;
            label.innerText = "Your score is " + (body.length + 1);
        }
        for (const element of body) {
                if (element.x == head.x && element.y == head.y){
                console.log("Game over, collide with body");
                label.innerText = "Game over, your score is " + (body.length + 1);
                console.log(body);
                console.log(head);
                saveScore(body.length + 1)
                game_end = true;
                return;
            }
        }
        redraw();
        console.log(document.cookie);
        console.log(sessionStorage);
        console.log(sessionStorage.getItem("user"));
    }
}

var timerId = setInterval(main_loop, timeOut);
