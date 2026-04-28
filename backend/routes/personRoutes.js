const express = require('express');
const router = express.Router();
const Person = require('../models/Person');

// Get all persons with their passports
router.get('/', async (req, res) => {
    try {
        const persons = await Person.find();
        res.json(persons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new person
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const person = new Person({ name });
        await person.save();
        res.status(201).json(person);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add passport to a person (One-to-One)
router.post('/:personId/passport', async (req, res) => {
    try {
        const { personId } = req.params;
        const { number } = req.body;

        const person = await Person.findById(personId);
        if (!person) {
            return res.status(404).json({ error: 'Person not found' });
        }

        // Check if person already has a passport
        if (person.passport) {
            return res.status(400).json({ error: 'Person already has a passport' });
        }

        person.passport = { number };
        await person.save();

        res.json(person);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get person with passport details
router.get('/:personId', async (req, res) => {
    try {
        const person = await Person.findById(req.params.personId);
        if (!person) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.json(person);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;