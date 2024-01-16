function getRandomInt(max) {
return Math.floor(Math.random() * max);
}



const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
const size = 20;
let head = {
    x: size + getRandomInt(width - 2 * size),
    y: size + getRandomInt(height - 2 * size)
};
let food = {
    x: size + getRandomInt(width - 2 * size),
    y: size + getRandomInt(height- 2 * size)
};


const Direction = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
};

const timeOut = 20000;
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

let s = 24;

async function main_loop(){
while (s < 56){
    s = s + 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.strokeRect(0, 0, width, height);

    ctx.fillStyle = "green";
    ctx.fillRect(head.x, head.y, size, size);
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, size, size);
    if (direction == Direction.Up){
        head.y = head.y - size;
    }
    if (direction == Direction.Down){
        head.y = head.y + size;
    }
    if (direction == Direction.Left){
        head.x = head.x - size;
    }
    if (direction == Direction.Right){
        head.x = head.x + size;
    }
    const timer = ms => new Promise(res => setTimeout(res, ms))
    await timer(1000);
    console.log("move");
    console.log(direction);
}
}
main_loop();