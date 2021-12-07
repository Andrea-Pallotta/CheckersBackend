const DB = require('better-sqlite3-helper');
const User = require('./user.class');

/**
 * Class containing helper methods and
 * function to query the database.
 *
 * @class Helper
 */
class Helper {
  /**
   * Update a user's active game based the username.
   *
   * @static
   * @param {string} username
   * @param {number} activeGame
   * @memberof Helper
   */
  static updateActiveGame(username, activeGame) {
    DB().update('users', { activeGame }, { username });
  }

  /**
   * Update multiple user's active game.
   *
   * @static
   * @param {number} activeGame
   * @param {string} usernames
   * @memberof Helper
   */
  static updateActiveGames(activeGame, ...usernames) {
    usernames.forEach((username) => {
      this.updateActiveGame(username, activeGame);
    });
  }

  /**
   * Verify if JSON is a User instance.
   *
   * @static
   * @param {JSON} user
   * @return {User}
   * @memberof Helper
   */
  static verifyUser(user) {
    return User.fromJSON(user) ? User.fromJSON(user) : undefined;
  }

  /**
   * Get user by custom query.
   *
   * @static
   * @param {string} query
   * @param {*} params
   * @memberof Helper
   */
  static getUserByQuery(query, params) {
    this.verifyUser(DB().query(query, params)[0]);
  }

  /**
   * Get user from database based on one WHERE condition.
   *
   * @static
   * @param {string} field
   * @param {*} param
   * @return {User}
   * @memberof Helper
   */
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

  static getUsersByLimit() {
    return DB().query(
      'SELECT username, score, wins, losses, draws, activeGame FROM users ORDER BY score DESC'
    );
  }

  /**
   * Delete all active games from users in database.
   *
   * @static
   * @memberof Helper
   */
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

  /**
   * Clear active games from all usernames passed as parameter.
   *
   * @static
   * @param {[string]} usernames
   * @memberof Helper
   */
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

  /**
   * update user's socketId in database and return user.
   *
   * @static
   * @param {string} socketId
   * @param {string} username
   * @return {User}
   * @memberof Helper
   */
  static updateAndGetUser(socketId, username) {
    DB().update('users', { socketId }, ['username = ?', username]);
    return this.getUser('username', username);
  }

  static updateScore(user) {
    DB().update(
      'users',
      user,
      ['username = ?', user.username],
      ['wins', 'draws', 'losses', 'score']
    );
  }
}

module.exports = Helper;
