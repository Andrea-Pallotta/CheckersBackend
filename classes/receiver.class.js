const { serialize } = require('../utilities/utilities');
const Sender = require('./sender.class');
const Reserved = require('./reserved.class');
const Message = require('./message.class');
const Constants = require('./constants.class');
const Game = require('./game.class');
const Rooms = require('./room.class');
const Helper = require('./helper.class');

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
    games
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
    this.rooms = new Rooms(this.io, this.socket);
    this.user = user;
    this.gameCount = gameCount;
    this.games = games;
    this.socket.on('disconnect', () => this.onDisconnect());
    this.socket.on('disconnecting', () => this.onDisconnecting());
    this.socket.on('join-public-chat', () => this.joinChat());
    this.socket.on('public-message', (message) => this.publicMessage(message));
    this.socket.on('join-queue', () => this.joinQueue());
    this.socket.on('game-message', (content) =>
      this.gameMessage(content.message, content.roomId)
    );
    this.socket.on('get-current-game', (id) => this.getCurrentGame(id));
    this.socket.on('game-move', (game) => this.gameMove(Game.fromJSON(game)));
    this.socket.on('forfeit-game', (gameState) => this.forfeitGame(gameState));
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
    if (this.inQueue() === false) {
      if (this.queue.length === 0) {
        this.queue.push(this.user);
      } else {
        this.queue.shift().then((queuedUser) => {
          try {
            this.gameCount += 1;
            this.rooms.join(`game-room-${this.gameCount}`);
            this.rooms.socketJoin(
              this.io.sockets.sockets.get(queuedUser.socketId),
              `game-room-${this.gameCount}`
            );
            this.games.set(
              this.gameCount,
              Constants.INITIAL_GAME_STATE(
                this.user,
                queuedUser,
                this.gameCount
              )
            );
            Helper.updateActiveGames(
              this.gameCount,
              this.user.username,
              queuedUser.username
            );
            this.sender.roomsAll(
              'start-game',
              Helper.initialGameState(
                this.user.username,
                queuedUser.username,
                this.gameCount
              ),
              `game-room-${this.gameCount}`
            );
            this.deleteGlobal(this.user.username);
            this.deleteGlobal(queuedUser.username);
            this.sender.roomsNoSender(
              'joined-public-chat',
              serialize(this.global),
              'public-chat'
            );
          } catch {
            this.games.delete(this.gameCount);
            this.sender.roomsAll(
              'queue-failed',
              {},
              `game-room-${this.gameCount}`
            );
            this.rooms.leave(`game-room-${this.gameCount}`);
            this.rooms.socketLeave(
              this.io.sockets.sockets.get(queuedUser.socketId),
              `game-room-${this.gameCount}`
            );
          }
        });
      }
    } else {
      this.sender.basic('already-in-queue', {});
    }
  }

  gameMessage(message, roomId) {
    this.sender.roomsAll(
      'send-game-message',
      new Message(this.user.username, message),
      `game-room-${roomId}`
    );
  }

  getCurrentGame(id) {
    if (id !== null && this.games.get(id)) {
      this.rooms.join(`game-room-${id}`);
      if (this.games.get(id)) {
        this.sender.roomsAll('reconnect-game', this.games.get(id));
      }
    }
  }

  gameMove(game) {
    if (game.move.x !== undefined && game.move.y !== undefined) {
      game.board[game.move.x][game.move.y] = game.turn;
      game.move.x = undefined;
      game.move.y = undefined;
      game.checkWin();

      if (game.gameEnded === true) {
        const winner = this.user;
        winner.wins += 1;
        winner.score += 50;

        game.winner = winner;
        game.message = `${winner.username} Won the Game!`;
        Helper.clearActiveGame(game.player1.username, game.player2.username);
        this.games.delete(game.roomId);
        game.updateScores();
        game.getPlayers().forEach((user) => {
          Helper.updateScore(user);
        });
      } else {
        if (game.checkDraw() === true) {
          game.message = `Game Ended with a Draw!`;
          game.gameEnded = true;
          Helper.clearActiveGame(game.player1.username, game.player2.username);
          this.games.delete(game.roomId);
        } else {
          game.turn = game.turn === 1 ? 2 : 1;
          game.message = `It's ${
            game.turn === 1 ? game.player1.username : game.player2.username
          } turn`;
          this.games.set(game.roomId, game);
        }
      }
    }
    this.sender.roomsAll('send-move', game, `game-room-${game.roomId}`);
  }

  forfeitGame(gameState) {
    gameState.message = `${gameState.winner.username} won the game!`;
    gameState.gameEnded = true;
    this.sender.roomsAll(
      'game-forfeited',
      gameState,
      `game-room-${gameState.roomId}`
    );
    this.rooms.deleteRoom(`game-room-${gameState.gameId}`);
  }

  onDisconnecting() {
    this.rooms.leaveAll();
  }

  onDisconnect() {
    this.sender.roomsAll(
      'joined-public-chat',
      serialize(this.global),
      'public-chat'
    );
    this.socket.disconnect();
  }
}

module.exports = Receiver;
