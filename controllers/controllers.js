const validation = require('../validator/validation');
const validationSchemas = require('../validator/schemas.validation');
const Response = require('../classes/response.class');
const Helper = require('../classes/helper.class');

module.exports = {
  getUser: async (req, res) => {
    if (validation.validate(validationSchemas.getUser, req.query)) {
      const user = Helper.getUser(req.query.username);
      if (user) {
        return res.status(200).send(Response.Success(user));
      }
      return res.status(404).send(Response.E404('User not found'));
    }
    return res.status(400).send(Response.E400());
  },

  insertUser: async (req, res) => {
    if (validation.validate(validationSchemas.insertUser, req.body)) {
      const username = req.body.username;
      const email = req.body.email;

      const user = Helper.getUser('username', username);

      if (user) {
        return res.status(200).send(Response.Success(user));
      }

      const newUser = Helper.insertAndRetrieveUser(username, email);
      if (newUser) {
        return res.status(200).send(Response.Success(user));
      }
      return res.status(500).send(Response.E500('Error creating account'));
    }
    return res.status(400).send(Response.E400());
  },
};
