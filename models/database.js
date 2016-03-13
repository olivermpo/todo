var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:Pqb$nw5K&R@40.114.198.154:1999/todo';

// var client = new pg.Client(connectionString);
// client.connect();
// var query = client.query('CREATE TABLE todoItems(id SERIAL PRIMARY KEY, itemData jsonb, complete BOOLEAN)');
// query.on('end', function() { client.end(); });
