const mongoose = require('mongoose');

const passportSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    issuedDate: {
        type: Date,
        default: Date.now
    }
});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    passport: {
        type: passportSchema,
        required: false,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Person', personSchema);