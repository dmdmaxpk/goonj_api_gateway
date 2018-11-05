const env = process.env.NODE_ENV || 'development';

let config = {
    development: {
        port: '3000',
        mongoDbUrl: 'mongodb://RootAdmin:password@10.0.1.90:27017/telenor?authSource=admin&readPreference=secondaryPreferred', 
        // mongoDbUrl: 'mongodb://RootAdmin:password@10.3.7.101:27017/telenor?authSource=admin&readPreference=secondaryPreferred',
        // mongoDbUrl: 'mongodb://localhost:27017/mongoose',
        dbName: 'telenor'
    },
    staging: {
        port: '3000',
        mongoDbUrl: 'mongodb://localhost:27017/telenor',
        dbName: 'telenor'
    },
    production: {
        port: '3000',
        mongoDbUrl: 'mongodb://RootAdmin:password@mongo:27017/telenor?authSource=admin&readPreference=secondaryPreferred',  // @mongo is the name of the serview i.e mongo // TODO: Setting it to Env Variable
        dbName: 'telenor'
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
