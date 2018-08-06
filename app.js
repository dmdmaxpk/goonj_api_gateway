const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const router = require('./router');
const config = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

let db;

// Initialize connection once
MongoClient.connect(config.mongoDbUrl, { useNewUrlParser: true, poolSize: 10 }, function(err, client) {    // TODO: Check if increasing/decreasing poolSize has any effect
    if(err) throw err;

    db = client.db(config.dbName);
    app.locals.db = db;     // Setting the db variable globally so that it can be accessed by routes

    // Start the application after the database connection is ready
    app.set('port', config.port);

    const server = app.listen(app.get('port'), () => {
        console.log(`API Gateway running → PORT ${server.address().port}`);
    });
});


