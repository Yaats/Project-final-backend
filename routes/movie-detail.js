const express = require ('express');
const mongoose = require ('mongoose');
const router = express.Router ();
const axios = require ('axios');
const User = require ('../models/user-model');

//  GET MOVIES

const moviesDb = axios.create ({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.API_MOVIES_KEY,
    include_adult: false,
  },
});

// GET /:movieId
router.get ('/:movieId', (req, res, next) => {
  moviesDb
    .get (`/movie/${req.params.movieId}`)
    .then (movie => {
      if (!movie) {
        next ();
        return;
      }
      res.json (movie.data);
    })
    .catch (err => {
      next (err);
    });
});

module.exports = router;
