const Reserved = require('./reserved.class');

/**
 * Class containing emit functions.
 * Sender is the socket that emitted to the server.
 *
 * @class Sender
 * @extends {Reserved}
 */
class Sender extends Reserved {
  /**
   * Create a new instance of Sender extending Reserved.
   * @param {*} io
   * @param {*} socket
   * @param {*} sockets
   * @param {*} global
   * @param {*} messages
   * @param {*} queue
   */
  constructor(io, socket, sockets, global, messages, queue) {
    super(io, socket, sockets, global, messages, queue);
  }

  /**
   * Emit to sender.
   *
   * @param {string} name
   * @param {JSON} object
   * @memberof Sender
   */
  basic(name, object) {
    this.socket.emit(`${name}`, object);
  }

  /**
   * Broadcast to all sockets except sender.
   * @param {string} name
   * @param {JSON} object
   */
  allNoSender(name, object) {
    this.socket.broadcast(`${name}`, object);
  }

  /**
   * Emit to all sockets in a room except sender.
   *
   * @param {string} name
   * @param {JSON} object
   * @param {[string]} rooms
   * @memberof Sender
   */
  roomsNoSender(name, object, ...rooms) {
    this.socket.to(rooms).emit(`${name}`, object);
  }

  /**
   * Emit to all sockets.
   *
   * @param {string} name
   * @param {JSON} object
   * @memberof Sender
   */
  all(name, object) {
    this.io.emit(`${name}`, object);
  }

  /**
   * Emit to all sockets in one or more rooms.
   *
   * @param {string} name
   * @param {JSON} object
   * @param {[string]} rooms
   * @memberof Sender
   */
  roomsAll(name, object, ...rooms) {
    this.io.in(rooms).emit(`${name}`, object);
  }

  /**
   * Only emit to a specific socket id.
   *
   * @param {string} id
   * @param {string} name
   * @param {JSON} object
   * @memberof Sender
   */
  private(id, name, object) {
    this.io.to(id).emit(`${name}`, object);
  }

  /**
   * Send a Message to all sockets in a room.
   *
   * @param {string} room
   * @param {string} emit
   * @param {Message} message
   * @memberof Sender
   */
  sendMessage(room, emit, message) {
    this.io.sockets.in(`${room}`).emit(`${emit}`, message);
  }
}

module.exports = Sender;
