/**
 * Class that handles Socket.io rooms.
 *
 * @class Rooms
 */
class Rooms {
  /**
   * Creates an instance of Rooms.
   * @param {*} io
   * @param {*} socket
   * @memberof Rooms
   */
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  /**
   * Join room.
   *
   * @param {string} room
   * @memberof Rooms
   */
  join(room) {
    this.socket.join(`${room}`);
  }

  /**
   * Leave room.
   *
   * @param {string} room
   * @memberof Rooms
   */
  leave(room) {
    this.socket.leave(`${room}`);
  }

  /**
   * Leave room and join another.
   *
   * @param {string} leaveRoom
   * @param {string} joinRoom
   * @memberof Rooms
   */
  leaveAndJoin(leaveRoom, joinRoom) {
    this.leave(`${leaveRoom}`);
    this.join(`${joinRoom}`);
  }

  /**
   * Another socket joins a room.
   *
   * @param {*} socket
   * @param {string} room
   * @memberof Rooms
   */
  socketJoin(socket, room) {
    socket.join(`${room}`);
  }

  /**
   * Another socket leaves a room
   *
   * @param {*} socket
   * @param {string} room
   * @memberof Rooms
   */
  socketLeave(socket, room) {
    socket.leave(`${room}`);
  }

  /**
   * Another socket leaves a room and joins another.
   *
   * @param {*} socket
   * @param {string} leaveRoom
   * @param {string} joinRoom
   * @memberof Rooms
   */
  socketLeaveAndJoin(socket, leaveRoom, joinRoom) {
    this.socketLeave(socket, `${leaveRoom}`);
    this.socketJoin(socket, `${joinRoom}`);
  }

  /**
   * Remove all sockets from room.
   *
   * @param {string} leaveRoom
   * @memberof Rooms
   */
  deleteRoom(leaveRoom) {
    this.io.socketsLeave(leaveRoom);
  }

  /**
   * Remove socket from all rooms.
   *
   * @memberof Rooms
   */
  leaveAll() {
    this.getRooms().forEach((room) => {
      this.socket.leave(room);
    });
  }

  /**
   * Emit an action to all sockets in room.
   *
   * @param {string} action
   * @param {string} room
   * @param {JSON} [arg={}]
   * @memberof Rooms
   */
  async getRoomSocketsAndEmit(action, room, arg = {}) {
    const sockets = await this.io.in(room).fetchSockets();

    sockets.forEach((socket) => {
      socket.emit(action, arg);
    });
  }

  /**
   * Get all rooms.
   *
   * @return {JSON}
   * @memberof Rooms
   */
  getRooms() {
    return this.socket.rooms;
  }

  /**
   * Create adapter that fires every time a room is created.
   *
   * @param {string} name
   * @memberof Rooms
   */
  createRoomAdapter(name) {
    this.io.of('/').adapter.on(`${name}`, (room) => {
      console.log(`room ${room} created.`);
    });
  }

  /**
   * Create adapter that fires every time a socket joins the specified room.
   *
   * @param {string} name
   * @memberof Rooms
   */
  joinRoomAdapter(name) {
    this.io.of('/').adapter.on(`${name}`, (room, id) => {
      console.log(`socket ${id} joined room ${room}`);
    });
  }
}

module.exports = Rooms;
