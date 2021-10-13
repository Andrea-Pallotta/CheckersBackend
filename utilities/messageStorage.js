var uuid = require("uuid");

const messages = [];

const addMessage = (room, message) => {
  const _message = { id: uuid.v4(), room, ...message };
  messages.push(_message);
  return _message;
};

const getMessage = (id) => messages.find((message) => message.id === id);

const getMessagesInRoom = (room) =>
  messages.filter((message) => message.room === room);

module.exports = {
  addMessage,
  getMessage,
  getMessagesInRoom,
};
