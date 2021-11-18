const Sender = require("./sender.class");
const Receiver = require("./receiver.class");
const Reserved = require("./reserved.class");
const Rooms = require("./room.class");
const User = require("./user.class");
const Constants = require("./constants.class");

class Connection {
  constructor(io, socket, sockets, global, messages, queue, gameCount) {
    this.rooms = new Rooms(this.io, this.socket);
    this.socket = socket;
    this.io = io;
    this.sockets = sockets;
    this.global = global;
    this.messages = messages;
    this.queue = queue;
    this.gameCount = gameCount;

    this.reserved = new Reserved(
      this.io,
      this.socket,
      this.sockets,
      this.global,
      this.messages
    );
    this.sender = new Sender(
      this.io,
      this.socket,
      this.sockets,
      this.global,
      this.messages
    );
    this.user = new User(this.reserved.getUser().username, this.socket.id);
    this.receiver = new Receiver(
      this.io,
      this.socket,
      this.sockets,
      this.global,
      this.messages,
      this.queue,
      this.user
    );
  }
}

const createConnection = (io) => {
  io.on("connection", (socket) => {
    const connection = new Connection(
      io,
      socket,
      Constants.SOCKETS,
      Constants.GLOBAL,
      Constants.MESSAGES,
      Constants.QUEUE,
      Constants.GAMECOUNT
    );
    connection.reserved.addSocket();
    connection.sender.basic("connection", socket.id);
  });
};

module.exports = { createConnection };
