/**
 * Validator payload for username-email duplet
 */
const insertUser = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['username', 'email'],
  additionalProperties: false,
};

/**
 * Validator payload for username singleton object
 */
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
