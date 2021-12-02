const WaitQueue = require('wait-queue');
const Game = require('./game.class');

class Constants {
  static NEW_GAME_BOARD = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];
  static SOCKETS = new Map();
  static GLOBAL = new Map();
  static GAMES = new Map();
  static MESSAGES = new Set();
  static QUEUE = new WaitQueue();
  static GAMECOUNT = 0;

  static INITIAL_GAME_STATE = (player1, player2, roomId) => {
    return new Game(
      this.NEW_GAME_BOARD,
      player1,
      player2,
      1,
      { x: undefined, y: undefined },
      roomId,
      `It's ${player1.username} turn.`,
      false,
      undefined
    );
  };
}

module.exports = Constants;
