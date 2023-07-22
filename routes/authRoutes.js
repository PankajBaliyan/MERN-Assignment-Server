// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register user
router.post('/users', authController.register);

// Gel all users
router.get('/users', authController.getAllUsers);

// Delete user
router.delete('/deleteUser/:id', authController.deleteUser);

// Update user details
router.patch('/updateUserDetails/:id', authController.updateUserDetails);

// Login user
router.post('/login', authController.login);

module.exports = router;
