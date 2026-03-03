const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    console.log('--- REGISTER REQUEST RECEIVED ---');
    console.log('Body:', req.body);
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
    console.log('--- LOGIN REQUEST RECEIVED ---');
    console.log('Email:', req.body.email);
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
    res.json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            await User.deleteOne({ _id: req.user._id });
            res.json({ message: 'User account deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

