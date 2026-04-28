const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    releaseYear: {
        type: Number,
        required: false
    },
    genre: {
        type: String,
        required: false
    },
    actors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);