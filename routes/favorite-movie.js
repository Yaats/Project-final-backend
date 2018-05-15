const express = require ('express');
const favMovrouter = express.Router ();
const Favorite = require ('../models/favorite-model');

favMovrouter.post ('/', (req, res, next) => {
  Favorite.create ({
    user: req.user._id,
    category: 'movie',
    title: req.body.title,
    details: req.body,
  }).then (fav => {
    res.json (fav);
  });
});

module.exports = favMovrouter;
