const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    }
});

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    orders: [orderSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);