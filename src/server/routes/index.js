var express = require('express');
var router = express.Router();
var pg = require('pg');
var escape = require('pg-escape');
var knex = require('../knex');
function Movies () {
  return knex('movies');
}


router.get('/', function(req, res, next) {
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
});


module.exports = router;
