const uuidv4 = require("uuid").v4;

class User {
  constructor(username, id) {
    this.username = username;
    this.id = id;
    this.uuid = uuidv4();
  }

  getUsername = () => {
    return this.username;
  };

  getId = () => {
    return this.id;
  };

  setUsername = (username) => {
    this.username = username;
  };

  setId = (id) => {
    this.id = id;
  };
}

module.exports = User;
