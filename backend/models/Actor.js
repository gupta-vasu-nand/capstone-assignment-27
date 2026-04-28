const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Actor', actorSchema);