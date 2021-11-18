class Rooms {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  leave = (room) => {
    this.socket.leave(`${room}`);
  };

  join = (room) => {
    this.socket.join(`${room}`);
  };

  getSockets = (room) => {
    return this.io.in(`${room}`);
  };

  getRooms = () => {
    return this.io.sockets.adapter.rooms;
  };

  createRoomAdapter = (name) => {
    this.io.of("/").adapter.on(`${name}`, (room) => {
      console.log(`room ${room} created.`);
    });
  };

  joinRoomAdapter = (name) => {
    this.io.of("/").adapter.on(`${name}`, (room, id) => {
      console.log(`socket ${id} joined room ${room}`);
    });
  };
}

module.exports = Rooms;
