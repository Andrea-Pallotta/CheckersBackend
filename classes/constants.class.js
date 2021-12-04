const WaitQueue = require('wait-queue');

exports.NEW_GAME_BOARD = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];
exports.SOCKETS = new Map();
exports.GLOBAL = new Map();
exports.GAMES = new Map();
exports.MESSAGES = new Set();
exports.QUEUE = new WaitQueue();
exports.GAMECOUNT = 0;
