var socket = io();

function scrollToBottom() {
  // Selectors
  var messages = jQuery("#messages");
  var newMessage = messages.children("li:last-child");
  // Heights
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery("#messages").append(html);
  scrollToBottom();
  // console.log("new message", message);
  // var formattedTime = moment(message.createdAt).format("h:mm a");
  // let li = jQuery("<li></li>");
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);

  // jQuery("#messages").append(li);
});

socket.on("newLocationMessage", function(message) {
  console.log("Location Message", message);
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, {
    link: message.link,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery("#messages").append(html);
  scrollToBottom();
  // var li = jQuery("<li></li>");
  // li.html(
  //   `${message.from} ${formattedTime}: <a href=${
  //     message.link
  //   } target="_blank" >Location</a>`
  // );

  // jQuery("#messages").append(li);
});

jQuery("#message-form").on("submit", function(e) {
  var messageTextBox = jQuery("[name=message]");
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: messageTextBox.val()
    },
    function() {
      messageTextBox.val("");
    }
  );
});

const locationButton = jQuery("#send-location");

locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  locationButton.attr("disabled", "disabled").text("Sending location...");

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr("disabled").text("Send location");
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      locationButton.removeAttr("disabled").text("Send location");
      alert("Unable to fetch location.");
    }
  );
});
