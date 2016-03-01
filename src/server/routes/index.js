var express = require('express');
var router = express.Router();
var pg = require('pg');
var escape = require('pg-escape');
var knex = require('../knex');
function Movies () {
  return knex('movies');
}


router.get('/', function(req, res, next) {
  if (Object.keys(req.query).length === 0) {
    Movies().select()
      .then(function(data) {
        res.render('index', {movies: data});
      });
  } else {
    var key = Object.keys(req.query);
    key = key[0];
    var val = req.query[key];
    console.log(key, val);
    Movies().select().orderBy(key, val)
      .then(function (data) {
        console.log(data);
        return data;
      }).catch(function (error) {
        console.log(error);
      })
      .then(function (data) {
        res.render('index', {movies: data});
      });
  }
});

router.get('/movies/new', function(req, res, next) {
  res.render('new');
});

router.post('/movies', function(req, res, next) {
  var newMov = req.body;
  Movies().insert
  ({title: newMov.title,
    description: newMov.description,
    image_url: newMov.image_url,
    year: newMov.year,
    rating: newMov.rating,
    notes: newMov.notes,
    type: newMov.type})
    .catch(function(error) {
      console.log(error);
    })
    .then(function(data) {
      console.log(data);
      res.redirect('/');
    });
});

router.get('/movies/:id/edit', function(req, res, next) {
  var movieId = req.params.id;
  Movies().where('id', movieId)
  .then(function(data) {
    console.log(data);
    res.render('edit', {movies: data[0]});
  });
});


module.exports = router;
