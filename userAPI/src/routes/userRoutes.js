const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Define routes
router.get('/', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);
router.post('/autenticar', userController.authenticateUser);
router.put('/:id', userController.updateUser);
router.post('/', userController.createUser);

module.exports = router;
