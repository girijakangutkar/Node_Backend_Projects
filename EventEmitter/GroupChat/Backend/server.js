const mongoose = require("mongoose");
const Redis = require("ioredis");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("Error while connecting to the DB");
  });
const redis = new Redis();

let chatSchema = new mongoose.Schema({
  from: String,
  message: String,
  timeStamp: Date,
});
let ChatModel = mongoose.model("Chat", chatSchema);

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

let userDetails = {};

io.on("connection", (client) => {
  console.log("client connected", client.id);
  client.on("registerUser", async (userName) => {
    userDetails[client.id] = userName;
    let chatHistoryJSON = await redis.lrange("AllChatsToUI", 0, -1);
    let chatHistoryArray = chatHistoryJSON.map(JSON.parse);
    io.emit("chat_History", chatHistoryArray);
  });

  client.on("sendMessage", async (message) => {
    client.emit("response", "Thanks for chatting");
    let chatObj = {
      from: userDetails[client.id],
      message: message,
      timeStamp: new Date(),
    };

    await redis.rpush("AllChatsToUI", JSON.stringify(chatObj));
    await redis.rpush("NewChatsToDB", JSON.stringify(chatObj));

    let chatHistoryJSON = await redis.lrange("AllChatsToUI", 0, -1);
    let chatHistoryArray = chatHistoryJSON.map(JSON.parse);
    io.emit("chat_History", chatHistoryArray);
  });
});

cron.schedule("*/30 * * * * *", async () => {
  console.log("Cron Started");
  let chatHistoryJSON = await redis.lrange("NewChatsToDB", 0, -1);
  if (chatHistoryJSON.length == 0) {
    console.log("No New Chats To Push Into DB");
  } else {
    let chatHistoryArray = chatHistoryJSON.map(JSON.parse);
    await ChatModel.insertMany(chatHistoryArray);
    await redis.del("NewChatsToDB");
    await redis.del("AllChatsToUI");

    let recentOlderChats = await ChatModel.find()
      .sort({ timeStamp: -1 })
      .limit(15);
    recentOlderChats = recentOlderChats.reverse();
    console.log(recentOlderChats);
    for (chat of recentOlderChats) {
      await redis.rpush("AllChatsToUI", JSON.stringify(chat));
    }
    console.log("Chats Pushed Into DB & Also Cleared From Redis");
  }
});
server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
