var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:Pqb$nw5K&R@40.114.198.154:1999/todo';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/api/todoitems', function(req, res) {

    var results = [];

    pg.connect(connectionString, function(err, pgClient, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        var query = pgClient.query("SELECT * FROM todoItems ORDER BY id ASC;");

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

});


router.post('/api/todoitems', function(req, res) {

    var results = [];

    var httpData = {text: req.body.text, complete: false};

    pg.connect(connectionString, function(err, pgClient, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, httpData: err});
        }

        pgClient.query("INSERT INTO todoItems(itemData, complete) values($1, $2)", [httpData.text, httpData.complete]);

        var query = pgClient.query("SELECT * FROM todoItems ORDER BY id ASC");

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});

router.put('/api/todoitems/:itemId', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.itemId;

    // Grab data from http request
    var data = {text: req.body.text, complete: req.body.complete};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, pgClient, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        pgClient.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

        // SQL Query > Select Data
        var query = pgClient.query("SELECT * FROM todoItems ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});


router.delete('/api/todoitems/:itemId', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.itemId;


    // Get a Postgres pgClient from the connection pool
    pg.connect(connectionString, function(err, pgClient, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        pgClient.query("DELETE FROM todoItems WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = pgClient.query("SELECT * FROM todoItems ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

module.exports = router;
