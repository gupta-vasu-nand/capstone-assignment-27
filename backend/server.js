const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import all routes
const personRoutes = require('./routes/personRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authorRoutes = require('./routes/authorRoutes');
const actorMovieRoutes = require('./routes/actorMovieRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
console.log("Mongo URL:", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Routes
app.use('/persons', personRoutes);
app.use('/customers', customerRoutes);
app.use('/authors', authorRoutes);
app.use('/', actorMovieRoutes); // for actors, movies, and assign

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));