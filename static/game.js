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

let timeOut = 2000;
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

async function main_loop(){
    while (true){
        const timer = ms => new Promise(res => setTimeout(res, ms))
        await timer(timeOut);
        console.log("move");
        console.log(direction);
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
        if (head.x < 0 | head.x >= cells_width | head.y < 0 | head.x >= cells_height){
            console.log("Game over");
            return;
        }
        if (head.x == food.x && head.y == food.y){
            food = {
                x: 1 + getRandomInt(cells_width - 2),
                y: 1 + getRandomInt(cells_height - 2)
            };
            //change size, check if not collisions, check to gen not inside of snake
            timeOut = timeout * 0.95;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "blue";
        ctx.strokeRect(0, 0, cells_width * size, cells_height * size);

        ctx.fillStyle = "green";
        ctx.fillRect(head.x * size, head.y * size, size, size);
        ctx.fillStyle = "red";
        ctx.fillRect(food.x*size, food.y*size, size, size);
    }
}
main_loop();