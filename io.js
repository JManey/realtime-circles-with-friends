// io.js

var io = require("socket.io")();

var players = {};

// Listen for new connections from clients (socket)
io.on("connection", function(socket) {
  // console.log("Client connected to socket.io!");
  socket.on("register-player", function(name) {
    players[socket.id] = name;
    io.emit("update-player-list", Object.values(players));
  });
  socket.on("disconnect", function() {
    delete players[socket.id];
    io.emit("update-player-list", Object.values(players));
  });
  socket.on("getMessage", function(data) {
    io.emit("printMessage", data);
  });

  socket.on("add-circle", function(data) {
    io.emit("add-circle", data);
  });
  socket.on("clearCircles", function() {
    io.emit("clearCircles");
  });
});

// io represents socket.io on the server - let's export it
module.exports = io;
