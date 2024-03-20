const express = require('express');
const router = express.Router();
const { validateAuth, handleValidationErrors } = require('../middlewares/validation');
const { authenticateUser } = require('../controllers/auth-controller');

router.post('/login', [validateAuth, handleValidationErrors], authenticateUser);

module.exports = router;
