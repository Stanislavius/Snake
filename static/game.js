function redraw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.strokeRect(0, 0, cells_width * size, cells_height * size);

    ctx.fillStyle = "green";
    ctx.fillRect(head.x * size, head.y * size, size, size);
    for (const element of body) {
        var el = JSON.parse(element);
        ctx.fillRect(el.x * size, el.y * size, size, size);
    }
    console.log(body.length)
    ctx.fillStyle = "red";
    ctx.fillRect(food.x*size, food.y*size, size, size);
}


function interrupt_game(){
    chatSocket.send(JSON.stringify({
            'new_game': "start"
        }));
}

const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/snake_game/');

function sendMessage(message) {
        chatSocket.send(JSON.stringify({
            'message': message
        }));
    }


function sendDirection(direction){
chatSocket.send(JSON.stringify({
            'direction': direction
        }));
}

function start_game(x, y){
chatSocket.send(JSON.stringify({
            'start_game': "start", "x": x, "y": y
        }));
}



chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        if ("head" in data) {
            head =JSON.parse(data.head);
        }
        if ("body" in data) {
            body = data.body;
        }
        if ("food" in data){
            food = JSON.parse(data.food);
        }
        if ("label" in data) {
            label.innerText = data.label;
        }
         if ("status" in data) {
            label.innerText = label.innerText + " "+ status;
        }
        redraw();
    };

 chatSocket.onclose = function(e) {
        console.error('Socket closed unexpectedly');
    };

chatSocket.onopen = function(e){
    start_game(cells_width, cells_height)
};

function compete(){
    chatSocket.send(JSON.stringify({
            'compete': "compete"
        }));
    if (seek == 0){
    seek = 1;
    label.innerText = "Seeking game";
    }
    else{
    label.innerText = "Game is not started yet.";
    seek = 0;
    }

}


const new_game_button = document.getElementById("new_game_button");
new_game_button.addEventListener("click", interrupt_game);

const compete_button = document.getElementById("compete_button");
compete_button.addEventListener("click", compete);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const size = 20;
const cells_width = Math.floor(width / size);
const cells_height = Math.floor(height / size);
const label = document.getElementById('infoLabel');
let seek;
seek = 0;
let head;
let body;
let food;

document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowUp") {
        sendDirection("Up");
    }
    if (event.key == "ArrowDown") {
      sendDirection("Down");
    }
    if (event.key == "ArrowLeft") {
      sendDirection("Left");
    }
    if (event.key == "ArrowRight") {
      sendDirection("Right");
    }
});




