// controllers/authController.js

const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;

//Register
exports.register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        // Input validation
        if (!name || !username || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Convert the email to lowercase for case-insensitive comparison
        const lowercaseUsername = username.toLowerCase();

        if (!validator.isEmail(lowercaseUsername)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Password complexity validation (e.g., at least 8 characters with numbers and letters)
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long and contain both letters and numbers',
            });
        }
        // Check if the user already exists
        const existingUser = await User.findOne({
            username: lowercaseUsername,
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User Already Exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            username: lowercaseUsername,
            password: hashedPassword,
        });

        // Save the user to the database
        await user.save();

        // Respond with the created user object
        res.status(201).json(user);
    } catch (error) {
        console.error(error);

        // Handle specific error scenarios
        if (error.name === 'ValidationError') {
            return res
                .status(400)
                .json({ message: 'Validation Error', details: error.message });
        }

        // For other errors, respond with a generic error message
        res.status(500).json({ message: 'Server error' });
    }
};

//Login
exports.login = (req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Server error' });
            }

            // Middleware to generate JWT after successful authentication
            const { _id, username } = req.user;
            const token = jwt.sign(
                { userId: _id, username },
                SESSION_SECRET_KEY,
                { expiresIn: '1h' },
            );
            res.status(200).json({ user, token });
        });
    })(req, res, next);
};

// Get all users list
exports.getAllUsers = (req, res) => {
    try {
        User.find()
            .then((users) => {
                if (!users || users.length === 0) {
                    return res.status(404).json({ message: 'Users not found' });
                }
                res.json(users);
            })
            .catch((error) => {
                console.error('Failed to get users list', error);
                res.status(500).json({ message: 'Failed to get users list' });
            });
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Update User Details
exports.updateUserDetails = async (req, res) => {
    const { name, username, password } = req.body;
    const userId = req.params.id;

    try {
        // Find the user by the provided userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user details
        user.name = name;
        user.username = username;

        // Check if the password field is provided and not empty
        if (password && password.trim() !== '') {
            // Hash the new password and update it
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        // Save the updated user to the database
        await user.save();

        res.json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error('Failed to update user:', error);
        res.status(500).json({ message: 'Failed to update user details' });
    }
};

//Delete User
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by the provided userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user from the database
        await user.deleteOne(); // Or use await User.deleteOne({ _id: userId }); directly

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};
