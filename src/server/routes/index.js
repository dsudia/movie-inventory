var express = require('express');
var router = express.Router();
var pg = require('pg');
var escape = require('pg-escape');
var pgpOptions = {
  promiseLib: Promise,
};
var pgp = require('pg-promise')(pgpOptions);
require('dotenv').config();
var cn = 'postgres://localhost:5432/movie_inventory_crud';
var db = pgp(cn);

router.get('/', function(req, res, next) {
  db.many("select * from movies")
    .then(function (data) {
      console.log(data);
      return data;
    })
    .then(function (data) {
      res.render('index', {movies: data});
    });
});

module.exports = router;
