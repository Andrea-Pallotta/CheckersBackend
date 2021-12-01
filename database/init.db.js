const Database = require('better-sqlite3');
const db = new Database('connect4.db', { verbose: console.log });

module.exports = db;
