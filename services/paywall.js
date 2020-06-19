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

	let { data } = await axios.post(`${config.paymentService}/payment/otp/send`, post);

	// Sending response to logging system
	sendResBody(data);

	res.send(data);
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
	const transaction_id = getTransactinId();

	const post = req.body;
	post.transaction_id = transaction_id;

	// Sending request to logging system
	sendReqBody(req, req.body, 'subscribe', transaction_id);

	let { data } = await axios.post(`${config.paymentService}/payment/subscribe`, post);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
}

exports.recharge = async (req,res) => {
	const transaction_id = getTransactinId();

	const post = req.body;
	post.transaction_id = transaction_id;

	// Sending request to logging system
	sendReqBody(req, req.body, 'recharge', transaction_id);

	let { data } = await axios.post(`${config.paymentService}/payment/recharge`, post);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
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

	// Sending request to logging system
	sendReqBody(req, req.body, 'unsubscribe', transaction_id);

	let { data } = await axios.post(`${config.paymentService}/payment/unsubscribe`, post);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
}

exports.getPackages = async (req,res) => {
	//const transaction_id = getTransactinId();
	//let source = req.query.source;

	// Sending request to logging system
	//sendReqBody(req, {source:source}, 'packages', transaction_id);


	let route = "/package";
	let query = "";
	if(req.query && req.query.slug){ 
		query = "?slug="+req.query.slug;
	};

	let final = `${config.paymentService}/${route}${query}`;
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

	// Sending request to logging system
	sendReqBody(req, obj, 'graylist', transaction_id);

	let { data } = await axios.get(`${config.paymentService}/user/graylist/${msisdn}?transaction_id=${transaction_id}`);
	
	// Sending response to logging system
	sendResBody(data);

	res.send(data);
}

exports.pageView = async (req, res) => {
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

	res.send({"message": "Done"});
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

exports.update_user = async (req,res) => {

	const post = req.body;
	const query = req.query;
	let { data } = await axios.put(`${config.paymentService}/user`, post,{params: query});
	res.send(data);
}

exports.get_user = async (req,res) => {

	const query = req.query;
	let { data } = await axios.get(`${config.paymentService}/user`,{params: query});
	res.send(data);
}