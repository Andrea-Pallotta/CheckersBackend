const DB = require('better-sqlite3-helper');
const Constants = require('./constants.class');
const User = require('./user.class');

class Helper {
  static updateActiveGame(username, activeGame) {
    DB().update('users', { activeGame }, { username });
  }

  static updateActiveGames(activeGame, ...usernames) {
    usernames.forEach((username) => {
      this.updateActiveGame(username, activeGame);
    });
  }

  static initialGameState(user1, user2) {
    return Constants.INITIAL_GAME_STATE(
      User.fromJSON(this.getUser('username', user1)),
      User.fromJSON(this.getUser('username', user2)),
      this.gameCount
    );
  }

  static verifyUser(user) {
    return User.fromJSON(user) ? User.fromJSON(user) : undefined;
  }

  static getUserByQuery(query, params) {
    this.verifyUser(DB().query(query, params)[0]);
  }

  static getUser(field, param) {
    const user = DB().query(`SELECT * FROM users WHERE ${field}=?`, param);
    return this.verifyUser(user[0]);
  }

  static insertUser(username, email) {
    return DB().insert('users', [{ username, email }]);
  }

  static insertAndRetrieveUser(username, email) {
    const insertResult = this.insertUser(username, email);

    if (insertResult > 0) {
      this.getUser('id', insertResult);
    }

    return undefined;
  }

  static clearActiveGames() {
    DB()
      .queryColumn('id', 'SELECT id FROM users')
      .forEach((id) => {
        DB().update(
          'users',
          { activeGame: null },
          ['id = ?', id],
          ['activeGame']
        );
      });
  }

  static clearActiveGame(...usernames) {
    usernames.forEach((username) => {
      DB().update(
        'users',
        { activeGame: null },
        ['username = ?', username],
        ['activeGame']
      );
    });
  }

  static updateAndGetUser(socketId, username) {
    DB().update('users', { socketId }, ['username = ?', username]);
    return this.getUser('username', username);
  }
}

module.exports = Helper;
