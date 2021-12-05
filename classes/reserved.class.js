/**
 * Class containing Server Constants modifications.
 *
 * @class Reserved
 */
class Reserved {
  /**
   * Creates an instance of Reserved.
   * @param {*} io
   * @param {*} socket
   * @param {*} sockets
   * @param {*} global
   * @param {*} messages
   * @param {*} queue
   * @memberof Reserved
   */
  constructor(io, socket, sockets, global, messages, queue) {
    this.io = io;
    this.socket = socket;
    this.sockets = sockets;
    this.global = global;
    this.messages = messages;
    this.queue = queue;
  }

  /**
   * Delete socket by username
   *
   * @param {string} username
   * @memberof Reserved
   */
  disconnect(username) {
    this.deleteSocket(username);
  }

  /**
   * Delete socket by username
   *
   * @param {string} username
   * @memberof Reserved
   */
  deleteSocket(username) {
    [...this.sockets].forEach((value) => {
      if (value[0].id === username) {
        this.sockets.delete(value);
        this.deleteGlobal(username);
        return;
      }
    });
  }

  /**
   * Check if user is part of the queue.
   *
   * @return {boolean}
   * @memberof Reserved
   */
  inQueue() {
    [...this.queue].forEach((value) => {
      if (value.socketId === this.socket.id) {
        return true;
      }
    });
    return false;
  }

  /**
   * Delete user from Map by username.
   *
   * @param {string} username
   * @memberof Reserved
   */
  deleteGlobal(username) {
    [...this.global].forEach((value) => {
      if (value[0].username === username) {
        this.global.delete(value[0]);
      }
    });
  }

  /**
   * Add socket to Map.
   *
   * @param {string} username
   * @memberof Reserved
   */
  addSocket(username) {
    this.sockets.set(username, this.socket);
  }

  /**
   * Add user to Map.
   *
   * @param {User} user
   * @memberof Reserved
   */
  addUser(user) {
    this.deleteGlobal(user.username);
    this.global.set(user, 1);
  }

  /**
   * Remove socket from rooms
   * and disconnect when there is an error with the sockets.
   *
   * @param {string} room
   * @memberof Reserved
   */
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
