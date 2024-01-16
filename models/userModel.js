const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
            // You can make role optional if needed
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },


});
// Hash password before saving to the database

// userSchema.pre('save', async function(next) {
// const user = this;
// if (!user.isModified('password')) return next()
// try {
// const hashedPassword = await bcrypt.hash(user.password, 10);
// user.password = hashedPassword;
// next();
// } catch (error) {
// return next(error);
// }
// });


const User = mongoose.model('User', userSchema);

module.exports = User;