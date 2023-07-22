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

// Get user details
// router.get('/getUserDetails/:id', authController.getUserDetails);

// Delete user
// router.get('/logout', authController.logout);

// Update user password
// router.patch('/updatePassword/:id', authController.updatePassword);

module.exports = router;
