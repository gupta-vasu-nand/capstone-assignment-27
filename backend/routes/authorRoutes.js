const express = require('express');
const router = express.Router();
const Author = require('../models/Author');

// Get all authors with their books
router.get('/', async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new author
router.post('/', async (req, res) => {
    try {
        const { name, country } = req.body;
        const author = new Author({ name, country });
        await author.save();
        res.status(201).json(author);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add book to author (Many-to-One from book perspective)
router.post('/:authorId/books', async (req, res) => {
    try {
        const { authorId } = req.params;
        const { title, isbn, publishedYear } = req.body;

        const author = await Author.findById(authorId);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        author.books.push({ title, isbn, publishedYear });
        await author.save();

        res.json(author);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get author with all books
router.get('/:authorId', async (req, res) => {
    try {
        const author = await Author.findById(req.params.authorId);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.json(author);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all books by a specific author
router.get('/:authorId/books', async (req, res) => {
    try {
        const author = await Author.findById(req.params.authorId);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.json(author.books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete specific book from author
router.delete('/:authorId/books/:bookId', async (req, res) => {
    try {
        const { authorId, bookId } = req.params;

        const author = await Author.findById(authorId);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        const bookIndex = author.books.findIndex(book => book._id.toString() === bookId);
        if (bookIndex === -1) {
            return res.status(404).json({ error: 'Book not found' });
        }

        author.books.splice(bookIndex, 1);
        await author.save();

        res.json({ message: 'Book deleted successfully', author });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;