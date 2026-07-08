const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

router.get('/', verifyToken, usersController.getAllUsers);
router.get('/:id', verifyToken, usersController.getUserById);
router.put('/:id/role', verifyToken, verifyAdmin, usersController.updateUserRole);
router.delete('/:id', verifyToken, verifyAdmin, usersController.deleteUser);

module.exports = router;
