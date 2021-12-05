const WaitQueue = require('wait-queue');

/**
 * Empty board game.
 */
exports.NEW_GAME_BOARD = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

/**
 * Create a Map() to hold sockets.
 */
exports.SOCKETS = new Map();

/**
 * Create a Map() to hold users.
 */
exports.GLOBAL = new Map();

/**
 * Create a Map() to hold games.
 */
exports.GAMES = new Map();

/**
 * Create a Set() to hold messages.
 */
exports.MESSAGES = new Set();

/**
 * Create a WaitQueue() to async manage queue system.
 */
exports.QUEUE = new WaitQueue();

/**
 * Create a new {number} for counting the number of games.
 */
exports.GAMECOUNT = 0;
