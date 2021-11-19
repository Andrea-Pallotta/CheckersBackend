const Reserved = require("./reserved.class");

class Sender extends Reserved {
  constructor(io, socket, sockets, global, messages) {
    super(io, socket, sockets, global, messages);
  }

  basic(name, object) {
    this.socket.emit(`${name}`, object);
  }

  allNoSender(name, object) {
    this.socket.broadcast(`${name}`, object);
  }

  roomsNoSender(name, object, ...rooms) {
    this.socket.to(rooms).emit(`${name}`, object);
  }

  all(name, object) {
    this.io.emit(`${name}`, object);
  }

  roomsAll(name, object, ...rooms) {
    this.io.in(rooms).emit(`${name}`, object);
  }

  private(id, name, object) {
    this.io.to(id).emit(`${name}`, object);
  }

  sendMessage(room, emit, message) {
    this.io.sockets.in(`${room}`).emit(`${emit}`, message);
  }
}

module.exports = Sender;
