const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

// Utility
const genMessage = require("./utils/message");
const genLocationMessage = require("./utils/locationMessage");
const isRealString = require("./utils/validation");
const Users = require("./utils/users");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("join", (params, cb) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return cb("Name and room name are required.");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    // socket.leave()
    // io.emit -> io.to('aleph').emit
    // socket.broadcast.emit -> socket.broadcast.to('aleph').emit

    socket.emit("newMessage", genMessage("Admin", "Welcome to the chat app"));
    socket.broadcast
      .to(params.room)
      .emit("newMessage", genMessage("Admin", `${params.name} has joined`));
    cb();
  });

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);

    io.emit("newMessage", genMessage(message.from, message.text));
    callback();
  });

  socket.on("createLocationMessage", position => {
    io.emit(
      "newLocationMessage",
      genLocationMessage("Admin", position.latitude, position.longitude)
    );
  });

  socket.on("disconnect", () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        genMessage("Admin", `${user.name} has left.`)
      );
    }
  });
});

app.get("/", (req, res) => {
  res.send("index.html");
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
