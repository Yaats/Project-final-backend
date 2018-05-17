const express = require ('express');
const router = express.Router ();
const axios = require ('axios');
var books = require ('google-books-search');

//  GET MOVIES

const moviesDb = axios.create ({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.API_MOVIES_KEY,
    include_adult: false,
  },
});

// List of movies in home page sorted by vote_count.desc

router.get ('/movies', function (req, res, next) {
  moviesDb
    .get ('/discover/movie/', {
      params: {
        sort_by: 'vote_average.desc',
        sort_by: 'popularity.desc',
      },
    })
    .then (result => {
      // console.log ('ca marche!!!!!! 🚀');
      res.json (result.data);
    })
    .catch (err => {
      console.log ('this is the error WTF ERROR 🚧', err);
      next (err);
    });
});

// List of series in home page sorted by popularity

router.get ('/series', function (req, res, next) {
  moviesDb
    .get ('/tv/popular', {
      params: {
        sort_by: 'vote_average.desc',
        sort_by: 'popularity.desc',
      },
    })
    .then (result => {
      res.json (result.data);
    })
    .catch (err => {
      next (err);
    });
});

// get movie by genre

router.get ('/reco/movies', function (req, res, next) {
  if (!req.user) {
    const err = new Error ('Need to be logged in for recos');
    next (err);
    return;
  }

  moviesDb
    .get (`/discover/movie`, {
      params: {
        sort_by: 'vote_average.desc',
        sort_by: 'popularity.desc',
        with_genres: req.user.interestedIn.join ('|'),
      },
    })
    .then (result => {
      console.log ('trobien');
      res.json (result.data);
    })
    .catch (err => {
      console.log ('trobizaeazen');
      next (err);
    });
});

// get serie by genre

router.get ('/reco/series', function (req, res, next) {
  if (!req.user) {
    const err = new Error ('Need to be logged in for recos');
    next (err);
    return;
  }

  moviesDb
    .get (`/discover/tv`, {
      params: {
        sort_by: 'vote_average.desc',
        sort_by: 'popularity.desc',
        with_genres: req.user.interestedInSerie.join ('|'),
      },
    })
    .then (result => {
      console.log ('trobien');
      res.json (result.data);
    })
    .catch (err => {
      console.log ('trobizaeazen');
      next (err);
    });
});

const eventsDb = axios.create ({
  baseURL: 'https://api.paris.fr/api/data/2.2/QueFaire',
  params: {
    token: process.env.API_EVENTPARIS_TOKEN,
  },
});

router.get ('/events', function (req, res, next) {
  eventsDb
    .get ('/get_events/', {
      params: {
        categories: '',
        tags: '',
        start: 0,
        end: '',
        offset: '',
        limit: '',
      },
    })
    .then (result => {
      res.json (result.data);
    })
    .catch (err => {
      console.log ('WTF ERROR 🥗');
      next (err);
    });
});

// get events by genres
router.get ('/reco/events', function (req, res, next) {
  if (!req.user) {
    const err = new Error ('Need to be logged in for recos');
    next (err);
    return;
  }

  eventsDb
    .get (`/get_events`, {
      params: {
        categories: req.user.interestedInEvent.join (','),
        tags: '',
        start: 0,
        end: '',
        offset: '',
        limit: '',
      },
    })
    .then (result => {
      console.log ('trobien', req.user.interestedInEvent);
      res.json (result.data);
    })
    .catch (err => {
      console.log ('trobizaeazen les events');
      next (err);
    });
});

//  get books on home page

router.get ('/books', (req, res, next) => {
  var options = {
    key: process.env.API_BOOK_KEY,
    field: 'subject',
    offset: 0,
    type: 'books',
    order: 'newest',
    lang: 'en',
    limit: '20',
  };

  books.search ('thriller', options, function (error, results) {
    if (!error) {
      res.json (results);
    } else {
      console.log (error);
    }
  });
});

//  get reco books

router.get ('/reco/books', (req, res, next) => {
  if (req.user.interestedInBook == drama) {
    var options = {
      key: process.env.API_BOOK_KEY,
      field: 'subject',
      offset: 0,
      type: 'books',
      order: 'newest',
      lang: 'en',
      limit: '20',
    };

    books.search ('drama', options, function (error, results) {
      if (!error) {
        res.json (results);
      } else {
        console.log (error);
      }
    });
  }
});

module.exports = router;
