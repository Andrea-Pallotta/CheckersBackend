const uuid = require("uuid").v5;
const express = require("express");
const color = require("colors");
const cors = require("cors");
const config = require("./configs/configs")();
const db = require("./utilities/mongoConnect");
const endpoints = require("./utilities/endpoints");
var where = require("lodash.where");

const app = express();
app.use(cors());
const server = app.listen(config.app.port, config.app.localhost, () => {
  console.log(`${config.app.localhost} running on port ${config.app.port}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["Get", "POST"],
  },
});

const GLOBAL_CHANNEL = {
  name: "Global Chat",
  id: 1,
  sockets: [],
};

io.on("connection", (socket) => {
  console.log(`new client connected`);
  socket.emit("connection", null);

  socket.on("global-chat-join", (user) => {
    console.log("global chat join");
    GLOBAL_CHANNEL.sockets.push({user, id: socket.id});
    console.log('on global chat join', GLOBAL_CHANNEL);
    io.emit("global-chat", GLOBAL_CHANNEL);
  });

  socket.on("send-global-message", (message) => {
    io.emit("global-message", message);
  });

  socket.on("disconnect", () => {
      GLOBAL_CHANNEL.sockets = GLOBAL_CHANNEL.sockets.filter((s) => s.id != socket.id);
      console.log('on disconnect', GLOBAL_CHANNEL.sockets);
      io.emit("global-chat", GLOBAL_CHANNEL);
      socket.removeAllListeners();
  });
});

app.get("/getChannels", (_, res) => {
  res.json({
    channels: GLOBAL_CHANNEL,
  });
});