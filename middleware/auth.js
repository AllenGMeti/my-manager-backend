// Importing required modules: jsonwebtoken for JWT handling and dotenv for environment variables
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Authentication middleware to protect routes by verifying JWT tokens
function authMiddleware(req, res, next) {
    const token = req.header('Authorization')

    // If no token is provided, block access
    if (!token) {
        return res.status(401).json({ message: 'No token, access denied' })
    }

    try {
        // Verifying the token using the secret key and attach decoded payload to req.user
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        req.user = decoded
        next() // Continuing to the next middleware or route handler
    } catch (err) {
        // If verification fails, respond with unauthorized error
        res.status(401).json({ message: 'Invalid token' })
    }
}

// Exporting middleware so it can be used in route definitions
module.exports = authMiddleware
