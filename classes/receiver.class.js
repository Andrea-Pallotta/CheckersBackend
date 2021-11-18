const { serialize } = require("../utilities/utilities");
const Rooms = require("./room.class");
const Sender = require("./sender.class");

class Receiver extends Reserved {
  constructor(io, socket, sockets, global, messages) {
    super(io, socket, sockets, global, messages);
    this.sender = new Sender(
      this.io,
      this.socket,
      this.sockets,
      this.global,
      this.messages
    );
    this.rooms = new Rooms(this.io, this.socket);
    this.socket.on("join-public-chat", (username) => this.joinChat(username));
    this.socket.on("public-message", (message) => this.publicMessage(message));
  }

  joinChat = (username) => {
    try {
      this.addUser();
      this.rooms.join("public-chat");
      this.sender.roomsNoSender(
        "joined-public-chat",
        serialize(this.global),
        "public-chat-room"
      );
    } catch {
      this.onError(username, "public-chat-room");
    }
  };

  publicMessage = (message) => {
    const user = this.getUser();
    if (user) {
      this.sender.roomsNoSender("send-message", {}, "public-chat-room");
    } else {
      this.onError(null, "public-chat-room");
    }
  };
}

module.exports = Receiver;
