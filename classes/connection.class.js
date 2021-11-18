const uuidv4 = require("uuid").v4;
const Sender = require("./sender.class");
const Receiver = require("./receiver.class");
const Rooms = require("./room.class");

const SOCKETS = new Map();
const USERS = new Map();
const MESSAGES = new Set();

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    this.joinPublicChat();
    this.sender = new Sender(this.io, this.socket);
    this.receiver = new Receiver(this.io, this.socket);
    this.rooms = new Rooms(this.io, this.socket);
    this.reserved = new Reserved(
      this.io,
      this.socket,
      SOCKETS,
      USERS,
      MESSAGES
    );
  }
}

const createConnection = (io) => {
  io.on("connection", (socket) => {
    const connection = new Connection(io, socket);
    connection.reserved.addSocket();
    connection.sender.basic("connection", socket.id);
  });
};

module.exports = createConnection;
