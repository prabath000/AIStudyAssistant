const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();

// Load passport strategy config
require('./config/passport');

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        // Allow any localhost origin in development
        if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            return callback(null, true);
        }
        // Allow the configured CLIENT_URL in production
        if (origin === process.env.CLIENT_URL) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(passport.initialize());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
});


console.log('--- Server Starting at:', new Date().toLocaleString(), '---');

// DB Connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI || mongoURI.includes('<username>') || mongoURI.includes('<password>')) {
    console.error('CRITICAL ERROR: Invalid MONGODB_URI in .env file.');
    console.error('Please update MONGODB_URI with your actual credentials.');
}

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log('MongoDB: Initial connection successful');
    })
    .catch(err => {
        console.error('MongoDB: Initial connection error:', err.message);
    });

const db = mongoose.connection;

db.once('open', async () => {
    console.log('Mongoose: Connection OPEN (Ready for queries)');
    console.log('Mongoose: Host:', db.host);
    console.log('Mongoose: Database Name:', db.name);
    console.log('Mongoose: readyState:', db.readyState);
    try {
        const ping = await mongoose.connection.db.admin().ping();
        console.log('Mongoose: Database Ping Successful:', ping);
    } catch (err) {
        console.error('Mongoose: Database Ping Failed:', err.message);
    }
});




db.on('error', (err) => {
    console.error('Mongoose: Connection error:', err.message);
});

db.on('disconnected', () => {
    console.log('Mongoose: Disconnected from DB');
});

db.on('reconnected', () => {
    console.log('Mongoose: Reconnected to DB');
});

// Check connection status every 30 seconds
setInterval(() => {
    console.log('Mongoose: Current readyState:', db.readyState);
}, 30000);

mongoose.set('bufferCommands', true);





// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/ai', require('./routes/ai'));

// Basic Route
app.get('/', (req, res) => {
    res.send('AI Study Assistant API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('--- Global Error Handler ---');
    console.error('Error Message:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
