const env = process.env.NODE_ENV || 'development';

let microservices = {
    core_service: 'http://10.0.1.76:3000',
    user_or_otp_service: 'http://10.0.1.76:3007',
    subscription_service: 'http://10.0.1.76:3004',
    billing_history_service: 'http://10.0.1.88:3008',
    sync_retrieval_service: 'http://10.0.1.88:3009',
    report_service: 'http://10.0.1.88:3011',
    production_billing_history_service: 'http://10.0.1.76:3008',
}

let config = {
    development: {
        port: '3000',
        mongoDbUrl: 'mongodb://127.0.0.1:27017/telenor',     // CMS
        dbName: 'telenor',

        loggingService: 'http://10.0.1.76:8000',
        goonjService: 'http://10.0.1.90:9090',
        feedbackService: 'http://10.0.1.76:5006',
        recommenderService: 'http://210.56.27.69:3456',
        microservices: microservices
    },
    staging: {
        port: process.env.PORT,
        mongoDbUrl: process.env.MONGODB_URL,     // CMS
        dbName: process.env.MONGODB_NAME,

        loggingService: 'http://10.0.1.76:8000',
        goonjService: 'http://10.0.1.90:9090',
        feedbackService: 'http://10.0.1.76:5006',
        recommenderService: 'http://210.56.27.69:3456',
        microservices: microservices
    },
    production: {
        port: process.env.PORT,
        mongoDbUrl: process.env.MONGODB_URL,     // CMS
        dbName: process.env.MONGODB_NAME,

        loggingService: 'http://10.0.1.76:8000',
        goonjService: 'http://10.0.1.90:9090',
        feedbackService: 'http://10.0.1.76:5006',
        recommenderService: 'http://210.56.27.69:3456',
        microservices: microservices
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
