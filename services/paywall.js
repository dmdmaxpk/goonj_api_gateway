const axios = require('axios');
const config = require('../config');
var uniqid = require('uniqid');
const router = require('../router');

exports.sendOtp = async (req,res) => {
	const transaction_id = getTransactinId();
	const post = req.body;
	post.transaction_id = transaction_id;

	// Sending request to logging system
	sendReqBody(req, req.body, 'sendOtp', transaction_id);

	axios.post(`${config.paymentService}/payment/otp/send`, post)
	.then(function (data) {

		// Sending response to logging system
		sendResBody(data.data);
		res.send(data.data);
	}).catch(err => {
		console.log('sendOtp - Error: ', err);

		// Sending response to logging system
		sendResBody(err);
		res.send({'code': -1, 'message': 'Send Otp Request error!', 'error': err});
	});
}

exports.verifyOtp = async (req,res) => {
	const transaction_id = getTransactinId();
	const post = req.body;
	post.transaction_id = transaction_id;

	// Sending request to logging system
	sendReqBody(req, req.body, 'verifyOtp', transaction_id);

	let { data } = await axios.post(`${config.paymentService}/payment/otp/verify`, post);

	// Sending response to logging system
	sendResBody(data);

	res.send(data);
}

exports.subcribe = async (req,res) => {
	if(req && req.socket.destroyed){
		res.send({code: -1, message: "Socket Destroyed"});
	}else{
		const transaction_id = getTransactinId();
		const post = req.body;
		post.transaction_id = transaction_id;

		let token = req.headers.authorization;
		let headers = {"Content-Type": "application/json"};
		if(token){
			headers = {"Content-Type": "application/json", "Authorization": `${token}`}
		}

		// Sending request to logging system
		sendReqBody(req, req.body, 'subscribe', transaction_id);

		axios.post(`${config.paymentService}/payment/subscribe`, post, {headers:headers})
		.then(function (data) {

			// Sending response to logging system
			sendResBody(data.data);
			res.send(data.data);
		}).catch(err => {
			console.log('subscribe - Error: ', err);

			// Sending response to logging system
			sendResBody(err);
			res.send({'code': -1, 'message': 'Subscribe Request error!', 'error': err});
		});
	}
}

exports.refresh = async (req,res) => {
	
	const post = req.body;
	
	let { data } = await axios.post(`${config.paymentService}/auth/refresh`, post);
	
	res.send(data);
}

exports.recharge = async (req,res) => {
	const transaction_id = getTransactinId();

	const post = req.body;
	post.transaction_id = transaction_id;

	// Sending request to logging system
	sendReqBody(req, req.body, 'recharge', transaction_id);

	axios.post(`${config.paymentService}/payment/recharge`, post)
	.then(function (data) {

		// Sending response to logging system
		sendResBody(data.data);
		res.send(data.data);
	}).catch(err => {
		console.log('recharge - Error: ', err);

		// Sending response to logging system
		sendResBody(err);
		res.send({'code': -1, 'message': 'Recharge Request error!', 'error': err});
	});
}

exports.status = async (req,res) => {
	const transaction_id = getTransactinId();

	const post = req.body;
	post.transaction_id = transaction_id;

	// Sending request to logging system
	sendReqBody(req, req.body, 'status', transaction_id);

	let { data } = await axios.post(`${config.paymentService}/payment/status`, post);

	// Sending response to logging system
	sendResBody(data);

	res.send(data);
}

exports.unsubscribe = async (req,res) => {
	const transaction_id = getTransactinId();
	const post = req.body;
	post.transaction_id = transaction_id;

	let token = req.headers.authorization;
	let headers = {"Content-Type": "application/json"};
	if(token){
		headers = {"Content-Type": "application/json", "Authorization": `${token}`}
	}

	// Sending request to logging system
	sendReqBody(req, req.body, 'unsubscribe', transaction_id);

	axios.post(`${config.paymentService}/payment/unsubscribe`, post, {headers:headers})
	.then(function (data) {

		// Sending response to logging system
		sendResBody(data.data);
		res.send(data.data);
	}).catch(err => {
		console.log('unsubscribe - Error: ', err);

		// Sending response to logging system
		sendResBody(err);
		res.send({'code': -1, 'message': 'Unsubscribe Request error!', 'error': err});
	});
}

exports.sms_unsub = async (req,res) => {
	axios.post(`${config.paymentService}/payment/sms-unsub`, req.body)
	.then(function (data) {
		res.send(data.data);
	}).catch(err => {
		console.log('sms_unsub - Error: ', err);
		res.send({'code': -1, 'message': 'SMS Unsub Request error!', 'error': err});
	});
}

exports.ccd_unsubscribe = async (req,res) => {
	const transaction_id = getTransactinId();
	const post = req.body;
	post.transaction_id = transaction_id;

	let token = req.headers.authorization;
	let headers = {"Content-Type": "application/json"};
	if(token){
		headers = {"Content-Type": "application/json", "Authorization": `${token}`}
	}

	// Sending request to logging system
	sendReqBody(req, req.body, 'unsubscribe', transaction_id);

	axios.post(`${config.paymentService}/payment/ccd-unsubscribe`, post, {headers:headers})
	.then(function (data) {

		// Sending response to logging system
		sendResBody(data.data);
		res.send(data.data);
	}).catch(err => {
		console.log('ccd_unsubscribe - Error: ', err);

		// Sending response to logging system
		sendResBody(err);
		res.send({'code': -1, 'message': 'CCD Unsubscribe Request error!', 'error': err});
	});
}

exports.getPackages = async (req,res) => {
	//const transaction_id = getTransactinId();
	//let source = req.query.source;

	// Sending request to logging system
	//sendReqBody(req, {source:source}, 'packages', transaction_id);


	let route = "package";
	let querySlug = "";
	let query_is_default = "";

	let slug = req.query.slug;
	let is_default = req.query.is_default;

	if(slug){ 
		querySlug = "?slug="+req.query.slug;
	};

	if(is_default){ 
		query_is_default = "&is_default="+req.query.is_default;
	};

	let final = `${config.paymentService}/${route}${querySlug}${query_is_default}`;
	console.log(final);

	let { data } = await axios.get(final);

	// Sending response to logging system
	//sendResBody(data);

	res.send(data);
}

exports.paywall = async (req,res) => {
	// const transaction_id = getTransactinId();
	// let source = req.query.source;

	// if(!source){
	// 	source = 'na';
	// }

	//Sending request to logging system
	//sendReqBody(req, {source:source}, 'paywall', transaction_id);

	let { data } = await axios.get(`${config.paymentService}/paywall`);

	// Sending response to logging system
	//sendResBody(data);

	res.send(data);
}

exports.login = async (req, res) => {
	const transaction_id = getTransactinId();
	let postBody = req.body;
	postBody.transaction_id = transaction_id;

	//Sending request to logging system
	sendReqBody(req, postBody, 'ccd_login', transaction_id);

	let { data } = await axios.post(`${config.paymentService}/goonj/login`, postBody);

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
		axios.post(`${config.paymentService}/goonj/unsubscribe`, postBody, {headers:headers})
		.then(function (data) {
			// Sending response to logging system
			sendResBody(data.data);
			res.send(data.data);
		}).catch(err => {
			console.log('ccd_unsub - Error: ', err);

			// Sending response to logging system
			sendResBody(err);
			res.send({'code': -1, 'message': 'CCD Unsub Request error!', 'error': err});
		});
	}catch(err){
		console.log('ccd_unsub - Error: ', err);

		// Sending response to logging system
		sendResBody(err);
		res.send(err);
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

	let { data } = await axios.get(`${config.paymentService}/ccd/details?msisdn=${msisdn}&transaction_id=${transaction_id}`, {headers:headers});

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

	let { data } = await axios.get(`${config.paymentService}/payment/getAllSubs?msisdn=${msisdn}&transaction_id=${transaction_id}`);

	// Sending response to logging system
	sendResBody(data);
	res.send(data);
}

exports.getPackage = async (req,res) => {
	
	//const transaction_id = getTransactinId();
	//let id = req.query.id;

	// Sending request to logging system
	//sendReqBody(req, req.query, 'package', transaction_id);

	let { data } = await axios.get(`${config.paymentService}/package/${id}`);

	// Sending response to logging system
	//sendResBody(data);

	res.send(data);
}

exports.update_package = async (req,res) => {
	//const transaction_id = getTransactinId();

	const post = req.body;

	// Sending request to logging system
	//sendReqBody(req, req.body, 'update_package', transaction_id);

	let { data } = await axios.post(`${config.paymentService}/user/update_package`, post);
	
	// Sending response to logging system
	//sendResBody(data);

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

	let { data } = await axios.get(`${config.paymentService}/user/graylist/${msisdn}?transaction_id=${obj.transaction_id}&source=${obj.source}&package_id=${obj.package_id}`);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
}

exports.revenue = async (req,res) => {
	axios.get(`${config.paymentService}/report/rev`)
	.then(function (data) {
		res.send(data.data);
	}).catch(err => {
		console.log('revenue - Error: ', err);
		res.send({'code': -1, 'message': 'Revenue Request error!', 'error': err});
	});
}

exports.req_count = async (req,res) => {
	await axios.get(`${config.paymentService}/report/req-count`)
	.then(function (data) {
		res.send(data.data);
	}).catch(err => {
		console.log('req_count - Error: ', err);
		res.send({'code': -1, 'message': 'Req Count Request error!', 'error': err});
	});
}

exports.billing_stats = async (req,res) => {
	axios.get(`${config.paymentService}/report/billing/stats`)
	.then(function (data) {
		res.send(data.data);
	}).catch(err => {
		console.log('billing_stats - Error: ', err);
		res.send({'code': -1, 'message': 'Billing Stats Request error!', 'error': err});
	});
}

exports.revenue_stats = async (req,res) => {
    console.log('revenue_stats - day: ', req.query.day);

    axios.get(`${config.paymentService}/report/revenue/stats?day=${req.query.day}`)
	.then(function (data) {
		res.send(data.data);
	}).catch(err => {
		console.log('revenue_stats - Error: ', err);
        res.send({'code': -1, 'message': 'Revenue Stats Request error!', 'error': err});
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
	let { data } = await axios.put(`${config.paymentService}/user`, post,{params: query});
	res.send(data);
}


exports.mark_black_listed = async (req,res) => {
	const post = req.body;
	let { data } = await axios.post(`${config.paymentService}/user/mark-black-listed`, post);
	res.send(data);
}

exports.get_user = async (req,res) => {

	const query = req.query;
	let { data } = await axios.get(`${config.paymentService}/user`,{params: query});
	res.send(data);
}