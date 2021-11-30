const Sender = require('./sender.class');
const Receiver = require('./receiver.class');
const Reserved = require('./reserved.class');
const User = require('./user.class');
const Constants = require('./constants.class');

class Connection {
  constructor(io, socket, sockets, global, messages, queue, gameCount, user) {
    this.socket = socket;
    this.io = io;
    this.sockets = sockets;
    this.global = global;
    this.messages = messages;
    this.queue = queue;
    this.gameCount = gameCount;
    this.user = user;

    this.reserved = new Reserved(
      this.io,
      this.socket,
      this.sockets,
      this.global,
      this.messages,
      this.queue
    );
    this.sender = new Sender(
      this.io,
      this.socket,
      this.sockets,
      this.global,
      this.messages,
      this.queue
    );
    this.receiver = new Receiver(
      this.io,
      this.socket,
      this.sockets,
      this.global,
      this.messages,
      this.queue,
      this.gameCount,
      this.user
    );
  }

  setUser(username) {
    this.user = new User(username, this.socket.id);
  }
}

const createConnection = (io) => {
  io.on('connection', (socket) => {
    const connection = new Connection(
      io,
      socket,
      Constants.SOCKETS,
      Constants.GLOBAL,
      Constants.MESSAGES,
      Constants.QUEUE,
      Constants.GAMECOUNT,
      new User(socket.handshake.query.username, socket.id)
    );
    connection.reserved.addSocket(socket.handshake.query.username);
    connection.sender.basic('connection', socket.id);
  });
};

module.exports = { createConnection };
