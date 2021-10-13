const uuid = require("uuid").v5;
const express = require("express");
const color = require("colors");
const cors = require("cors");
const config = require("./configs/configs")();
const db = require("./utilities/mongoConnect");
const endpoints = require("./utilities/endpoints");
const {
  addUser,
  removeUser,
  getUsersInRoom,
} = require("./utilities/chatHandler");
const { getMessagesInRoom } = require("./utilities/messageStorage");

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

io.on("connection", (socket) => {
  console.log(`new client connected`);
  const { roomId, name } = socket.handshake.query;
  console.log(socket.handshake.query)
  socket.join(roomId);

  const user = addUser(socket.id, roomId, name);
  io.in(roomId).emit(endpoints.USER_JOIN_CHAT_EVENT, user);

  socket.on(endpoints.NEW_GLOBAL_CHAT_MESSAGE, (data) => {
    io.in(roomId).emit(endpoints.NEW_GLOBAL_CHAT_MESSAGE, data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.in(roomId).emit(endpoints.USER_LEAVE_CHAT_EVENT, user);
    socket.leave(roomId);
  });
});

app.get("/rooms/:roomId/users", (req, res) => {
  const users = getUsersInRoom(req.params.roomId);
  return res.json({ users });
});

app.get("/rooms/:roomId/messages", (req, res) => {
  const messages = getMessagesInRoom(req.params.roomId);
  return res.json({ messages });
});
