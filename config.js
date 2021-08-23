const env = process.env.NODE_ENV || 'development';

let microservices = {
    core_service: 'http://127.0.0.1:3000/',
    user_or_otp_service: 'http://127.0.0.1:3007/',
    subscription_service: 'http://127.0.0.1:3004/',
    billing_history_service: 'http://127.0.0.1:3008/',
}


let config = {
    development: {
        port: '3000',
        mongoDbUrl: 'mongodb://127.0.0.1:27017/telenor',
        dbName: 'telenor',
        billingService: 'http://127.0.0.1:5000',
        paymentService: 'http://127.0.0.1:5000',
        loggingService: 'http://127.0.0.1:8000',
        goonjService: 'http://127.0.0.1:3000',
        feedbackService: 'http://127.0.0.1:5006',
        recommenderService: 'http://210.56.27.69:3456',

        microservices: microservices
    },

    staging: {
        port: process.env.PORT,
        mongoDbUrl: process.env.MONGODB_URL,     // CMS
        dbName: process.env.MONGODB_NAME,
        billingService: process.env.BILLING_SERVICE,
        paymentService: process.env.PAYMENT_SERVICE,
        loggingService: process.env.PAYWALL_LOGGING_SERVICE,
        goonjService: process.env.GOONJ_SERVICE,
        feedbackService: process.env.FEEDBACK_SERVICE,
        recommenderService: 'http://210.56.27.69:3456',

        microservices: microservices
    },
    
    production: {
        port: process.env.PORT,
        mongoDbUrl: process.env.MONGODB_URL,     // CMS
        dbName: process.env.MONGODB_NAME,
        billingService: process.env.BILLING_SERVICE,
        paymentService: process.env.PAYMENT_SERVICE,
        loggingService: process.env.PAYWALL_LOGGING_SERVICE,
        goonjService: process.env.GOONJ_SERVICE,
        feedbackService: process.env.FEEDBACK_SERVICE,
        recommenderService: 'http://210.56.27.69:3456',

        microservices: microservices
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
