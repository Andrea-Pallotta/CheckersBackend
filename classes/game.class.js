class Game {
  constructor(state, players, turn, roomId) {
    this.state = state;
    this.players = players;
    this.turn = turn;
    this.roomId = roomId;
  }

  static fromJSON(json) {
    return Object.assign(new Game(), json);
  }
}

module.exports = Game;
