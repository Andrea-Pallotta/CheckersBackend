const insertUser = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['username', 'email'],
  additionalProperties: false,
};

const getUser = {
  type: 'object',
  properties: {
    username: { type: 'string' },
  },
  required: ['username'],
  additionalProperties: false,
};

module.exports = {
  getUser,
  insertUser,
};
