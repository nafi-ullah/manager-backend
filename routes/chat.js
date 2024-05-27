const express = require("express");
const chatapp = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
chatapp.use(cors());

const chatserver = http.createServer(chatapp);

const io = new Server(chatserver, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log(`User with ID: ${socket.id} joined room: ${data}`);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
});

module.exports = { io, chatserver, chatapp };




