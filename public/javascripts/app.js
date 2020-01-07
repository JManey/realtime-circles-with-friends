var socket = io();

// listen to the server for the `add-circle` event
socket.on("add-circle", function(data) {
  addCircle(data);
  // console.log(data);
});
socket.on("clearCircles", function() {
  clearCircles();
});
socket.on("update-player-list", function(data) {
  var playerList = "<li>" + data.join("</li><li>") + "</li>";
  players.innerHTML = playerList;
});
socket.on("printMessage", function(data) {
  chat(data);
});

var circles = document.getElementById("circles");
var players = document.getElementById("players");
let clear = document.getElementById("clear");
var initials = "";
let messageInput = document.getElementById("message");
let chatEl = document.getElementById("chat");
let messageBtn = document.getElementById("message-btn");
let message;

window.onload = function() {
  let color = getRandomRGBA();
  document.body.style.backgroundColor = color;
};

circles.addEventListener("click", function(evt) {
  socket.emit("add-circle", {
    initials: initials,
    x: evt.clientX,
    y: evt.clientY,
    dia: randomBetween(20, 130),
    rgba: getRandomRGBA()
  });
});

clear.addEventListener("click", function() {
  socket.emit("clearCircles");
});

messageBtn.addEventListener("click", function() {
  message = getMessage();
  // console.log("message clickhandler", message);
  socket.emit("getMessage", {
    initials: initials,
    message: message
  });
});

function chat({ message, initials }) {
  let ele = document.createElement("li");
  ele.textContent = `${initials}: ${message}`;
  console.log(message);
  chatEl.appendChild(ele);
}

function clearCircles() {
  circles.innerHTML = "";
}

function getMessage() {
  let messageText = messageInput.value;
  messageInput.value = "";
  return messageText;

  // console.log("getMessage function", message);
}

do {
  initials = getInitials();
} while (initials.length < 2 || initials.length > 10);
socket.emit("register-player", initials);

function getInitials() {
  var input = prompt("Please enter your Name");
  return input ? input.toUpperCase() : "";
}

function addCircle({ x, y, dia, rgba, initials }) {
  var el = document.createElement("div");
  el.style.left = x - Math.floor(dia / 2 + 0.5) + "px";
  el.style.top = y - Math.floor(dia / 2 + 0.5) + "px";
  el.style.width = el.style.height = dia + "px";
  el.style.backgroundColor = rgba;
  el.style.fontSize = Math.floor(dia / 3) + "px";
  el.style.color = "white";
  el.style.textAlign = "center";
  el.style.lineHeight = dia + "px";
  el.innerHTML = initials;
  circles.appendChild(el);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomRGBA() {
  return [
    "rgba(",
    randomBetween(0, 255),
    ",",
    randomBetween(0, 255),
    ",",
    randomBetween(0, 255),
    ",",
    randomBetween(2, 10) / 10,
    ")"
  ].join("");
}
