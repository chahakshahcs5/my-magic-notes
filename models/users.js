const mongoose = require('mongoose');
const { schema } = require('./notes');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date
});

module.exports = mongoose.model('User', usersSchema);



