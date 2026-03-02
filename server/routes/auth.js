const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth - Step 1: Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google OAuth - Step 2: Google callback
router.get(
    '/google/callback',
    (req, res, next) => {
        passport.authenticate('google', { session: false }, (err, user, info) => {
            if (err) {
                console.error('Passport Google Error:', err);
                fs.writeFileSync('oauth_error.log', JSON.stringify({ err: err.message, stack: err.stack, full: err }, null, 2));
                return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed_err`);
            }
            if (!user) {
                console.error('Passport Google No User:', info);
                fs.writeFileSync('oauth_error.log', JSON.stringify({ info }, null, 2));
                return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed_info`);
            }
            req.user = user;
            next();
        })(req, res, next);
    },
    (req, res) => {
        // Generate JWT for the authenticated user
        const token = jwt.sign({ id: req.user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });
        const user = { _id: req.user._id, username: req.user.username, email: req.user.email, avatar: req.user.avatar, token };
        // Base64 encode the user data
        const base64Data = Buffer.from(JSON.stringify(user)).toString('base64');

        // DEBUG: Logging for troubleshooting
        // Redirect to the frontend callback route with the base64 encoded user data
        const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?data=${encodeURIComponent(base64Data)}`;
        console.log('Redirecting to Auth Callback:', redirectUrl);

        fs.writeFileSync('oauth_redirect_final.log', JSON.stringify({
            redirectUrl,
            clientUrl: process.env.CLIENT_URL,
            timestamp: new Date().toISOString()
        }, null, 2));

        res.redirect(redirectUrl);
    }
);

router.put('/profile', protect, require('../controllers/authController').updateProfile);
router.delete('/account', protect, require('../controllers/authController').deleteAccount);

module.exports = router;
