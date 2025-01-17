const axios = require('axios');
const config = require('../config');
var uniqid = require('uniqid');

/**
 * '{"msisdn":"3468590478","serviceId":25,"status":"ACTIVE","channel":"SMS","subscriptionTime":"2022-04-22T13:23:40.297Z","renewalTime":"2022-04-28T19:00:00.000Z"}'
 */
exports.chargingCallback = async (req,res) => {
	try{
		// check for basic auth header
		if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
			return res.status(401).json({ message: 'Missing authorization header' });
		}

		// verify auth credentials
		const base64Credentials =  req.headers.authorization.split(' ')[1];
		const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
		const [username, password] = credentials.split(':');
		const user = username === '24cwKGP23!' && password === 'YzY+Ef3g6B{PHT}B8Fvz' ? true : false;
		if (!user) {
			return res.status(401).json({ message: 'Invalid authentication credentials' });
		}

		const transaction_id = getTransactinId();
		const post = req.body;
		post.gw_transaction_id = transaction_id;

		// Sending request to logging system
		sendReqBody(req, req.body, 'charging-callback', transaction_id);

		axios.post(`${config.microservices.subscription_renewal_service}/callback/charging-callback`, post).then(function (data) {
			// Sending response to logging system
			sendResBody(data.data);
			res.send(data.data);
		}).catch(err => {
			console.log('Callback - Error: ', err);
			res.status(err.statusCode ? err.statusCode : 500).send(err.response.data ? err.response.data : 'Internal server error');
		});
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.sendOtp = async (req,res) => {
	try{
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
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.verifyOtp = async (req,res) => {
	try{
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
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.subscribe = async (req,res) => {
	// const transaction_id = getTransactinId();
	// res.send({code: 11, message: 'Trial period activated!', gw_transaction_id: transaction_id});
	
	
	try{
		if(req && req.socket.destroyed){
		res.send({code: -1, message: "Socket Destroyed"});
		}else{
			const transaction_id = getTransactinId();
			const post = req.body;
			post.gw_transaction_id = transaction_id;

			let token = req.headers.authorization;
			let headers = {"Content-Type": "application/json"};
			if(token){
				headers = {"Content-Type": "application/json", "Authorization": `${token}`, 'x-forwarded-for': req.headers['x-forwarded-for'], 'user-agent': req.headers['user-agent']}
				console.log("headers", headers);
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
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.campaigns = async (req,res) => {
	
	const transaction_id = getTransactinId();
	const post = req.body;
	post.gw_transaction_id = transaction_id;
	
	sendReqBody(req, req.body, 'campaigns', transaction_id);

	axios.post(`${config.microservices.subscription_service}/subscription/campaigns`, post)
	.then(function (data) {
		sendResBody(data.data);
		res.send(data.data);
	}).catch(err => {
		console.log('campaigns - error: ', err);
		res.send({'code': -1, 'message': 'Failed to save campaigns data'});
	});
}

exports.cmsToken = async (req,res) => {
	try{
		const transaction_id = getTransactinId();
		const post = req.body;
		post.gw_transaction_id = transaction_id;

		// Sending request to logging system
		sendReqBody(req, req.body, 'cmsToken', transaction_id);

		axios.post(`${config.microservices.tp_ep_core_service}/core/cms-token`, post)
		.then(function (data) {
			sendResBody(data.data);
			res.send(data.data);
		}).catch(err => {
			console.log('cmsToken - error: ', err);
			res.send({'code': -1, 'message': 'Failed to generate token'});
		});
	} catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.cmsTokenV2 = async (req,res) => {
	try{
		const transaction_id = getTransactinId();
		const post = req.body;
		post.gw_transaction_id = transaction_id;

		// Sending request to logging system
		sendReqBody(req, req.body, 'cmsToken', transaction_id);

		axios.post(`${config.microservices.tp_ep_core_service}/core/v2/cms-token`, post)
		.then(function (data) {
			sendResBody(data.data);
			res.send(data.data);
		}).catch(err => {
			console.log('cmsToken - error: ', err);
			res.send({'code': -1, 'message': 'Failed to generate token'});
		});
	} catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.subscribeNow = async (req,res) => {
	try{
		
		const transaction_id = getTransactinId();
		const post = req.body;
		post.gw_transaction_id = transaction_id;

		let token = req.headers.authorization;
		let headers = {"Content-Type": "application/json"};
		if(token){
			headers = {"Content-Type": "application/json", "Authorization": `${token}`, 'x-forwarded-for': req.headers['x-forwarded-for'], 'user-agent': req.headers['user-agent']}
			console.log("headers", headers);
		}

		// Sending request to logging system
		sendReqBody(req, req.body, 'subscribeNow', transaction_id);

		axios.post(`${config.microservices.subscription_service}/subscription/subscribeNow`, post, {headers:headers})
		.then(function (data) {

			// Sending response to logging system
			sendResBody(data.data);
			res.send(data.data);
		}).catch(err => {
			console.log('subscribeNow - Error: ', err);
			res.send({'code': -1, 'message': 'SubscribeNow Request error!'});
		});
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.refresh = async (req,res) => {
	try{
		const post = req.body;
		let { data } = await axios.post(`${config.microservices.core_service}/auth/refresh`, post);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.recharge = async (req,res) => {
	try{
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
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.status = async (req,res) => {
	try{
		console.log("status header", req.headers)
		console.log("----------------------------------- status header end -----------------------------------")
		const transaction_id = getTransactinId();

		const post = req.body;
		post.gw_transaction_id = transaction_id;

		// Sending request to logging system
		sendReqBody(req, req.body, 'status', transaction_id);

		let { data } = await axios.post(`${config.microservices.subscription_service}/subscription/status`, post, {headers: {'x-forwarded-for': req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : 'custom-remoteAddress', 'user-agent': req.headers['user-agent'] ? req.headers['user-agent'] : 'custom-agent'}});

		// Sending response to logging system
		sendResBody(data);

		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.checkStatus = async (req,res) => {
	try{
		const transaction_id = getTransactinId();

		const post = req.body;
		post.gw_transaction_id = transaction_id;

		// Sending request to logging system
		sendReqBody(req, req.body, 'checkStatus', transaction_id);

		let { data } = await axios.post(`${config.microservices.subscription_service}/subscription/checkStatus`, post, {headers: {'x-forwarded-for': req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : 'custom-remoteAddress', 'user-agent': req.headers['user-agent'] ? req.headers['user-agent'] : 'custom-agent'}});

		// Sending response to logging system
		sendResBody(data);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.unsubscribe = async (req,res) => {
	try{
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
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.sms_unsub = async (req,res) => {
	try{
		axios.post(`${config.microservices.subscription_service}/subscription/sms-unsub`, req.body)
		.then(function (data) {
			res.send(data.data);
		}).catch(err => {
			console.log('sms_unsub - Error: ', err);
			res.send({'code': -1, 'message': 'SMS Unsub Request error!'});
		});
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.ccd_unsubscribe = async (req,res) => {
	try{
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
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.getPackages = async (req,res) => {
	try{	
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

		let final = `${config.microservices.core_service}/package/all${query_slug}${query_is_default}${query_id}`;

		let { data } = await axios.get(final);
		console.log(data);

		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.paywall = async (req,res) => {
	try{
		let { data } = await axios.get(`${config.microservices.core_service}/paywall`);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.login = async (req, res) => {
	try{
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
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.ccd_unsub = async (req, res) => {
	try{
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
			axios.post(`${config.microservices.subscription_service}/subscription/ccd-unsubscribe`, postBody, {headers:headers})
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
	catch(err){
		console.log(err);
	}
}

exports.details = async (req, res) => {
	try{
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
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.getAllSubs = async (req, res) => {
	try{
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
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.update_package = async (req,res) => {
	try{
		const post = req.body;
		let { data } = await axios.post(`${config.microservices.core_service}/package/update_package`, post);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.isGrayListed = async (req,res) => {
	try{
		const transaction_id = getTransactinId();
		let msisdn = req.params.msisdn;
		
		let obj = {};
		obj.source = req.query.source;
		obj.msisdn = req.params.msisdn;
		obj.package_id = req.query.package_id;
		obj.transaction_id = transaction_id;

		// Sending request to logging system
		sendReqBody(req, obj, 'graylist', transaction_id);

		let { data } = await axios.get(`${config.microservices.user_or_otp_service}/user/graylist/${msisdn}?transaction_id=${transaction_id}&source=${obj.source}&package_id=${obj.package_id}`);
		
		// Sending response to logging system
		sendResBody(data);

		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.revenue = async (req,res) => {
	try{
		axios.get(`${config.microservices.production_billing_history_service}/rev`, {timeout: 10000 * 15})
		.then(data => {
			res.send(data.data);
		}).catch(err => {
			console.log('revenue - Error: ', err);
			res.send({'code': -1, 'message': 'Revenue Request error!'});
		});
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.req_count = async (req,res) => {
	try{
		await axios.get(`${config.microservices.production_billing_history_service}/req-count`)
		.then(function (data) {
			res.send(data.data);
		}).catch(err => {
			console.log('req_count - Error: ', err);
			res.send({'code': -1, 'message': 'Req Count Request error!'});
		});
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.billing_stats = async (req,res) => {
	try{
		axios.get(`${config.microservices.production_billing_history_service}/report/billing/stats`)
		.then(function (data) {
			res.send(data.data);
		}).catch(err => {
			console.log('billing_stats - Error: ', err);
			res.send({'code': -1, 'message': 'Billing Stats Request error!'});
		});
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.revenue_stats = async (req,res) => {
    try{
		console.log('revenue_stats - day: ', req.query.day);

		axios.get(`${config.microservices.report_service}/report/revenue/stats?day=${req.query.day}`)
		.then(function (data) {
			res.send(data.data);
		}).catch(err => {
			console.log('revenue_stats - Error: ', err);
			res.send({'code': -1, 'message': 'Revenue Stats Request error!'});
		});
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.pageView = async (req, res) => {
	try{
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
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.getQuestion = async (req,res) => {
	try{
		let { data } = await axios.get(`${config.feedbackService}/question/all`);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}
exports.answer = async (req,res) => {
	try{
		let postData = req.body;
		let { data } = await axios.post(`${config.feedbackService}/answer/post`, postData);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

function getTransactinId(){
	try{
		let tId = uniqid('gw_logger-', '-'+getCurrentDate());
		return tId;
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

function sendReqBody(req, body, method, transaction_id){
	try{
		const postObj = {};
		postObj.req_body = body;
		postObj.source = body.source ? body.source : 'app';
		postObj.transaction_id = transaction_id;
		postObj.service = 'paywall';
		postObj.method = method;

		axios.post(`${config.loggingService}/logger/logreq`, postObj)
		.then(function (data) {
			console.log(data.data);
		}).catch(err => {
			console.log("Error while sending logger request: ",err.message);
		});
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

function  sendResBody(res){
	try{
		if(res && res.gw_transaction_id){
		const postObj = {};
		postObj.transaction_id = res.gw_transaction_id;
		postObj.res_body = res;

		axios.post(`${config.loggingService}/logger/logres`, postObj)
		.then(function (data) {
			console.log(data.data);
		}).catch(err => {
			console.log("Error while sending logger response: ",err.message);
		});
		}else{
			console.log("No gw_transaction_id found in this object");
		}
	}
	catch(err){
		console.log(err);
		res.send(err);
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
	try{
		const post = req.body;
		const query = req.query;
		let { data } = await axios.put(`${config.microservices.user_or_otp_service}/user`, post,{params: query});
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}


exports.mark_black_listed = async (req,res) => {
	try{
		const post = req.body;
		let { data } = await axios.post(`${config.microservices.user_or_otp_service}/user/mark-black-listed`, post);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.get_user = async (req,res) => {
	try{
		const query = req.query;
		let { data } = await axios.get(`${config.microservices.user_or_otp_service}/user`,{params: query});
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.midTodaySubs = async (req,res) => {
	try{
		const query = req.query;
		let { data } = await axios.get(`${config.microservices.subscription_service}/subscription/affiliate-subscriptions-count?mid=${query.mid}`);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.createUser = async (req,res) => {
	try{
		const body = req.body;
		let { data } = await axios.post(`${config.microservices.user_or_otp_service}/user/create_user`, body);
		console.log(data)
		// let data = {_id: "null", user_id: "null"}
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.updateFcmToken = async (req,res) => {
	try{
		const body = req.body;
		let { data } = await axios.put(`${config.microservices.user_or_otp_service}/user/update_fcm_token`, body);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.savePreference = async (req,res) => {
	try{
		const body = req.body;
		let { data } = await axios.post(`${config.microservices.user_or_otp_service}/preference/save`, body);
		// let data = {code: 0, message: "Record inserted successfully!"};
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.updateNotificationOpenedCount = async (req,res) => {
	try{
		const query = req.query;
		let { data } = await axios.put(`${config.microservices.user_or_otp_service}/notification/update?id=${query.id}&user_id=${query.user_id}`);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.activeUserLogs = async (req,res) => {
	try{
		const body = req.body;
		let { data } = await axios.post(`${config.microservices.user_or_otp_service}/active-user-log`, body);
		// let data = {code: 0, message: "Record inserted successfully!"};
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.linkClickWalee = async (req,res) => {
	try{
		const query = req.query;
		let { data } = axios.get(`${config.microservices.subscription_service}/walee/link-click?utm_source=${query.utm_source}`);
		// res.send(data);
		res.send({message: 'success'})
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.pageviewWalee = async (req,res) => {
	try{
		const query = req.query;
		let { data } = await axios.get(`${config.microservices.subscription_service}/walee/pageview?utm_source=${query.utm_source}`);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.successfulSubscriptionWalee = async (req,res) => {
	try{
		const query = req.query;
		const body = req.body;
		let { data } = await axios.post(`${config.microservices.subscription_service}/walee/subscription-success?utm_source=${query.utm_source}`, body);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}

exports.consent = async (req, res) => {
	try{
		const body = req.body;
		let { data } = await axios.post(`${config.microservices.tp_ep_core_service}/core/consent`, body);
		res.send(data);
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
}