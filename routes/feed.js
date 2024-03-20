const express = require('express');
const router = express.Router();

const { getClassesFeed, getFilesFeed } = require('../controllers/feed-controller');

router.get('/classes', getClassesFeed);

router.get('/:classroomId/files', getFilesFeed);

module.exports = router;
