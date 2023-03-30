const router = require('express').Router();
const {getTopics, postTopic} = require('../controllers/topics');

router.get('/', getTopics);

router.post('/', postTopic);

module.exports = router;