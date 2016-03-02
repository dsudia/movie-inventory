var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../knex');
function Movies () {
  return knex('movies');
}

function Borrowers () {
  return knex('borrowers');
}


router.get('/', function(req, res, next) {
  if (Object.keys(req.query).length === 0) {
    Movies().select('movies.id', 'movies.title', 'movies.description', 'movies.image_url', 'movies.rented', 'borrowers.first_name', 'borrowers.last_name')
    .leftJoin('borrowers', 'movies.borrower_id', 'borrowers.id')
      .then(function(data) {
        console.log(data);
        res.render('index', {movies: data});
      });
  } else {
    var key = Object.keys(req.query);
    key = key[0];
    var val = req.query[key];
    console.log(key, val);
    Movies().select('movies.id', 'movies.title', 'movies.descrip', 'movies.image_url', 'movies.rented', 'borrowers.first_name', 'borrowers.last_name')
    .leftJoin('borrowers', 'movies.borrower_id', 'borrowers.id')
    .orderBy(key, val)
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

router.post('/movies/:id/edit', function(req, res, next) {
  var movieId = req.params.id;
  console.log('The movie id is ' + movieId);
  var movInfo = req.body;
  console.log(movInfo);
  Movies().where('id', movieId).update({
    title: movInfo.title,
    description: movInfo.description,
    image_url: movInfo.image_url,
    year: movInfo.year,
    rating: movInfo.rating,
    notes: movInfo.notes,
    type: movInfo.type
  }).catch(function(error) {
    console.log(error);
  }).then(function(data) {
    res.redirect('/');
  });
});

router.post('/movies/:id/delete', function(req, res, next) {
  var movieId = req.params.id;
  var movInfo = req.body;
  Movies().where('id', movieId).del()
  .catch(function(err) {
    console.log(err);
  }).then(function(data) {
    res.redirect('/');
  });
});

router.post('/api/movies/:id/borrow', function(req,res, next) {
  var rentData = req.body;
  var borrowerId;
  function borrow () {
    return Borrowers().select().where({
      first_name: rentData.first_name,
      last_name: rentData.last_name
    }).then(function(data) {
      console.log('This is all the ' + data);
      if (data == '') {
        console.log('in the if')
        return Borrowers().insert({
          first_name: rentData.first_name,
          last_name: rentData.last_name,
          email: rentData.email
        }).then(function() {
          borrow();
        });
      } else {
        return data;
      }
    }).then(function(data) {
      console.log('The final data is ' + data);
      return Movies().update({
        rented: true,
        borrower_id: data[0].id,
        date_borrowed: rentData.date_borrowed})
      .where('id', rentData.id)
      .then(function() {
        res.redirect('/');
      });
    });
  }

  console.log(rentData);
  if (!rentData.first_name || !rentData.last_name || !rentData.email || !rentData.date_borrowed || !rentData.id) {
    res.status(400).send('You didn\'t include all in the information');
  } else {
    borrow();
  }
});

router.post('/api/movies/:id/return', function(req,res, next) {
  var rentData = req.body;
  console.log(rentData);
  if (!rentData.first_name || !rentData.last_name || !rentData.email || !rentData.date_borrowed || !rentData.id) {
    res.status(400).send('You didn\'t include a name');
  } else {
    Movies().update({
        rented: false,
        borrower_id: null,
        date_borrowed: null})
      .where('id', rentData.id)
      .catch(function(err) {
        res.status(400).send(err);
      })
      .then(function() {
        res.redirect('/');
      });
  }
});



module.exports = router;
