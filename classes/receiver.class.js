const { serialize } = require('../utilities/utilities');
const Sender = require('./sender.class');
const Rooms = require('./room.class');
const Reserved = require('./reserved.class');
const Message = require('./message.class');
const { INITIAL_GAME_STATE } = require('./constants.class');
const Game = require('./game.class');

class Receiver extends Reserved {
  constructor(
    io,
    socket,
    sockets,
    global,
    messages,
    queue,
    gameCount,
    user,
    rooms
  ) {
    super(io, socket, sockets, global, messages, queue);
    this.sender = new Sender(
      this.io,
      this.socket,
      this.sockets,
      this.global,
      this.messages,
      this.queue
    );
    this.rooms = rooms;
    this.user = user;
    this.gameCount = gameCount;
    this.socket.on('disconnect', () => this.onDisconnect());
    this.socket.on('join-public-chat', () => this.joinChat());
    this.socket.on('public-message', (message) => this.publicMessage(message));
    this.socket.on('join-queue', () => this.joinQueue());
    this.socket.on('game-message', (content) =>
      this.gameMessage(content.message, content.roomId)
    );
    this.socket.on('game-move', (game) => this.gameMove(Game.fromJSON(game)));
  }

  joinChat() {
    this.addUser(this.user);
    this.rooms.join('public-chat');
    this.sender.roomsAll(
      'joined-public-chat',
      serialize(this.global),
      'public-chat'
    );
  }

  publicMessage(message) {
    this.sender.roomsAll(
      'send-message',
      new Message(this.user.username, message),
      'public-chat'
    );
  }

  joinQueue() {
    if (this.queue.length === 0) {
      this.queue.push(this.user);
    } else {
      if (this.inQueue() === false) {
        this.queue.shift().then((queuedUser) => {
          this.deleteGlobal();
          this.deleteGlobal(queuedUser.id);
          this.rooms.join(`game-room-${this.gameCount}`);
          this.rooms.socketJoin(
            this.io.sockets.sockets.get(queuedUser.id),
            `game-room-${this.gameCount}`
          );
          this.sender.roomsAll(
            'start-game',
            INITIAL_GAME_STATE(this.user, queuedUser, this.gameCount),
            `game-room-${this.gameCount}`
          );
          this.sender.roomsNoSender(
            'joined-public-chat',
            serialize(this.global),
            'public-chat'
          );
          this.gameCount += 1;
        });
      }
    }
  }

  gameMessage(message, roomId) {
    this.sender.roomsNoSender(
      'send-game-message',
      new Message(this.user.username, message),
      `game-room-${roomId}`
    );
  }

  gameMove(game) {
    game.board[game.move.x][game.move.y] = game.turn;
    game.move.x = undefined;
    game.move.y = undefined;
    if (game.checkWin() === true) {
      console.log('game ended');
    }
    game.turn = game.turn === 1 ? 2 : 1;

    console.log(game);
    this.sender.roomsAll('send-move', game, `game-room-${game.roomId}`);
  }

  onDisconnect() {
    this.disconnect();
    this.sender.roomsAll(
      'joined-public-chat',
      serialize(this.global),
      'public-chat'
    );
    this.socket.disconnect();
  }
}

module.exports = Receiver;
