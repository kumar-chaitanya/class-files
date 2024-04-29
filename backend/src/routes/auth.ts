import express from 'express';
const router = express.Router();
import { validateAuth, handleValidationErrors } from '../middlewares/validation';
import { authenticateUser } from '../controllers/auth-controller';

router.post('/login', validateAuth, [handleValidationErrors], authenticateUser);

export default router;
