const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // или укажи конкретный порт фронтенда, например http://localhost:3000
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("new-task", (task) => {
    console.log("New task:", task);
    io.emit("new-task", task); // пересылаем всем
  });

  socket.on("new-call", (call) => {
    console.log("New call:", call);
    io.emit("new-call", call); // пересылаем всем
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}`);
});
