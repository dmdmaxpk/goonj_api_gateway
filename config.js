const env = process.env.NODE_ENV || 'development';

let config = {
    development: {
        port: '3000',
        mongoDbUrl: 'mongodb://@127.0.0.1:27017/telenor',     // CMS
        dbName: 'telenor',
        billingService: 'http://127.0.0.1:3005',
        paymentService: 'http://127.0.0.1:5000',
        goonjService: 'http://127.0.0.1:3000'
    },
    staging: {
        port: process.env.PORT,
        mongoDbUrl: process.env.MONGODB_URL,     // CMS
        dbName: process.env.MONGODB_NAME,
        billingService: process.env.BILLING_SERVICE,
        paymentService: process.env.PAYMENT_SERVICE,
        goonjService: process.env.GOONJ_SERVICE
    },
    production: {
        port: process.env.PORT,
        mongoDbUrl: process.env.MONGODB_URL,     // CMS
        dbName: process.env.MONGODB_NAME,
        billingService: process.env.BILLING_SERVICE,
        paymentService: process.env.PAYMENT_SERVICE,
        goonjService: process.env.GOONJ_SERVICE
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
