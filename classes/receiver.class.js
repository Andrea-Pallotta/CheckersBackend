const { serialize } = require('../utilities/utilities');
const Sender = require('./sender.class');
const Reserved = require('./reserved.class');
const Message = require('./message.class');
const Game = require('./game.class');
const Rooms = require('./room.class');
const Helper = require('./helper.class');
const { NEW_GAME_BOARD } = require('./constants.class');

/**
 * Class to handle events from clients.
 *
 * @class Receiver
 * @extends {Reserved}
 */
class Receiver extends Reserved {
  /**
   * Creates an instance of Receiver.
   * @param {*} io
   * @param {*} socket
   * @param {*} sockets
   * @param {*} global
   * @param {*} messages
   * @param {*} queue
   * @param {*} gameCount
   * @param {*} user
   * @param {*} games
   * @memberof Receiver
   */
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
    this.socket.on('stop-queue', () => this.stopQueue());
    this.socket.on('challenge-player', (username) =>
      this.challengePlayer(username)
    );
    this.socket.on('challenge-response', (content) =>
      this.challengeResponse(content.username, content.status)
    );
    this.socket.on('game-message', (content) =>
      this.gameMessage(content.message, content.roomId)
    );
    this.socket.on('get-current-game', (id) => this.getCurrentGame(id));
    this.socket.on('game-move', (game) => this.gameMove(Game.fromJSON(game)));
    this.socket.on('forfeit-game', (gameState) => this.forfeitGame(gameState));
  }

  /**
   * Add user to global chat.
   *
   * @memberof Receiver
   */
  joinChat() {
    this.addUser(this.user);
    this.user.setOnline();
    this.rooms.join('public-chat');
    this.sender.roomsAll(
      'joined-public-chat',
      serialize(this.global),
      'public-chat'
    );
  }

  /**
   * Receive message from client and send it to all in room.
   *
   * @param {string} message
   * @memberof Receiver
   */
  publicMessage(message) {
    this.sender.roomsAll(
      'send-message',
      new Message(this.user.username, message),
      'public-chat'
    );
  }

  /**
   * Join queue. If queue is empty, add user and wait.
   * Otherwise create game a emit to new game room.
   *
   * @memberof Receiver
   */
  async joinQueue() {
    if (this.queue.length === 0) {
      this.user.setInQueue();
      this.queue.push(this.user);

      this.sender.roomsAll(
        'joined-public-chat',
        serialize(this.global),
        'public-chat'
      );
    } else {
      const queuedUser = await this.queue.shift();
      try {
        this.createGame(queuedUser);
      } catch {
        this.games.delete(this.gameCount);
        this.sender.roomsAll('queue-failed', {}, `game-room-${this.gameCount}`);
        this.rooms.leave(`game-room-${this.gameCount}`);
        if (this.io.sockets.sockets.get(queuedUser.socketId)) {
          this.rooms.socketLeave(
            this.io.sockets.sockets.get(queuedUser.socketId),
            `game-room-${this.gameCount}`
          );
        }
      }
    }
  }

  /**
   * Remove user from queue
   *
   * @memberof Receiver
   */
  stopQueue() {
    this.user.setOnline();
    this.removeFromQueue();
    this.sender.roomsAll(
      'joined-public-chat',
      serialize(this.global),
      'public-chat'
    );
  }

  /**
   * Send a game challenge to a user.
   *
   * @param {string} username
   * @memberof Receiver
   */
  challengePlayer(username) {
    const user = Helper.getUser('username', username);
    if (user.socketId && !user.activeGame) {
      this.sender.private(
        user.socketId,
        'challenge-received',
        this.user.username
      );
    }
  }

  /**
   * Receive challenge response from client. Start game if user accepted.
   * Emit decline event if user declined.
   *
   * @param {*} username
   * @param {*} status
   * @memberof Receiver
   */
  challengeResponse(username, status) {
    const user = Helper.getUser('username', username);
    if (status === 'accept') {
      this.createGame(user);
    } else if (status === 'decline') {
      this.sender.private(
        user.socketId,
        'challenge-declined',
        this.user.username
      );
    }
  }

  /**
   * Receive message from client and emit to game room.
   *
   * @param {string} message
   * @param {string} roomId
   * @memberof Receiver
   */
  gameMessage(message, roomId) {
    this.sender.roomsAll(
      'send-game-message',
      new Message(this.user.username, message),
      `game-room-${roomId}`
    );
  }

  /**
   * Get active game in case user disconnected.
   *
   * @param {number} id
   * @memberof Receiver
   */
  getCurrentGame(id) {
    if (id !== null && this.games.get(id)) {
      this.rooms.join(`game-room-${id}`);
      if (this.games.get(id)) {
        this.sender.roomsAll('reconnect-game', this.games.get(id));
      }
    }
  }

  /**
   * Handle game move. If timer expired, change turn and emit.
   * If game move is valid, upate board and emit.
   * If game ended with a win or draw, update users and emit.
   *
   * @param {JSON} game
   * @memberof Receiver
   */
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
        game.message = `${winner.username} won the Game!`;
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
    } else {
      game.turn = game.turn === 1 ? 2 : 1;
      game.message = `It is ${
        game.turn === 1 ? game.player1.username : game.player2.username
      }'s turn`;
      this.games.set(game.roomId, game);
    }
    this.sender.roomsAll('update-game', game, `game-room-${game.roomId}`);
  }

  /**
   * Receive a forfeit request from client. Update scores and emit.
   *
   * @param {JSON} gameState
   * @memberof Receiver
   */
  forfeitGame(gameState) {
    const game = Game.fromJSON(gameState);
    game.winner =
      game.player1.username === this.user.username
        ? game.player2
        : game.player1;
    game.message = `${game.winner.username} won the game!`;
    game.gameEnded = true;

    Helper.clearActiveGame(game.player1.username, game.player2.username);
    this.games.delete(game.roomId);
    game.updateScores();
    game.getPlayers().forEach((user) => {
      Helper.updateScore(user);
    });
    this.sender.roomsAll('send-move', game, `game-room-${game.roomId}`);
  }

  /**
   * Handle user disconnecting.
   *
   * @memberof Receiver
   */
  onDisconnecting() {
    this.rooms.leaveAll();
    if (this.queue.length > 0) {
      this.removeFromQueue();
    }
  }

  /**
   * Handle user disconnected.
   *
   * @memberof Receiver
   */
  onDisconnect() {
    this.sender.roomsAll(
      'joined-public-chat',
      serialize(this.global),
      'public-chat'
    );
    this.socket.disconnect();
  }

  /**
   * Create a new game state and emit to the two players.
   *
   * @param {*} user
   * @memberof Receiver
   */
  createGame(user) {
    this.gameCount += 1;
    const game = new Game(
      NEW_GAME_BOARD,
      user,
      this.user,
      1,
      { x: undefined, y: undefined },
      this.gameCount,
      `It's ${user.username} turn.`,
      false,
      undefined
    );
    this.user.setInGame();
    user.setInGame();
    this.rooms.join(`game-room-${this.gameCount}`);
    this.rooms.socketJoin(
      this.io.sockets.sockets.get(user.socketId),
      `game-room-${this.gameCount}`
    );
    this.games.set(this.gameCount, game);
    Helper.updateActiveGames(this.gameCount, this.user.username, user.username);
    this.sender.roomsAll('start-game', game, `game-room-${this.gameCount}`);
    this.sender.roomsAll(
      'joined-public-chat',
      serialize(this.global),
      'public-chat'
    );
  }
}

module.exports = Receiver;
