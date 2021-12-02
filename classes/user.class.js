class User {
  constructor(
    username,
    socketId,
    email,
    accessToken,
    wins,
    draws,
    losses,
    score,
    id,
    activeGame
  ) {
    this.username = username;
    this.socketId = socketId;
    this.email = email;
    this.accessToken = accessToken;
    this.wins = wins;
    this.draws = draws;
    this.losses = losses;
    this.score = score;
    this.id = id;
    this.activeGame = activeGame;
  }

  getUsername() {
    return this.username;
  }

  getId() {
    return this.id;
  }

  setUsername(username) {
    this.username = username;
  }

  setId(socketId) {
    this.socketId = socketId;
  }

  static fromJSON(json) {
    return Object.assign(new User(), json);
  }
}

module.exports = User;
