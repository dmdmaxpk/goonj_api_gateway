const axios = require('axios');
const config = require('../config');


exports.sendOtp = async (req, res) => {

	const post = req.body;
	console.log(post);

	let { data } = await axios.post(`${config.billingService}/user/sendOtp`, post);
	console.log('Send OTP: ', data);
	res.send(data);
};

exports.validateOtp = async (req, res) => {

	const { msisdn, otp, source  } = req.query;

	let { data } = await axios.get(`${config.billingService}/user/validateOtp?msisdn=${msisdn}&otp=${otp}&source=${source}`);	// Replace it with user service

	console.log('Validate OTP: ', data);
	res.send(data);
};

exports.subscribe = async (req, res) => {

	const post = req.body;
	console.log(post);

	let { data } = await axios.post(`${config.billingService}/subscription/subscribeUser`, post);
	console.log('Subscribe: ', data);
	res.send(data);
};

exports.unSubscribe = async (req, res) => {

	const { msisdn } = req.query;

	let { data } = await axios.get(`${config.billingService}/subscription/unsubscribe?msisdn=${msisdn}`);
	console.log('UnSubscribe: ', data);
	res.send(data);
};

exports.subscriptionStatus = async (req, res) => {

	const { msisdn } = req.query;
	// console.log('Req-----------:\n\n', req);
	// console.log('Headers-----------:\n\n', req.headers);


	let { data } = await axios.get(`${config.billingService}/subscription/checkStatus?msisdn=${msisdn}`);	// Replace it with user service

	console.log('Subscription status: ', data);
	res.send(data);
};

exports.packages = async (req, res) => {

	let { data } = await axios.get(`${config.billingService}/user/packages`);	// Replace it with user service

	res.send(data);
};

