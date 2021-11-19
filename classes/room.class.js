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

  getSockets(room) {
    return this.io.in(`${room}`);
  }

  getRooms() {
    return this.io.sockets.adapter.rooms;
  }

  createRoomAdapter(name) {
    this.io.of("/").adapter.on(`${name}`, (room) => {
      console.log(`room ${room} created.`);
    });
  }

  joinRoomAdapter(name) {
    this.io.of("/").adapter.on(`${name}`, (room, id) => {
      console.log(`socket ${id} joined room ${room}`);
    });
  }
}

module.exports = Rooms;
