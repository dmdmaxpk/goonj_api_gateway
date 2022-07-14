const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const router = require('./router');
const config = require('./config');
const swStats = require('swagger-stats');
const cors = require('cors');

// added a comment

const app = express();
app.use(swStats.getMiddleware({}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
// app.use(cors({
//     origin: '*',
//     methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH', 'OPTIONS']
// }));

app.use('/', router);

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


