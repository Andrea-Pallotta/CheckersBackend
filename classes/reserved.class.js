/* eslint-disable no-unused-vars */
class Reserved {
  constructor(io, socket, sockets, global, messages, queue) {
    this.io = io;
    this.socket = socket;
    this.sockets = sockets;
    this.global = global;
    this.messages = messages;
    this.queue = queue;
  }

  disconnect(username) {
    this.deleteSocket(username);
  }

  deleteSocket(username) {
    [...this.sockets].forEach((value) => {
      if (value[0] === username) {
        this.sockets.delete(value);
        this.deleteGlobal(username);
        return;
      }
    });
  }

  inQueue() {
    [...this.queue].forEach((value) => {
      if (value.socketId === this.socket.id) {
        return true;
      }
    });
    return false;
  }

  deleteGlobal(username) {
    [...this.global].forEach((value) => {
      if (value[0].username === username) {
        this.global.delete(value[0]);
      }
    });
  }

  addSocket(username) {
    this.sockets.set(username, this.socket.id);
  }

  addUser(user) {
    this.deleteGlobal(user.username);
    this.global.set(user, 1);
  }

  onError(room) {
    if (this.socket) {
      this.deleteGlobal(this.socket.id);
    }
    this.rooms.leave(room || 'public-chat-room');
    this.disconnect();
  }

  getUser() {
    return [...this.global.keys()].filter((key) => {
      return key.socketId === this.socket.id;
    });
  }
}

module.exports = Reserved;
