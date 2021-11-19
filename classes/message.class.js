const uuidv4 = require("uuid").v4;

class Message {
  constructor(sender, message) {
    this.sender = sender;
    this.message = message;
    this.uuid = uuidv4();
    this.time = new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
}

module.exports = Message;
