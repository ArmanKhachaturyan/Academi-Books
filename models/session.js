const mongoose = require('mongoose');
const { Schema } = mongoose;



const sessionSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = { Session };