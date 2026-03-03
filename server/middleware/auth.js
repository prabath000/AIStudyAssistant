const jwt = require('jsonwebtoken');

const User = require('../models/User');

const protect = async (req, res, next) => {
    console.log('Protect Middleware: next is type:', typeof next);

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Bypass for the removed authentication flow
            if (token === 'mock-token') {
                let guestUser = await User.findOne({ email: 'guest@aistudyassistant.com' });
                if (!guestUser) {
                    guestUser = await User.create({
                        username: 'Guest User',
                        email: 'guest@aistudyassistant.com',
                        password: 'guestpassword123!'
                    });
                }
                req.user = guestUser;
                return next();
            }

            console.log('Verifying Token:', token.substring(0, 10) + '...');
            token = req.headers.authorization.split(' ')[1];
            console.log('Verifying Token:', token.substring(0, 10) + '...');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded Token:', decoded);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log('User not found for ID:', decoded.id);
                return res.status(401).json({ message: 'User not found' });
            }

            return next();
        } catch (error) {
            console.error('Auth Middleware Error:', error.name, '-', error.message);
            return res.status(401).json({
                message: 'Not authorized, token failed',
                debug: error.message
            });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};


module.exports = { protect };
