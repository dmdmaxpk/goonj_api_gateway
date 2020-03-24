// MIDDLEWARE TO PAYWALL SERVICE: Billing users on APP

const axios = require('axios');
const config = require('../config');
var uniqid = require('uniqid');


// Send OTP
exports.sendOtp = async (req, res) => {
	const transaction_id = getTransactinId();
	const post = req.body;

	// Sending request to logging system
	sendReqBody(req, req.body, 'sendOtp', transaction_id);

	let { data } = await axios.post(`${config.billingService}/user/sendOtp`, post);
	
	// Sending response to logging system
	sendResBody(data);
	
	res.send(data);
};

// Validate OTP
exports.validateOtp = async (req, res) => {
	const transaction_id = getTransactinId();
	const { msisdn, otp, source  } = req.query;
	
	// Sending request to logging system
	sendReqBody(req, req.query, 'validateOtp', transaction_id);
	
	let { data } = await axios.get(`${config.billingService}/user/validateOtp?msisdn=${msisdn}&otp=${otp}&source=${source}`);
	
	// Sending response to logging system
	sendResBody(data);
	
	res.send(data);
};

// Subscription
exports.subscribe = async (req, res) => {
	const transaction_id = getTransactinId();
	const post = req.body;

	// Sending request to logging system
	sendReqBody(req, req.body, 'subscribe', transaction_id);

	let { data } = await axios.post(`${config.billingService}/subscription/subscribeUser`, post);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
};

// Unsubscription
exports.unSubscribe = async (req, res) => {
	const transaction_id = getTransactinId();
	const { key } = req.query;

	// Sending request to logging system
	sendReqBody(req, req.query, 'unSubscribe', transaction_id);

	let { data } = await axios.get(`${config.billingService}/subscription/unsubscribe?key=${key}`);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
};

// Unsubscription without encryption
exports.unSub = async (req, res) => {
	const transaction_id = getTransactinId();
    const { key } = req.query;
	
	// Sending request to logging system
	sendReqBody(req, req.query, 'unSub', transaction_id);

	let { data } = await axios.get(`${config.billingService}/subscription/unsub?key=${key}`);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
};

// Subscription Status
exports.subscriptionStatus = async (req, res) => {
	const transaction_id = getTransactinId();
	const { msisdn } = req.query;

	// Sending request to logging system
	sendReqBody(req, req.query, 'subscriptionStatus', transaction_id);


	let { data } = await axios.get(`${config.billingService}/subscription/checkStatus?msisdn=${msisdn}`);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
};

// Packages details
exports.packages = async (req, res) => {
	const transaction_id = getTransactinId();

	// Sending request to logging system
	sendReqBody(req, req.query, 'packages', transaction_id);

	let { data } = await axios.get(`${config.billingService}/user/packages`);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
};


function getTransactinId(){
	let tId = uniqid('gw_logger-', getCurrentDate());
	return tId;
}

function sendReqBody(req, body, method, transaction_id){
	const postObj = {};
	postObj.req_body = body;
	postObj.source = body.source ? body.source : 'app';
	postObj.transaction_id = transaction_id;
	postObj.service = 'paywall';
	postObj.method = method;
	postObj.complete_body = req;
	axios.post(`${config.loggingService}/logger/logreq`, postObj);
}

function sendResBody(res){
	const postObj = {};
	postObj.transaction_id = res.gw_transaction_id;
	postObj.res_body = res;
	axios.post(`${config.loggingService}/logger/logres`, postObj);
}


// Helper functions
function getCurrentDate() {
    var now = new Date();
    var strDateTime = [
        [now.getFullYear(),
            AddZero(now.getMonth() + 1),
            AddZero(now.getDate())].join("-"),
        [AddZero(now.getHours()),
            AddZero(now.getMinutes())].join(":")];
    return strDateTime;
}

function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}