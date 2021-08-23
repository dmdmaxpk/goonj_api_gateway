const axios = require('axios');
const config = require('../config');
var uniqid = require('uniqid');
const router = require('../router');

exports.sendOtp = async (req,res) => {
	const transaction_id = getTransactinId();
	const post = req.body;
	post.gw_transaction_id = transaction_id;

	// Sending request to logging system
	sendReqBody(req, req.body, 'sendOtp', transaction_id);

	axios.post(`${config.microservices.user_or_otp_service}/otp/send`, post)
	.then(function (data) {

		// Sending response to logging system
		sendResBody(data.data);
		res.send(data.data);
	}).catch(err => {
		console.log('sendOtp - Error: ', err);
		res.send({'code': -1, 'message': 'Send Otp Request error!'});
	});
}

exports.verifyOtp = async (req,res) => {
	const transaction_id = getTransactinId();
	const post = req.body;
	post.gw_transaction_id = transaction_id;

	// Sending request to logging system
	sendReqBody(req, req.body, 'verifyOtp', transaction_id);

	let { data } = await axios.post(`${config.microservices.user_or_otp_service}/otp/verify`, post);

	// Sending response to logging system
	sendResBody(data);

	res.send(data);
}

exports.subscribe = async (req,res) => {
	if(req && req.socket.destroyed){
		res.send({code: -1, message: "Socket Destroyed"});
	}else{
		const transaction_id = getTransactinId();
		const post = req.body;
		post.gw_transaction_id = transaction_id;

		let token = req.headers.authorization;
		let headers = {"Content-Type": "application/json"};
		if(token){
			headers = {"Content-Type": "application/json", "Authorization": `${token}`}
		}

		// Sending request to logging system
		sendReqBody(req, req.body, 'subscribe', transaction_id);

		axios.post(`${config.microservices.subscription_service}/subscription/subscribe`, post, {headers:headers})
		.then(function (data) {

			// Sending response to logging system
			sendResBody(data.data);
			res.send(data.data);
		}).catch(err => {
			console.log('subscribe - Error: ', err);
			res.send({'code': -1, 'message': 'Subscribe Request error!'});
		});
	}
}

exports.refresh = async (req,res) => {
	const post = req.body;
	let { data } = await axios.post(`${config.microservices.core_service}/auth/refresh`, post);
	res.send(data);
}

exports.recharge = async (req,res) => {
	const transaction_id = getTransactinId();

	const post = req.body;
	post.gw_transaction_id = transaction_id;

	// Sending request to logging system
	sendReqBody(req, req.body, 'recharge', transaction_id);

	axios.post(`${config.microservices.subscription_service}/subscription/recharge`, post)
	.then(function (data) {

		// Sending response to logging system
		sendResBody(data.data);
		res.send(data.data);
	}).catch(err => {
		console.log('recharge - Error: ', err);
		res.send({'code': -1, 'message': 'Recharge Request error!'});
	});
}

exports.status = async (req,res) => {
	const transaction_id = getTransactinId();

	const post = req.body;
	post.gw_transaction_id = transaction_id;

	// Sending request to logging system
	sendReqBody(req, req.body, 'status', transaction_id);

	let { data } = await axios.post(`${config.microservices.subscription_service}/subscription/status`, post);

	// Sending response to logging system
	sendResBody(data);

	res.send(data);
}

exports.unsubscribe = async (req,res) => {
	const transaction_id = getTransactinId();
	const post = req.body;
	post.gw_transaction_id = transaction_id;

	let token = req.headers.authorization;
	let headers = {"Content-Type": "application/json"};
	if(token){
		headers = {"Content-Type": "application/json", "Authorization": `${token}`}
	}

	// Sending request to logging system
	sendReqBody(req, req.body, 'unsubscribe', transaction_id);

	axios.post(`${config.microservices.subscription_service}/subscription/unsubscribe`, post, {headers:headers})
	.then(function (data) {

		// Sending response to logging system
		sendResBody(data.data);
		res.send(data.data);
	}).catch(err => {
		console.log('unsubscribe - Error: ', err);
		res.send({'code': -1, 'message': 'Unsubscribe Request error!'});
	});
}

exports.sms_unsub = async (req,res) => {
	axios.post(`${config.microservices.subscription_service}/subscription/sms-unsub`, req.body)
	.then(function (data) {
		res.send(data.data);
	}).catch(err => {
		console.log('sms_unsub - Error: ', err);
		res.send({'code': -1, 'message': 'SMS Unsub Request error!'});
	});
}

exports.ccd_unsubscribe = async (req,res) => {
	const transaction_id = getTransactinId();
	const post = req.body;
	post.gw_transaction_id = transaction_id;

	let token = req.headers.authorization;
	let headers = {"Content-Type": "application/json"};
	if(token){
		headers = {"Content-Type": "application/json", "Authorization": `${token}`}
	}

	// Sending request to logging system
	sendReqBody(req, req.body, 'unsubscribe', transaction_id);

	axios.post(`${config.microservices.subscription_service}/subscription/ccd-unsubscribe`, post, {headers:headers})
	.then(function (data) {

		// Sending response to logging system
		sendResBody(data.data);
		res.send(data.data);
	}).catch(err => {
		console.log('ccd_unsubscribe - Error: ', err);
		res.send({'code': -1, 'message': 'CCD Unsubscribe Request error!'});
	});
}

exports.getPackages = async (req,res) => {
	
	let query_slug = "";
	let query_is_default = "";
	let query_id = "";

	let slug = req.query.slug;
	let is_default = req.query.is_default;
	let id = req.query.id;

	if(slug){
		query_slug = "?slug="+slug;
	}else{
		query_slug = "?slug=live";
	}

	if(is_default){ 
		query_is_default = "&is_default="+req.query.is_default;
	};

	if(id){ 
		query_id = "&id="+req.query.id;
	};

	let final = `${config.microservices.core_service}/package${query_slug}${query_is_default}${query_id}`;

	let { data } = await axios.get(final);

	res.send(data);
}

exports.paywall = async (req,res) => {
	let { data } = await axios.get(`${config.microservices.core_service}/paywall`);
	res.send(data);
}

exports.login = async (req, res) => {
	const transaction_id = getTransactinId();
	let postBody = req.body;
	postBody.transaction_id = transaction_id;

	//Sending request to logging system
	sendReqBody(req, postBody, 'ccd_login', transaction_id);

	let { data } = await axios.post(`${config.microservices.core_service}/goonj/login`, postBody);

	// Sending response to logging system
	sendResBody(data);
	res.send(data);
}

exports.ccd_unsub = async (req, res) => {
	const transaction_id = getTransactinId();
	let postBody = req.body;
	postBody.transaction_id = transaction_id;

	let tempPostBody = JSON.parse(JSON.stringify(postBody));

	let token = req.headers.authorization;
	let headers = {"Content-Type": "application/json"};
	if(token){
		headers = {"Content-Type": "application/json", "Authorization": `${token}`}
	}

	tempPostBody.headers = headers;

	//Sending request to logging system
	sendReqBody(req, tempPostBody, 'ccd_unsub', transaction_id);

	try{
		axios.post(`${config.microservices.subscription_service}/subscription/unsubscribe`, postBody, {headers:headers})
		.then(function (data) {
			// Sending response to logging system
			sendResBody(data.data);
			res.send(data.data);
		}).catch(err => {
			console.log('ccd_unsub - Error: ', err);
			res.send({'code': -1, 'message': 'CCD Unsub Request error!'});
		});
	}catch(err){
		console.log('ccd_unsub - Error: ', err);
		res.send({'code': -1, 'message': 'CCD Unsub Request error!'});
	}
}

exports.details = async (req, res) => {
	const transaction_id = getTransactinId();

	let body = {};

	let msisdn = req.query.msisdn;
	body.msisdn = msisdn;
	body.transaction_id = transaction_id;

	let tempBody = JSON.parse(JSON.stringify(body));

	let token = req.headers.authorization;
	let headers = {"Content-Type": "application/json"};
	if(token){
		headers = {"Content-Type": "application/json", "Authorization": `${token}`}
	}

	tempBody.headers = headers;

	//Sending request to logging system
	sendReqBody(req, tempBody, 'ccd_details', transaction_id);

	let { data } = await axios.get(`${config.microservices.subscription_service}/ccd/details?msisdn=${msisdn}&transaction_id=${transaction_id}`, {headers:headers});

	// Sending response to logging system
	sendResBody(data);
	res.send(data);
}

exports.getAllSubs = async (req, res) => {
	const transaction_id = getTransactinId();

	let body = {};

	let msisdn = req.query.msisdn;
	body.msisdn = msisdn;
	body.transaction_id = transaction_id;

	//Sending request to logging system
	sendReqBody(req, body, 'ccd_get_all_subs', transaction_id);

	let { data } = await axios.get(`${config.microservices.subscription_service}/subscription/getAllSubs?msisdn=${msisdn}&transaction_id=${transaction_id}`);

	// Sending response to logging system
	sendResBody(data);
	res.send(data);
}

exports.update_package = async (req,res) => {
	const post = req.body;
	let { data } = await axios.post(`${config.microservices.core_service}/package/update_package`, post);
	res.send(data);
}

exports.isGrayListed = async (req,res) => {
	const transaction_id = getTransactinId();
	let msisdn = req.params.msisdn;
	
	let obj = {};
	obj.source = req.query.source;
	obj.msisdn = req.params.msisdn;
	obj.package_id = req.query.package_id;

	// Sending request to logging system
	sendReqBody(req, obj, 'graylist', transaction_id);

	let { data } = await axios.get(`${config.microservices.user_or_otp_service}/user/graylist/${msisdn}?transaction_id=${obj.transaction_id}&source=${obj.source}&package_id=${obj.package_id}`);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
}

exports.revenue = async (req,res) => {
	axios.get(`${config.microservices.billing_history_service}/report/rev`)
	.then(function (data) {
		res.send(data.data);
	}).catch(err => {
		console.log('revenue - Error: ', err);
		res.send({'code': -1, 'message': 'Revenue Request error!'});
	});
}

exports.req_count = async (req,res) => {
	await axios.get(`${config.microservices.billing_history_service}/report/req-count`)
	.then(function (data) {
		res.send(data.data);
	}).catch(err => {
		console.log('req_count - Error: ', err);
		res.send({'code': -1, 'message': 'Req Count Request error!'});
	});
}

exports.billing_stats = async (req,res) => {
	axios.get(`${config.microservices.billing_history_service}/report/billing/stats`)
	.then(function (data) {
		res.send(data.data);
	}).catch(err => {
		console.log('billing_stats - Error: ', err);
		res.send({'code': -1, 'message': 'Billing Stats Request error!'});
	});
}

exports.revenue_stats = async (req,res) => {
    console.log('revenue_stats - day: ', req.query.day);

    axios.get(`${config.microservices.billing_history_service}/report/revenue/stats?day=${req.query.day}`)
	.then(function (data) {
		res.send(data.data);
	}).catch(err => {
		console.log('revenue_stats - Error: ', err);
        res.send({'code': -1, 'message': 'Revenue Stats Request error!'});
    });
}

exports.pageView = async (req, res) => {
	console.log("[pageview]");
	const transaction_id = getTransactinId();
	let msisdn = req.query.msisdn;
	let source = req.query.source;
	let mid = req.query.mid;
	let tid = req.query.tid;
	
	let obj = {};
	if(msisdn){
		obj.msisdn = msisdn;
		obj.mid = mid;
		obj.tid = tid;
	}
	obj.source = source;

	// Sending request to logging system
	sendReqBody(req, obj, 'pageview', transaction_id);
	console.log("[pageview][msisdn]=>", msisdn);
	msisdn = msisdn ? msisdn : "no_msisdn";
	res.send({"message": "Done", msisdn: msisdn});
}

exports.getQuestion = async (req,res) => {
	let { data } = await axios.get(`${config.feedbackService}/question/all`);
	res.send(data);
}
exports.answer = async (req,res) => {
	let postData = req.body;
	let { data } = await axios.post(`${config.feedbackService}/answer/post`, postData);
	res.send(data);
}

function getTransactinId(){
	let tId = uniqid('gw_logger-', '-'+getCurrentDate());
	return tId;
}

function sendReqBody(req, body, method, transaction_id){
	const postObj = {};
	postObj.req_body = body;
	postObj.source = body.source ? body.source : 'app';
	postObj.transaction_id = transaction_id;
	postObj.service = 'paywall';
	postObj.method = method;
	//postObj.complete_body = req;
	try {
		axios.post(`${config.loggingService}/logger/logreq`, postObj);
		console.log("[Requestsent]");
	} catch (err) {
		console.log("Error",err);
	}
}

function  sendResBody(res){
	if(res && res.gw_transaction_id){
		const postObj = {};
		postObj.transaction_id = res.gw_transaction_id;
		postObj.res_body = res;
		axios.post(`${config.loggingService}/logger/logres`, postObj);
	}else{
		console.log("No gw_transaction_id found in this object");
	}
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

exports.update_user = async (req,res) => {
	const post = req.body;
	const query = req.query;
	let { data } = await axios.put(`${config.microservices.user_or_otp_service}/user`, post,{params: query});
	res.send(data);
}


exports.mark_black_listed = async (req,res) => {
	const post = req.body;
	let { data } = await axios.post(`${config.microservices.user_or_otp_service}/user/mark-black-listed`, post);
	res.send(data);
}

exports.get_user = async (req,res) => {
	const query = req.query;
	let { data } = await axios.get(`${config.microservices.user_or_otp_service}/user`,{params: query});
	res.send(data);
}