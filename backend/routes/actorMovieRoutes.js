const express = require('express');
const router = express.Router();
const Actor = require('../models/Actor');
const Movie = require('../models/Movie');

// ============= ACTOR ROUTES =============

// Get all actors with their movies
router.get('/actors', async (req, res) => {
    try {
        const actors = await Actor.find().populate('movies');
        res.json(actors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new actor
router.post('/actors', async (req, res) => {
    try {
        const { name, age } = req.body;
        const actor = new Actor({ name, age });
        await actor.save();
        res.status(201).json(actor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get single actor with movies
router.get('/actors/:actorId', async (req, res) => {
    try {
        const actor = await Actor.findById(req.params.actorId).populate('movies');
        if (!actor) {
            return res.status(404).json({ error: 'Actor not found' });
        }
        res.json(actor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= MOVIE ROUTES =============

// Get all movies with their actors
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find().populate('actors');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new movie
router.post('/movies', async (req, res) => {
    try {
        const { title, releaseYear, genre } = req.body;
        const movie = new Movie({ title, releaseYear, genre });
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get single movie with actors
router.get('/movies/:movieId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId).populate('actors');
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= ASSIGNMENT ROUTES (Many-to-Many) =============

// Assign actor to movie (and movie to actor)
router.post('/assign', async (req, res) => {
    try {
        const { actorId, movieId } = req.body;

        if (!actorId || !movieId) {
            return res.status(400).json({ error: 'Both actorId and movieId are required' });
        }

        const actor = await Actor.findById(actorId);
        const movie = await Movie.findById(movieId);

        if (!actor || !movie) {
            return res.status(404).json({ error: 'Actor or Movie not found' });
        }

        // Check if already assigned to avoid duplicates
        if (!actor.movies.includes(movieId)) {
            actor.movies.push(movieId);
            await actor.save();
        }

        if (!movie.actors.includes(actorId)) {
            movie.actors.push(actorId);
            await movie.save();
        }

        const updatedActor = await Actor.findById(actorId).populate('movies');
        const updatedMovie = await Movie.findById(movieId).populate('actors');

        res.json({
            message: 'Successfully assigned actor to movie',
            actor: updatedActor,
            movie: updatedMovie
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Remove actor from movie
router.delete('/assign', async (req, res) => {
    try {
        const { actorId, movieId } = req.body;

        const actor = await Actor.findById(actorId);
        const movie = await Movie.findById(movieId);

        if (!actor || !movie) {
            return res.status(404).json({ error: 'Actor or Movie not found' });
        }

        actor.movies = actor.movies.filter(id => id.toString() !== movieId);
        movie.actors = movie.actors.filter(id => id.toString() !== actorId);

        await actor.save();
        await movie.save();

        res.json({ message: 'Successfully removed assignment' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all movies for a specific actor
router.get('/actors/:actorId/movies', async (req, res) => {
    try {
        const actor = await Actor.findById(req.params.actorId).populate('movies');
        if (!actor) {
            return res.status(404).json({ error: 'Actor not found' });
        }
        res.json(actor.movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all actors for a specific movie
router.get('/movies/:movieId/actors', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId).populate('actors');
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie.actors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;