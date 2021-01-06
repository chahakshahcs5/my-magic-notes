const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId, required: true, ref: 'User'
    }
});

module.exports = mongoose.model('Note', notesSchema);



