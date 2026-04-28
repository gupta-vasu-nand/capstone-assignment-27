const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: false
    },
    publishedYear: {
        type: Number,
        required: false
    }
});

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: false
    },
    books: [bookSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Author', authorSchema);