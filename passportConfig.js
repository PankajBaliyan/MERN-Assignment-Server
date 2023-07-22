// passportConfig.js

const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('./models/User');

passport.use(
    new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user) {
                    return done(null, false, {
                        message: 'Invalid credentials',
                    });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid credentials',
                    });
                }
            } catch (err) {
                return done(err);
            }
        },
    ),
);

passport.serializeUser(async (user, done) => {
    try {
        done(null, user.id);
    } catch (err) {
        done(err, null);
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
