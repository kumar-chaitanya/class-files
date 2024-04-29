import express from 'express';
const router = express.Router();

import { downloadFile } from '../controllers/file-controller';

router.get('/:fileId/download', downloadFile);

export default router;
