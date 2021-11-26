class Game {
  constructor(board, player1, player2, turn, gameId, message, gameEnded) {
    this.board = board;
    this.player1 = player1;
    this.player2 = player2;
    this.turn = turn;
    this.gameId = gameId;
    this.message = message;
    this.gameEnded = gameEnded;
  }

  static fromJSON(json) {
    return Object.assign(new Game(), json);
  }
}

module.exports = Game;
