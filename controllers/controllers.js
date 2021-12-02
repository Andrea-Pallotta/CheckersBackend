const validation = require('../validator/validation');
const validationSchemas = require('../validator/schemas.validation');
const Response = require('../classes/response.class');
const DB = require('better-sqlite3-helper');
const User = require('../classes/user.class');

module.exports = {
  getUser: async (req, res) => {
    if (validation.validate(validationSchemas.getUser, req.query)) {
      const username = req.query.username;
      const user = DB().query('SELECT * FROM users WHERE username=?', username);
      if (User.fromJSON(user[0])) {
        return res.status(200).send(Response.Success(User.fromJSON(user[0])));
      }
      return res.status();
    }
    return res.status(400).send(new Response('Invalid request parameters'));
  },

  insertUser: async (req, res) => {
    if (validation.validate(validationSchemas.insertUser, req.body)) {
      const username = req.body.username;
      const email = req.body.email;
      const user = DB().query('SELECT * FROM users WHERE username=?', username);
      if (user) {
        return res.status(404).send(Response.E404('User already exists'));
      }
      const test = DB().insert('users', [
        {
          username: username,
          email: email,
        },
      ]);
      if (test === 1) {
        return res.status(200).send(user);
      }
      return res.status(500).send(Response.E500('Error creating account'));
    }
    return res.status(400).send(Response.E400);
  },
};
