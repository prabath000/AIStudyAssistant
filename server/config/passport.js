const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists via googleId
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with same email (registered normally before)
                const email = profile.emails?.[0]?.value || '';
                if (email) {
                    user = await User.findOne({ email });
                }

                if (user) {
                    // Link the Google account to their existing account
                    user.googleId = profile.id;
                    user.avatar = profile.photos?.[0]?.value || '';
                    await user.save();
                    return done(null, user);
                }

                // Create brand-new user from Google profile
                const newUser = await User.create({
                    googleId: profile.id,
                    username: profile.displayName.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now(),
                    email: email || `${profile.id}@google.custom`,
                    avatar: profile.photos?.[0]?.value || '',
                });

                return done(null, newUser);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

module.exports = passport;
