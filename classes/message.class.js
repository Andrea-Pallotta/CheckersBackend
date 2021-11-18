const uuidv4 = require("uuid").v4;

class Message {
  constructor(sender, message) {
    this.sender = sender;
    this.message = message;
    this.uuid = uuidv4();
  }
}

module.exports = Message;
