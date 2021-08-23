const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const router = require('./router');
const config = require('./config');
const swStats = require('swagger-stats');

const cors = require('cors');

const app = express();
app.use(swStats.getMiddleware({}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

let db;

// Initialize MongoDB connection
MongoClient.connect(config.mongoDbUrl, { useNewUrlParser: true, poolSize: 10 }, function(err, client) {
    if(err) throw err;

    db = client.db(config.dbName);
    app.locals.db = db;     // Setting the db variable in locals so that it can be accessed by route handlers

    // Start the application after the database connection is ready
    let {port} = config;
    app.listen(port, () => console.log(`API Gateway running on PORT ${port}`));
});


