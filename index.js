const express = require("express");
const cors = require("cors");
const config = require("./configs/configs")();
const db = require("./utilities/mongo.connect");
const endpoints = require("./utilities/endpoint.utilities");
const { serialize } = require("./utilities/utilities");
const WaitQueue = require("wait-queue");
const wq = new WaitQueue();

const app = express();
app.use(cors());
const server = app.listen(config.app.port, config.app.localhost, () => {
  console.log(`${config.app.localhost} running on port ${config.app.port}`);
});

const io = require("socket.io")(server, {
  "reconnection limit": 1000,
  "max reconnection attempts": 20,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let gameRoomCount = 0;

let CONN_SOCKETS = new Map();

const GLOBAL_CHANNEL = {
  name: "Global Chat",
  id: 1,
  sockets: new Map(),
};

const QUEUE = {
  name: "Queue",
  id: 2,
  sockets: [],
};

const GAMES = [];

const NEW_GAME_BOARD = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

io.on("connection", (socket) => {
  // socket.emit("connection", null);

  // socket.on("global-chat-join", (socket) => {
  //   try {
  //     GLOBAL_CHANNEL.sockets.set(CONN_SOCKETS.get(), 1);
  //   } catch {
  //     GLOBAL_CHANNEL.sockets.delete(socket.id);
  //     socket.disconnect();
  //   }
  //   socket.join("global-room");
  //   io.sockets
  //     .in("global-room")
  //     .emit("global-chat", serialize(GLOBAL_CHANNEL.sockets));
  // });

  socket.on("send-global-message", (message) => {
    io.sockets.in("global-room").emit("global-message", message);
  });

  socket.on("queue-join", (username) => {
    socket.join("queue-room");
    if (wq.length === 0) {
      wq.push({ id: socket.id, username });
      console.log("queue was empty. Added to queue", wq);
    } else {
      console.log("player in queue found");
      wq.shift().then((player) => {
        socket.leave("global-room", "left global chat");
        playerSocket = io.sockets.sockets.get(player.id);
        playerSocket.leave("global-room", "left global chat");
        socket.join(`game-room-${gameRoomCount}`);
        playerSocket.join(`game-room-${gameRoomCount}`);

        const initialGameState = {
          board: NEW_GAME_BOARD,
          player1: {
            id: socket.id,
            username,
          },
          player2: {
            id: playerSocket.id,
            username: player.username,
          },
          turn: 1,
          roomId: gameRoomCount,
        };

        gameRoomCount += 1;

        io.to(socket.id).emit("game-found", initialGameState);
        io.to(playerSocket.id).emit("game-found", initialGameState);
      });
    }
  });

  socket.on("game-room-message", (message, roomId) => {
    socket.broadcast.to(`game-room-${roomId}`).emit("game-message", message);
  });

  socket.on("disconnect", () => {
    GLOBAL_CHANNEL.sockets.delete(socket.id);
    io.sockets
      .in("global-room")
      .emit("global-chat", serialize(GLOBAL_CHANNEL.sockets));
    socket.removeAllListeners();
  });
});
