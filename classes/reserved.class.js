class Reserved {
  constructor(io, socket, sockets, global, messages) {
    this.io = io;
    this.socket = socket;
    this.sockets = sockets;
    this.global = global;
    this.messages = messages;
  }

  disconnect = () => {
    this.socket.disconnect();
    this.deleteSocket();
  };

  deleteSocket = () => {
    this.sockets.forEach((key, _) => {
      if (key === this.socket.id) {
        this.sockets.delete(key);
        this.deleteGlobal();
        return;
      }
    });
  };

  deleteGlobal = () => {
    this.global.forEach((key, _) => {
      if (key.id === this.socket.id) {
        this.global.delete(key);
      }
    });
  };

  addSocket = () => {
    this.sockets.set(this.socket.id, 1);
  };

  addUser = (username) => {
    this.global.set(new User(username, this.socket.id));
  };

  removeFromGlobal = (username) => {
    this.global.forEach((user, _) => {
      if (user.username === username && user.id === this.socket.id) {
        this.global.delete(user);
      }
    });
  };

  onError = (username, room) => {
    if (username) {
      this.removeFromGlobal(username);
    }
    this.rooms.leave(room || "public-chat-room");
    this.disconnect();
  };

  getUser = () => {
    return [...this.global.keys()].filter((key) => {
      return key.id === this.socket.id;
    });
  };
}

module.exports = Reserved;
