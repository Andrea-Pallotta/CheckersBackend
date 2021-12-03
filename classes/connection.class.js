const Sender = require('./sender.class');
const Receiver = require('./receiver.class');
const Reserved = require('./reserved.class');
const User = require('./user.class');
const Constants = require('./constants.class');
const Helper = require('./helper.class');

class Connection {
  constructor(
    io,
    socket,
    sockets,
    global,
    messages,
    queue,
    gameCount,
    games,
    user
  ) {
    this.socket = socket;
    this.io = io;
    this.sockets = sockets;
    this.global = global;
    this.messages = messages;
    this.queue = queue;
    this.gameCount = gameCount;
    this.user = user;
    this.games = games;

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
      this.user,
      this.games
    );

    this.reserved.addSocket(this.user.username);
    this.sender.basic('connection', this.user.socketId);
  }

  setUser(username) {
    this.user = new User(username, this.socket.id);
  }
}

const createConnection = (io) => {
  io.on('connection', (socket) => {
    new Connection(
      io,
      socket,
      Constants.SOCKETS,
      Constants.GLOBAL,
      Constants.MESSAGES,
      Constants.QUEUE,
      Constants.GAMECOUNT,
      Constants.GAMES,
      Helper.updateAndGetUser(socket.id, socket.handshake.query.username)
    );
  });
};

module.exports = { createConnection };
