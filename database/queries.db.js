const DB = require('better-sqlite3-helper');

const allUsers = DB().query('SELECT * FROM users');

module.exports = {
  allUsers,
};
