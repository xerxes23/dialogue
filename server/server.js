const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

// Utility
const genMessage = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.emit("newMessage", genMessage("Admin", "Welcome to the chat app"));

  socket.broadcast.emit("newMessage", genMessage("Admin", "new user joined"));

  socket.on("createMessage", message => {
    console.log("createMessage", message);

    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

    // socket.broadcast.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("index.html");
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
