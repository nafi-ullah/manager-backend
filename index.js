const express = require("express");
const authRouter = require("./routes/auth");
const mydatabase = require("mongoose");
const mealRouter = require("./routes/memberNbot");
const pushBazar = require("./routes/bazar");
const app = express();
//Socket stuff started-------
const http = require("http");
//const cors = require("cors");

//--------socket stuff finished

const PORT = 3000;
const DB =
  "mongodb+srv://managernafi:dmc54321@cluster0.7dvhcpm.mongodb.net/?retryWrites=true&w=majority";

app.use(express.json());
app.use(authRouter);
app.use(mealRouter);
app.use(pushBazar);

mydatabase
  .connect(DB)
  .then(() => {
    console.log("Daatabase Connected successfully");
  })
  .catch((e) => {
    console.log(e);
  });

const server = app.listen(PORT, () => {
  console.log(`Server is running  on ${PORT}`);
});

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data.messid}`);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected", socket.id);
  });

  socket.on("message", (data) => {
    //console.log(data);
    //socket.broadcast.emit("message-recieve", data);
    socket.broadcast.emit("message-recieve", data);
  });
});
