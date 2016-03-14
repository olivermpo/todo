var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:Pqb$nw5K&R@40.114.198.154:1999/todo';
var winston = require('winston');
//var logger = new winston.Logger();

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'filelog-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error'
    })
  ]
});



/* GET users listing. */
router.get('/', function(request, response, next) {
  response.send('respond with a resource');
});


router.get('/api/todoitems', function(request, response) {

    var results = [];

    pg.connect(connectionString, function(error, pgClient, done) {
        if(error) {
          done();
          console.log(error);
          return response.status(500).json({ success: false, data: error});
        }

        var query = pgClient.query("SELECT * FROM todoItems ORDER BY id ASC;");

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return response.json(results);
        });

    });

});


router.post('/api/todoitems', function(request, response) {

    var results = [];
    logger.info(request.body);
    logger.info(request.body.text);

    var todoItem = {"text" : request.body.text,
                    "createdOn" : new Date()};

                    logger.info(todoItem);
    pg.connect(connectionString, function(error, pgClient, done) {
        if(error) {
          done();
          console.log(error);
          return response.status(500).json({ success: false, httpData: error});
        }

        pgClient.query("INSERT INTO todoItems(itemData, complete) values($1, $2)", [todoItem, false]);

        var query = pgClient.query("SELECT * FROM todoItems ORDER BY id ASC");

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return response.json(results);
        });


    });
});

router.put('/api/todoitems/:itemId', function(request, response) {

    var results = [];

    // Grab data from the URL parameters
    var id = request.params.itemId;

    // Grab data from http request
    var data = {text: request.body.text, complete: request.body.complete};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(error, pgClient, done) {
        // Handle connection errors
        if(error) {
          done();
          console.log(error);
          return response.status(500).send(json({ success: false, data: error}));
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
            return response.json(results);
        });
    });

});


router.delete('/api/todoitems/:itemId', function(request, response) {

    var results = [];

    // Grab data from the URL parameters
    var id = request.params.itemId;


    // Get a Postgres pgClient from the connection pool
    pg.connect(connectionString, function(error, pgClient, done) {
        // Handle connection errors
        if(error) {
          done();
          console.log(error);
          return response.status(500).json({ success: false, data: error});
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
            return response.json(results);
        });
    });

});

module.exports = router;
