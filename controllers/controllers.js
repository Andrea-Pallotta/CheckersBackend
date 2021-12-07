const validation = require('../validator/validation');
const validationSchemas = require('../validator/schemas.validation');
const Response = require('../classes/response.class');
const Helper = require('../classes/helper.class');

module.exports = {
  /**
   * Get user from database and send it to the frontend.
   *
   * @param  {JSON} req
   * @param  {Object} res
   */
  getUser: async (req, res) => {
    if (validation.validate(validationSchemas.getUser, req.query)) {
      const user = Helper.getUser(req.query.username);
      if (user) {
        return res.status(200).json(Response.Success(user));
      }
      return res.status(404).json(Response.E404('User not found'));
    }
    return res.status(400).json(Response.E400());
  },

  /**
   * Insert user to the database and
   * send it to the frontend if insert was successful.
   *
   * @param  {JSON} req
   * @param  {Object} res
   */
  insertUser: async (req, res) => {
    if (validation.validate(validationSchemas.insertUser, req.body)) {
      const username = req.body.username;
      const email = req.body.email;

      const user = Helper.getUser('username', username);

      if (user) {
        return res.status(200).json(Response.Success(user));
      }

      const newUser = Helper.insertAndRetrieveUser(username, email);
      if (newUser) {
        return res.status(200).json(Response.Success(user));
      }
      return res.status(500).json(Response.E500('Error creating account'));
    }
    return res.status(400).json(Response.E400());
  },

  /**
   * Get 20 users from dabatase based on offset.
   * Used for infinite scrolling leaderboard.
   *
   * @param  {JSON} req
   * @param  {Object} res
   */
  getLeaderboard: async (req, res) => {
    const users = Helper.getUsersByLimit();
    if (users.length > 0) {
      return res.status(200).json(Response.Success(users));
    }
    return res.status(404).json(Response.E404('No more users'));
  },
};
