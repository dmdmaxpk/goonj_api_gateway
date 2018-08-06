const env = process.env.NODE_ENV || 'development';

let config = {
    development: {
        port: '3000',
        mongoDbUrl: 'mongodb://localhost:27017/mongoose',
        dbName: 'mongoose'
    },
    staging: {
        port: '3000',
        mongoDbUrl: 'mongodb://localhost:27017/mongoose',
        dbName: 'mongoose'
    },
    production: {
        port: '3000',
        mongoDbUrl: 'mongodb://localhost:27017/mongoose',   // TODO: Setting it to Env Variable
        dbName: 'mongoose'
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
