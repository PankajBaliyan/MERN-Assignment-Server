const express = require('express');
const session = require('express-session');
const passport = require('passport');

// env setup
require('dotenv').config();

// Routes Import
const authRoutes = require('./routes/authRoutes');

// eslint-disable-next-line no-unused-vars
const passportConfig = require('./passportConfig');
const { connectMongoose } = require('./database-setup');

const app = express();
const PORT = process.env.PORT;
const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;

//cors setup
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: SESSION_SECRET_KEY,
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            // secure: true //for https not for localhost
            // 1000 milliseconds
            expires: Date.now * 1000 * 60 * 60 * 24,
            maxAge: 1000 * 60 * 60 * 24,
        },
    }),
);
// Initialize Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectMongoose();

// Routes
app.use(authRoutes);

// Start server
app.listen(PORT, () =>
    console.log(`Server listening on port http://localhost:${PORT}`),
);
