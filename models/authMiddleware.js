const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authenticate = async(req, res, next) => {
    try {
        // Get the token from the request header or cookie
        const token = req.header('Authorization') || req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token missing' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request
        req.user = await User.findById(decoded.userId);

        next();
    } catch (error) {
        console.error(error);

        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }

        res.status(401).json({ message: 'Unauthorized' });
    }
};