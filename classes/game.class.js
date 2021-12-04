const Helper = require('./helper.class');

require('../utilities/extensions');

class Game {
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

  getPlayers() {
    return [this.player1, this.player2];
  }

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

  checkWin() {
    return this.checkColumns() || this.checkRows() || this.checkDiagonally();
  }

  checkDraw() {
    return this.board.none((column) => column.some((cell) => cell === 0));
  }

  calculateScore() {
    const score1 = this.player1.score;
    const score2 = this.player2.score;

    const absScore = Math.abs(score1 - score2);

    if (absScore >= 0 && absScore < 100) {
      return 50;
    } else if (absScore >= 100 && absScore < 300) {
      return 150;
    } else if (absScore >= 300) {
      return absScore / 2;
    }

    return 0;
  }

  updateScores() {
    const scoreDiff = this.calculateScore();

    if (this.winner === undefined) {
      this.player1.draws += 1;
      this.player2.draws += 1;
    } else {
      if (this.winner.username === this.player1.username) {
        this.player1.score += scoreDiff;
        this.player1.wins += 1;
      } else {
        this.player1.score -= scoreDiff;
        this.player1.losses += 1;
      }

      this.getPlayers().forEach((player) => Helper.updateScore(player));
    }
  }

  static fromJSON(json) {
    return Object.assign(new Game(), json);
  }
}

module.exports = Game;
