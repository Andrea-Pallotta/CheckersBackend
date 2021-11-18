const WaitQueue = require("wait-queue");

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
  static MESSAGES = new Set();
  static QUEUE = new WaitQueue();
  static GAMECOUNT = 0;

  static INITIAL_GAME_STATE = (player1, player2, roomId) => {
    return {
      board: this.NEW_GAME_BOARD,
      player1: player1,
      player2: player2,
      turn: 1,
      roomId: roomId,
    };
  };
}

module.exports = Constants;
