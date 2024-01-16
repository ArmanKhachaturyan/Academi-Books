const Book = require('../models/bookModel');

exports.getBookList = async(req, res) => {
    try {
        const book = await Book.find();
        res.render('BookMain/book', { book });


    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getBookDetails = async(req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.render('BookDetail/bookDetails', { book });
    } catch (err) {
        console.error(err);
        res.status(404).send('Book not found');
    }
};

exports.getCatalog = async(req, res) => {
    try {
        const book = await Book.find();
        res.render('BookCatalog/catalogBook', { book });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}