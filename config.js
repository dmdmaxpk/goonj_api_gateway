const env = process.env.NODE_ENV || 'development';

let config = {
    development: {
        port: '3000',
        // mongoDbUrl: 'mongodb://RootAdmin:password@10.0.1.90:27017/telenor?authSource=admin&readPreference=secondaryPreferred',      // AWS
        mongoDbUrl: 'mongodb://RootAdmin:password@10.3.7.101:27017/telenor?authSource=admin&readPreference=secondaryPreferred',     // CMS
        // mongoDbUrl: 'mongodb://localhost:27017/telenor',
        dbName: 'telenor',
        billingService: 'http://10.0.1.76:3005',
        goonjService: 'http://10.3.7.101:3000'
    },
    staging: {
        port: '3000',
        mongoDbUrl: 'mongodb://172.17.0.1:27017/telenor',
        dbName: 'telenor'
    },
    production: {
        port: '3000',
        mongoDbUrl: 'mongodb://RootAdmin:password@mongo:27017/telenor_v2?authSource=admin&readPreference=secondaryPreferred',  // mongo is the name of the servie // TODO: Setting it to Env Variable
        dbName: 'telenor_v2',
        billingService: 'http://10.0.1.76:3005',
        goonjService: 'http://10.0.1.90:9090'
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
