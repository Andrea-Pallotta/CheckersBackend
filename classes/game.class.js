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

  static fromJSON(json) {
    return Object.assign(new Game(), json);
  }
}

module.exports = Game;
