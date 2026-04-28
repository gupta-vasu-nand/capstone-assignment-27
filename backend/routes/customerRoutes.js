const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get all customers with their orders
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new customer
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;
        const customer = new Customer({ name, email });
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add order to customer (One-to-Many)
router.post('/:customerId/orders', async (req, res) => {
    try {
        const { customerId } = req.params;
        const { item } = req.body;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        customer.orders.push({ item });
        await customer.save();

        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get customer with all orders
router.get('/:customerId', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status
router.put('/:customerId/orders/:orderId', async (req, res) => {
    try {
        const { customerId, orderId } = req.params;
        const { status } = req.body;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const order = customer.orders.id(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = status;
        await customer.save();

        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete specific order
router.delete('/:customerId/orders/:orderId', async (req, res) => {
    try {
        const { customerId, orderId } = req.params;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const orderIndex = customer.orders.findIndex(order => order._id.toString() === orderId);
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }

        customer.orders.splice(orderIndex, 1);
        await customer.save();

        res.json({ message: 'Order deleted successfully', customer });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;