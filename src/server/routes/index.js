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
    knex.select().table('movies')
      .then(function(data) {
        res.render('index', {movies: data});
      });
  } else {
    var key = Object.keys(req.query);
    key = key[0];
    var val = req.query[key];
    console.log(key, val);
    knex.select().table('movies').orderBy(key, val)
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
  knex('movies').insert
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


module.exports = router;
