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

  disconnect() {
    this.deleteSocket();
    this.deleteGlobal();
  }

  deleteSocket() {
    [...this.sockets].forEach((value) => {
      if (value === this.socket.id) {
        this.sockets.delete(value);
        this.deleteGlobal();
        return;
      }
    });
  }

  inQueue() {
    [...this.queue].forEach((value) => {
      if (value.id === this.socket.id) {
        return true;
      }
    });
    return false;
  }

  deleteGlobal(id) {
    [...this.global].forEach((value) => {
      if (value[0].id === id ? id : this.socket.id) {
        this.global.delete(value[0]);
      }
    });
  }

  deleteGlobalByUsername(username) {
    [...this.global].forEach((value) => {
      if (value[0].username === username) {
        this.global.delete(value[0]);
      }
    });
  }

  addSocket() {
    this.sockets.set(this.socket.id, 1);
  }

  addUser(user) {
    this.deleteGlobal(user.id);
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
      return key.id === this.socket.id;
    });
  }
}

module.exports = Reserved;
