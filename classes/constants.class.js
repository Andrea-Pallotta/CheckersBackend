const WaitQueue = require('wait-queue');
const Game = require('./game.class');

const NEW_GAME_BOARD = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];
const SOCKETS = new Map();
const GLOBAL = new Map();
const GAMES = new Map();
const MESSAGES = new Set();
const QUEUE = new WaitQueue();
const GAMECOUNT = 0;

const INITIAL_GAME_STATE = (player1, player2, roomId) => {
  return new Game(
    NEW_GAME_BOARD,
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

const Constants = {
  NEW_GAME_BOARD,
  SOCKETS,
  GLOBAL,
  GAMES,
  MESSAGES,
  QUEUE,
  GAMECOUNT,
  INITIAL_GAME_STATE,
};

module.exports = Constants;
