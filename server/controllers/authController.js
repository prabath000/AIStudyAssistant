const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ username, email, password });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Registration Error:', error);

        // Specific handling for common errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed. Please check your inputs.' });
        }

        if (error.name === 'MongoNetworkError' || error.message.includes('topology')) {
            return res.status(500).json({
                message: 'Database connection failed. Please check if MONGODB_URI is correctly configured.'
            });
        }

        res.status(500).json({ message: error.message || 'An unexpected error occurred during registration.' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res, next) => {
    console.log('getMe Controller: next is type:', typeof next);
    res.json(req.user);
};

