function getRandomInt(max) {
return Math.floor(Math.random() * max);
}



const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const size = 20;
const cells_width = Math.floor(width / size);
const cells_height = Math.floor(height / size);

let head = {
    x: 1 + getRandomInt(cells_width - 2),
    y: 1 + getRandomInt(cells_height - 2)
};

let x = head.x;
let y = head.y;
while(x == head.x && y == head.y){
    x = 1 + getRandomInt(cells_width - 2);
    y = 1 + getRandomInt(cells_height - 2);
}
let food = {
    x: x,
    y: y
};


const Direction = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
};

let timeOut = 1000;
let direction = Direction.Right;

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

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "blue";
ctx.strokeRect(0, 0, cells_width * size, cells_height * size);

ctx.fillStyle = "green";
ctx.fillRect(head.x * size, head.y * size, size, size);
ctx.fillStyle = "red";
ctx.fillRect(food.x*size, food.y*size, size, size);
body = []
let tail_x = -1;
let tail_y = -1;
let last_x = -1;
let last_y = -1;
async function main_loop(){
    while (true){
        const timer = ms => new Promise(res => setTimeout(res, ms))
        await timer(timeOut);
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
            console.log("Game over");
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
            food = {
                x: 1 + getRandomInt(cells_width - 2),
                y: 1 + getRandomInt(cells_height - 2)
            };
            body.unshift({
                x:tail_x,
                y:tail_y
            });
            //change size, check if not collisions, check to gen not inside of snake
            timeOut = timeOut * 0.95;
        }
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
}
main_loop();