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
        port: process.env.PORT,
        mongoDbUrl: process.env.MONGODB_URL,  // mongo is the name of the servie //
        dbName: process.env.MONGODB_URL,
        billingService: process.env.BILLING_SERVICE,
        goonjService: process.env.GOONJ_SERVICE
    },
    production: {
        port: process.env.PORT,
        mongoDbUrl: process.env.MONGODB_URL,  // mongo is the name of the servie //
        dbName: process.env.MONGODB_URL,
        billingService: process.env.BILLING_SERVICE,
        goonjService: process.env.GOONJ_SERVICE
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
