// MIDDLEWARE TO PAYWALL SERVICE: Billing users on APP

const axios = require('axios');
const config = require('../config');


// Send OTP
exports.sendOtp = async (req, res) => {
	const post = req.body;

	let { data } = await axios.post(`${config.billingService}/user/sendOtp`, post);
	
	res.send(data);
};

// Validate OTP
exports.validateOtp = async (req, res) => {
	const { msisdn, otp, source  } = req.query;
	
	let { data } = await axios.get(`${config.billingService}/user/validateOtp?msisdn=${msisdn}&otp=${otp}&source=${source}`);
	
	
	res.send(data);
};

// Subscription
exports.subscribe = async (req, res) => {
	const post = req.body;

	

	let { data } = await axios.post(`${config.billingService}/subscription/subscribeUser`, post);
	
	
	res.send(data);
};

// Unsubscription
exports.unSubscribe = async (req, res) => {
	
	const { key } = req.query;

	

	let { data } = await axios.get(`${config.billingService}/subscription/unsubscribe?key=${key}`);
	
	
	res.send(data);
};

// Unsubscription without encryption
exports.unSub = async (req, res) => {
	const { key } = req.query;
	
	let { data } = await axios.get(`${config.billingService}/subscription/unsub?key=${key}`);
	
	res.send(data);
};

// Subscription Status
exports.subscriptionStatus = async (req, res) => {

	const { msisdn } = req.query;


	let { data } = await axios.get(`${config.billingService}/subscription/checkStatus?msisdn=${msisdn}`);
	
	res.send(data);
};

// Packages details
exports.packages = async (req, res) => {
	

	let { data } = await axios.get(`${config.billingService}/user/packages`);
	
	
	res.send(data);
};