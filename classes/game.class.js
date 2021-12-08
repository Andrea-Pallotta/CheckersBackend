const Helper = require('./helper.class');
require('../utilities/extensions');

/**
 * Class model for games.
 *
 * @class Game
 */
class Game {
  /**
   * Creates an instance of Game.
   * @param {*} board
   * @param {*} player1
   * @param {*} player2
   * @param {*} turn
   * @param {*} move
   * @param {*} roomId
   * @param {*} message
   * @param {*} gameEnded
   * @param {*} winner
   * @memberof Game
   */
  constructor(
    board,
    player1,
    player2,
    turn,
    move,
    roomId,
    message,
    gameEnded,
    winner
  ) {
    this.board = board;
    this.player1 = player1;
    this.player2 = player2;
    this.turn = turn;
    this.move = move;
    this.roomId = roomId;
    this.message = message;
    this.gameEnded = gameEnded;
    this.winner = winner;
  }

  /**
   * Return an array containing the two players.
   *
   * @return {[User]}
   * @memberof Game
   */
  getPlayers() {
    return [this.player1, this.player2];
  }

  /**
   * Check if there is a vertical win condition.
   *
   * @returns {boolean}
   */
  checkColumns() {
    this.board.map((column, columnIndex) => {
      column.map((row, rowIndex) => {
        let currentPiece = undefined;
        if (this.board[columnIndex][rowIndex] !== 0) {
          currentPiece = this.board[columnIndex][rowIndex];
          if (columnIndex > 3) {
            if (
              this.board[columnIndex][rowIndex - 1] === currentPiece &&
              this.board[columnIndex][rowIndex - 2] === currentPiece &&
              this.board[columnIndex][rowIndex - 3] === currentPiece
            ) {
              this.gameEnded = true;
              return true;
            }
          } else {
            if (
              this.board[columnIndex][rowIndex + 1] === currentPiece &&
              this.board[columnIndex][rowIndex + 2] === currentPiece &&
              this.board[columnIndex][rowIndex + 3] === currentPiece
            ) {
              this.gameEnded = true;
              return true;
            }
          }
        }
      });
    });

    return false;
  }

  /**
   * Check if there is an horizontal win condition.
   *
   * @returns {boolean}
   */
  checkRows() {
    this.board.map((column, columnIndex) => {
      column.map((row, rowIndex) => {
        let currentPiece = undefined;
        if (this.board[columnIndex][rowIndex] !== 0) {
          currentPiece = this.board[columnIndex][rowIndex];
          if (columnIndex > 3) {
            if (
              this.board[columnIndex - 1][rowIndex] === currentPiece &&
              this.board[columnIndex - 2][rowIndex] === currentPiece &&
              this.board[columnIndex - 3][rowIndex] === currentPiece
            ) {
              this.gameEnded = true;
              return true;
            }
          } else {
            if (
              this.board[columnIndex + 1][rowIndex] === currentPiece &&
              this.board[columnIndex + 2][rowIndex] === currentPiece &&
              this.board[columnIndex + 3][rowIndex] === currentPiece
            ) {
              this.gameEnded = true;
              return true;
            }
          }
        }
      });
    });

    return false;
  }

  /**
   * Check if there is a diagonal win condition.
   *
   * @returns {boolean}
   */
  checkDiagonally() {
    this.board.map((column, columnIndex) => {
      column.map((row, rowIndex) => {
        let currentPiece = undefined;
        if (this.board[columnIndex][rowIndex] !== 0) {
          currentPiece = this.board[columnIndex][rowIndex];
          if (columnIndex > 3) {
            if (
              this.board[columnIndex - 1][rowIndex - 1] === currentPiece &&
              this.board[columnIndex - 2][rowIndex - 2] === currentPiece &&
              this.board[columnIndex - 3][rowIndex - 3] === currentPiece
            ) {
              this.gameEnded = true;
              return true;
            }
          } else {
            if (
              this.board[columnIndex + 1][rowIndex + 1] === currentPiece &&
              this.board[columnIndex + 2][rowIndex + 2] === currentPiece &&
              this.board[columnIndex + 3][rowIndex + 3] === currentPiece
            ) {
              this.gameEnded = true;
              return true;
            }
          }
        }
      });
    });

    return false;
  }

  /**
   * Check if one of the players won.
   *
   * @returns {boolean}
   */
  checkWin() {
    return this.checkColumns() || this.checkRows() || this.checkDiagonally();
  }

  /**
   * Check if the game ended in a draw.
   *
   * @returns {boolean}
   */
  checkDraw() {
    return this.board.none((column) => column.some((cell) => cell === 0));
  }

  /**
   * Calculate score to be added/subtracted
   * based on the two players' point difference.
   *
   * @return {number}
   * @memberof Game
   */
  calculateScore() {
    const score1 = this.player1.score;
    const score2 = this.player2.score;
    const scoreDiff = score1 - score2;

    if (scoreDiff.inRange(undefined, 0)) return 75;
    if (scoreDiff === 0) return 60;
    if (scoreDiff.inRange(0, 100, true)) return 50;
    if (scoreDiff.inRange(100, 300)) return 25;

    return 15;
  }

  /**
   * Update the two players scores in the local
   * object and in the database.
   *
   * @memberof Game
   */
  updateScores() {
    const scoreDiff = this.calculateScore();

    if (this.winner === undefined) {
      this.player1.draws += 1;
      this.player2.draws += 1;
    } else {
      if (this.winner.username === this.player1.username) {
        this.updatePlayerScore(this.player1, true, scoreDiff);
        this.updatePlayerScore(this.player2, false, scoreDiff);
      } else {
        this.updatePlayerScore(this.player1, false, scoreDiff);
        this.updatePlayerScore(this.player2, true, scoreDiff);
      }
    }

    this.getPlayers().forEach((player) => Helper.updateScore(player));
  }

  /**
   * Update player's score and record.
   *
   * @param {*} player
   * @param {*} winning
   * @param {*} scoreDiff
   * @memberof Game
   */
  updatePlayerScore(player, winning, scoreDiff) {
    if (winning === true) {
      player.wins += 1;
      player.score += scoreDiff;
    } else {
      player.losses += 1;
      if (player.score < scoreDiff) {
        player.score = 0;
      } else {
        player.score -= scoreDiff;
      }
    }
  }

  /**
   * Create a new instance of Game from a JSON object.
   *
   * @static
   * @param {JSON} json
   * @return {Game}
   * @memberof Game
   */
  static fromJSON(json) {
    return Object.assign(new Game(), json);
  }
}

module.exports = Game;
