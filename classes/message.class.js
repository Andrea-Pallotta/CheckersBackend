const uuidv4 = require('uuid').v4;

/**
 * Class model for chat messages.
 *
 * @class Message
 */
class Message {
  /**
   * Creates an instance of Message.
   * @param {string} sender
   * @param {string} message
   * @memberof Message
   */
  constructor(sender, message) {
    this.sender = sender;
    this.message = message;
    this.uuid = uuidv4();
    this.time = new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }
}

module.exports = Message;
