const router = require('express').Router();

const { getUser, insertUser } = require('../controllers/controllers');

/**
 * Endpoint to retrieve a user instance from the database
 * @param  {string} '/getUser'
 * @param  {} getUser
 */
router.get('/getUser', getUser);

/**
 * Endpoint to insert a user and send it to the frontend
 * @param  {} '/insertUser'
 * @param  {} insertUser
 */
router.post('/insertUser', insertUser);

module.exports = router;
