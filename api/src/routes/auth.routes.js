const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/google', authController.googleLogin);
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.getCurrentUser);
router.get('/google/url', authController.getGoogleAuthUrl);
router.get('/google/callback', authController.googleCallback);

module.exports = router;
