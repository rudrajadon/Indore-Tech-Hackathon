const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/verify-register', authController.verifyRegister);
router.post('/login', authController.login);
router.post('/verify-login', authController.verifyLogin);

module.exports = router; 