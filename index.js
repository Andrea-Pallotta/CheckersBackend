const express = require("express");
const cors = require("cors");
const config = require("./configs/configs")();
const db = require("./utilities/mongoConnect");
const endpoints = require("./utilities/endpoints");

const app = express();
app.use(cors());
const server = app.listen(config.app.port, config.app.localhost, () => {
  console.log(`${config.app.localhost} running on port ${config.app.port}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const GLOBAL_CHANNEL = {
  name: "Global Chat",
  id: 1,
  sockets: [],
};

const QUEUE = {
  name: "Queue",
  id: 2,
  sockets: [],
};

io.on("connection", (socket) => {
  socket.emit("connection", null);

  socket.on("global-chat-join", (user) => {
    const ip = socket.request.connection.remoteAddress;
    if (checkIfAlreadyConnected(user, socket.id, ip)) {
      removeFromGlobal(GLOBAL_CHANNEL);
      socket.disconnect();
    } else {
      addToGlobal(user, socket.id, ip);
      io.emit("global-chat", GLOBAL_CHANNEL);
    }
  });

  socket.on("send-global-message", (message) => {
    io.emit("global-message", message);
  });

  socket.on("queue-join", (user) => {
    console.log("user");
  });

  socket.on("disconnect", () => {
    removeFromGlobal(socket.id);
    io.emit("global-chat", GLOBAL_CHANNEL);
    socket.removeAllListeners();
  });
});

app.get("/getChannels", (_, res) => {
  res.json({
    channels: GLOBAL_CHANNEL,
  });
});

const checkIfAlreadyConnected = (user, id, ip) => {
  return GLOBAL_CHANNEL.sockets.some((s) => {
    return s.id === id || s.ip === ip || s.user === user;
  });
};

const addToGlobal = (user, id, ip) => {
  GLOBAL_CHANNEL.sockets.push({ user, id, ip });
};

const removeFromGlobal = (id) => {
  GLOBAL_CHANNEL.sockets.splice(
    GLOBAL_CHANNEL.sockets.findIndex((element) => element.id === id)
  );
};
