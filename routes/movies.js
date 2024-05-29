const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render('movies', { movies });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a new movie
router.post('/', async (req, res) => {
  const { title, year, genre, rating, description } = req.body;
  const movie = new Movie({ title, year, genre, rating, description });

  try {
    await movie.save();
    res.redirect('/movies');
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.render('movie', { movie });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
