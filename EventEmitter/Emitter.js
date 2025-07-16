const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("userLoggedIn", (username) => {
  console.log(`User ${username} logged in`);
});

emitter.on("userLoggedIn", (username) => {
  console.log(`Notification sent to ${username}`);
});

emitter.on("messageReceived", (username, message) => {
  console.log(`New message for ${username}: ${message}`);
});

emitter.on("dataSynced", (username) => {
  console.log(`Data sync complete for ${username}`);
});

const username = "John";

setTimeout(() => {
  emitter.emit("userLoggedIn", username);
}, 1000);

setTimeout(() => {
  emitter.emit("messageReceived", username, "Hello John");
}, 2000);

setTimeout(() => {
  console.log(`Syncing user data`);
  setTimeout(() => {
    emitter.emit("dataSynced", username);
  }, 1000);
}, 3000);
