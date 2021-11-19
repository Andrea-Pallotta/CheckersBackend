const { serialize } = require("../utilities/utilities");
const Sender = require("./sender.class");
const Rooms = require("./room.class");
const Reserved = require("./reserved.class");
const Message = require("./message.class");
const { INITIAL_GAME_STATE } = require("./constants.class");

class Receiver extends Reserved {
  constructor(io, socket, sockets, global, messages, queue, gameCount, user) {
    super(io, socket, sockets, global, messages, queue);
    this.sender = new Sender(
      this.io,
      this.socket,
      this.sockets,
      this.global,
      this.messages
    );
    this.rooms = new Rooms(this.io, this.socket);
    this.user = user;
    this.gameCount = gameCount;
    this.queue = queue;
    this.socket.on("disconnect", this.onDisconnect);
    this.socket.on("join-public-chat", () => this.joinChat());
    this.socket.on("public-message", (message) => this.publicMessage(message));
    this.socket.on("join-queue", this.joinQueue);
    this.socket.on("game-message", (content) =>
      this.gameMessage(content.message, content.roomId)
    );
    this.socket.on("game-move", (content) =>
      this.gameMove(
        content.state,
        content.players,
        content.turn,
        content.roomId
      )
    );
  }

  joinChat() {
    this.addUser(this.user);
    this.rooms.join("public-chat");
    this.sender.roomsNoSender(
      "joined-public-chat",
      serialize(this.global),
      "public-chat"
    );
  }

  publicMessage(message) {
    this.sender.roomsNoSender(
      "send-message",
      new Message(this.user.username, message),
      "public-chat"
    );
  }

  joinQueue() {
    if (this.queue.length === 0) {
      this.queue.push(this.user);
    } else {
      this.queue.shift().then((queuedUser) => {
        this.rooms.join(`game-room-${this.gameCount}`);
        this.rooms.socketJoin(
          this.io.sockets.sockets.get(queuedUser.id),
          `game-room-${this.gameCount}`
        );
        this.sender.basic(
          "start-game",
          INITIAL_GAME_STATE(this.user, queuedUser, this.gameCount)
        );
        this.sender.private(
          queuedUser.id,
          "start-game",
          INITIAL_GAME_STATE(this.user, queuedUser, this.gameCount)
        );
        this.sender.roomsNoSender(
          "joined-public-chat",
          serialize(this.global),
          "public-chat"
        );
        this.gameCount += 1;
      });
    }
  }

  gameMessage(message, roomId) {
    this.sender.roomsNoSender(
      "send-game-message",
      new Message(this.user.username, message),
      `game-room-${roomId}`
    );
  }

  gameMove(state, players, turn, roomId) {
    console.log(state, players, turn, roomId);
  }

  onDisconnect() {
    this.disconnect();
    this.sender.roomsNoSender(
      "joined-public-chat",
      serialize(this.global),
      "public-chat"
    );
  }
}

module.exports = Receiver;
