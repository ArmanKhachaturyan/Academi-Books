const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController');
const MongoStore = require('connect-mongo');
// const authMiddleware = require('./models/authMiddleware');
// 
// app.use('/login', authMiddleware.authMiddleware);


const db = require('./models/db'); // Assuming db.js is in the same directory
// const Loan = require('./models/loanModel');
const app = express();

const PORT = process.env.PORT || 4561;

// Set EJS as the view engineapp.

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
// Your routes and controllers

// Configure session management
app.use(
    session({
        secret: 'arm9803.', // Change this to a strong, random secret
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: 'mongodb+srv://armankhachaturians:arm9803.@cluster0.epoudum.mongodb.net/moviesDB' }),
    })
);

app.get('/', (req, res) => {
    res.redirect('/Login'); // Redirect to the "/home" route
});
//Book Catalog

app.get('/book', bookController.getBookList);
app.get('/book/:id', bookController.getBookDetails);
app.get('/catalog', bookController.getCatalog);


// Middleware to set locals for views

app.use((req, res, next) => {
    res.locals.currentPath = req.path; // Pass current path to all views
    next();
});
// Routes Login and Registracia
//Login get ....


// User Routes
app.get('/login', userController.showLoginForm);
app.post('/login', userController.loginUser);
app.get('/signup', userController.showRegistrationForm);
app.post('/signup', userController.registerUser);
//app.get('/logout', userController.logoutUser);

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
});



// Start the server

db();
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});