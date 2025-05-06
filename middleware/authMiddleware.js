const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config(); 
const tokenSecret = process.env.TOKEN_SECRET;

// Rate limiter configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, try again later.',
});

// Request logger middleware
function requestLogger(req, res, next) {
    console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) return res.sendStatus(403); // No token, Forbidden

    jwt.verify(token, process.env.TOKEN_SECRET || 'secret_key', (err, user) => {
        if (err) return res.sendStatus(403); // Token invalid, Forbidden
        req.user = user; // Add user info to request
        next();
    });
}

module.exports = {
    authenticateToken,
    limiter,
    requestLogger,
};

