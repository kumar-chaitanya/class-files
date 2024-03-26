import express from 'express';
const router = express.Router();

import { getClassesFeed, getFilesFeed } from '../controllers/feed-controller';

router.get('/classes', getClassesFeed);

router.get('/:classroomId/files', getFilesFeed);

export default router;
