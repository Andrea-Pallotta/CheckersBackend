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
    this.socket.disconnect();
    this.deleteSocket();
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

  deleteGlobal() {
    [...this.global].forEach((value) => {
      if (value[0].id === this.socket.id) {
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
    this.deleteGlobalByUsername(user.username);
    this.global.set(user, 1);
  }

  onError(username, room) {
    if (username) {
      this.deleteGlobalByUsername(username);
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
