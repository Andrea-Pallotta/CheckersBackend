const router = require('express').Router();

const { getUser, insertUser } = require('../controllers/controllers');

router.get('/getUser', getUser);
router.post('/insertUser', insertUser);

module.exports = router;
