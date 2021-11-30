class Rooms {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  join(room) {
    this.socket.join(`${room}`);
  }

  leave(room) {
    this.socket.leave(`${room}`);
  }

  leaveAndJoin(leaveRoom, joinRoom) {
    this.leave(`${leaveRoom}`);
    this.join(`${joinRoom}`);
  }

  socketJoin(socket, room) {
    socket.join(`${room}`);
  }

  socketLeave(socket, room) {
    socket.leave(`${room}`);
  }

  socketLeaveAndJoin(socket, leaveRoom, joinRoom) {
    this.socketLeave(socket, `${leaveRoom}`);
    this.socketJoin(socket, `${joinRoom}`);
  }

  deleteRoom(leaveRoom, joinRoom) {
    this.io.in(leaveRoom).socketsJoin(joinRoom);
    this.io.socketsLeave(leaveRoom);
  }

  leaveAll() {
    this.getRooms().forEach((room) => {
      this.socket.leave(room);
    });
  }

  async getRoomSocketsAndEmit(action, room, arg = {}) {
    const sockets = await this.io.in(room).fetchSockets();

    sockets.forEach((socket) => {
      socket.emit(action, arg);
    });
  }

  getRooms() {
    return this.socket.rooms;
  }

  createRoomAdapter(name) {
    this.io.of('/').adapter.on(`${name}`, (room) => {
      console.log(`room ${room} created.`);
    });
  }

  joinRoomAdapter(name) {
    this.io.of('/').adapter.on(`${name}`, (room, id) => {
      console.log(`socket ${id} joined room ${room}`);
    });
  }
}

module.exports = Rooms;
