const Sender = require('./sender.class');
const Receiver = require('./receiver.class');
const Reserved = require('./reserved.class');
const {
  SOCKETS,
  GLOBAL,
  MESSAGES,
  QUEUE,
  GAMECOUNT,
  GAMES,
} = require('./constants.class');
const Helper = require('./helper.class');

/**
 * Class that instantiates the Socket.io connection.
 *
 * @class Connection
 */
class Connection {
  /**
   * Creates an instance of Connection.
   * @param {*} io
   * @param {*} socket
   * @param {*} sockets
   * @param {*} global
   * @param {*} messages
   * @param {*} queue
   * @param {*} gameCount
   * @param {*} games
   * @param {*} user
   * @memberof Connection
   */
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
}

/**
 * Create a new Connection instance when a client connects.
 *
 * @param {*} io
 */
const createConnection = (io) => {
  try {
    io.on('connection', (socket) => {
      new Connection(
        io,
        socket,
        SOCKETS,
        GLOBAL,
        MESSAGES,
        QUEUE,
        GAMECOUNT,
        GAMES,
        Helper.updateAndGetUser(socket.id, socket.handshake.query.username)
      );
    });
  } catch (err) {
    throw Error('failed to create socket connection');
  }
};

module.exports = { createConnection };
