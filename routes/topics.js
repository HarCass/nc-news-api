const router = require('express').Router();
const {getTopics} = require('../controllers/topics');

router.get('/', getTopics);

module.exports = router;