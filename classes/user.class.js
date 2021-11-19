class User {
  constructor(username, id) {
    this.username = username;
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

  setId(id) {
    this.id = id;
  }
}

module.exports = User;
