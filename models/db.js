const mongoose = require('mongoose');

const db = async() => {
    try {

        const conn = mongoose.connect('mongodb+srv://armankhachaturians:arm9803.@cluster0.epoudum.mongodb.net/moviesDB');
        console.log("MongoDB connected");
    } catch (err) {
        console.log(err);
    }

}




module.exports = db;