const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../models/userModel');
const { Session } = require('../models/session'); // Import the Session model


exports.showLoginForm = (req, res) => {
    res.render('Login/login', { pageTitle: 'login' });



};



exports.loginUser = async(req, res) => {

    try {

        const { email, password } = req.body;
        console.log('Request Body:', req.body);
        const user = await User.findOne({ email });
        console.log('user', user)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log('Invalid email or password:', password);
            console.log('Hashed Password:', user.password);

            return res.status(401).render('Login/login', { error: 'Invalid email or password', pageTitle: 'login' });
        }

        // Generate JWT token
        const token = jwt.sign({ user: user._id, email: user.email }, 'arm9803.', { expiresIn: '1h' });
        console.log('token', token)
            // Save the session in the database
        const session = new Session({ user: user._id, token });
        await session.save();

        console.log('session', session)
            // Set the token in a cookie
        res.cookie('jwt', token, { httpOnly: true, secure: true });

        res.redirect('/book'); // Adjust the route as needed 


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

exports.showRegistrationForm = (req, res) => {
    //res.render('SignUp/singUp', { pageTitle: 'Sign Up' });
    const errorMessage = req.query.error || ''; // Retrieve error message from query parameter
    console.log('Error Message:', errorMessage); // Add this line for debugging

    res.render('SignUp/singUp', { pageTitle: 'Sing Up', errorMessage });
};


exports.registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            // return res.status(400).json({ message: 'User with this email already exists' });
            // Handle the case where the user already exists
            return res.redirect('/signup?error=User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role: 'user' });

        await user.save();

        // Redirect to login page after successful registration
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

exports.logoutUser = async(req, res) => {

    try {
        // Check if JWT cookie exists
        if (!req.cookies.jwt) {
            // Redirect to login page if no token is present
            return res.redirect('/login');
        }

        // Remove the session from the database
        await Session.findOneAndRemove({ token: req.cookies.jwt });

        // Clear the cookie
        res.clearCookie('jwt');

        // Redirect to login page after successful logout
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging out' });
    }
};