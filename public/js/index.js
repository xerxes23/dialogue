var socket = io();

socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  console.log("new message", message);
});

socket.emit(
  "createMessage",
  {
    from: "Kevin",
    text: "A million dollars"
  },
  function(data) {
    console.log("Got it", data);
  }
);
