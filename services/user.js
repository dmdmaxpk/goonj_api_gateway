// MIDDLEWARE TO PAYWALL SERVICE: Billing users on APP

const axios = require('axios');
const config = require('../config');


// Send OTP
exports.sendOtp = async (req, res) => {
	const post = req.body;
	
	await sendReqBody(post, 'sendOtp');
	let { data } = await axios.post(`${config.billingService}/user/sendOtp`, post);
	await sendResBody(data, 'sendOtp');
	
	res.send(data);
};

// Validate OTP
exports.validateOtp = async (req, res) => {
	const { msisdn, otp, source  } = req.query;
	
	await sendReqBody({msisdn:msisdn, otp:otp, source:source}, 'validateOtp');
	let { data } = await axios.get(`${config.billingService}/user/validateOtp?msisdn=${msisdn}&otp=${otp}&source=${source}`);
	await sendResBody(data, 'validateOtp');
	
	res.send(data);
};

// Subscription
exports.subscribe = async (req, res) => {
	const post = req.body;

	await sendReqBody(post, 'subscribe');
	let { data } = await axios.post(`${config.billingService}/subscription/subscribeUser`, post);
	await sendResBody(data, 'subscribe');

	res.send(data);
};

// Unsubscription
exports.unSubscribe = async (req, res) => {
	const { key } = req.query;

	await sendReqBody({key:key}, 'unSubscribe');
	let { data } = await axios.get(`${config.billingService}/subscription/unsubscribe?key=${key}`);
	await sendResBody(data, 'unSubscribe');

	res.send(data);
};

// Unsubscription without encryption
exports.unSub = async (req, res) => {
    const { key } = req.query;
	
	await sendReqBody({key:key}, 'unSub');
    let { data } = await axios.get(`${config.billingService}/subscription/unsub?key=${key}`);
	await sendResBody(data, 'unSub');

	res.send(data);
};

// Subscription Status
exports.subscriptionStatus = async (req, res) => {
	const { msisdn } = req.query;

	await sendReqBody({msisdn:msisdn}, 'subscriptionStatus');
	let { data } = await axios.get(`${config.billingService}/subscription/checkStatus?msisdn=${msisdn}`);
	await sendResBody(data, 'subscriptionStatus');

	res.send(data);
};

// Packages details
exports.packages = async (req, res) => {

	await sendReqBody({}, 'packages');
	let { data } = await axios.get(`${config.billingService}/user/packages`);
	await sendResBody(data, 'packages');
	res.send(data);
};


sendReqBody = async(body, method) => {
	const reqBody = body;
	reqBody.method = method
	await axios.post(`${config.loggingService}/logger/logreq`, reqBody);
}

sendResBody = async(body, method) => {
	const resBody = body;
	resBody.method = method
	await axios.post(`${config.loggingService}/logger/logres`, resBody);
}