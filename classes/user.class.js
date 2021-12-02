class User {
  constructor(
    username,
    email,
    accessToken,
    socketId,
    wins,
    draws,
    losses,
    score,
    id
  ) {
    this.username = username;
    this.email = email;
    this.accessToken = accessToken;
    this.socketId = socketId;
    this.wins = wins;
    this.draws = draws;
    this.losses = losses;
    this.score = score;
    this.id = id;
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
