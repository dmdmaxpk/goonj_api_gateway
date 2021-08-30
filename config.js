const env = 'production';

let microservices = {
    core_service: 'http://10.0.1.76:3000',
    user_or_otp_service: 'http://10.0.1.76:3007',
    subscription_service: 'http://10.0.1.76:3004',
    billing_history_service: 'http://10.0.1.76:3008',
}

let config = {    
    production: {
        port: '5000',
        mongoDbUrl: process.env.MONGODB_URL,     // CMS
        dbName: process.env.MONGODB_NAME,
        loggingService: 'http://10.0.1.76:8000',
        goonjService: 'http://10.0.1.90:9090',
        feedbackService: 'http://10.0.1.76:5006',
        recommenderService: 'http://210.56.27.69:3456',

        microservices: microservices
    }
};

module.exports = config.production;
