const express = require('express');
const { register, login, getMe } = require('../controllers/authController.js');
const { protect } = require('../middleware/auth.js');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation.js');

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/me', protect, getMe);

module.exports = router;