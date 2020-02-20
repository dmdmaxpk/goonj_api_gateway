const axios = require('axios');
const config = require('../config');

exports.sendOtp = async (req,res) => {

	const post = req.body;

	let { data } = await axios.post(`${config.paymentService}/payment/otp/send`, post);
	res.send(data);
}

exports.verifyOtp = async (req,res) => {

	const post = req.body;

	let { data } = await axios.post(`${config.paymentService}/payment/otp/verify`, post);
	res.send(data);
}


exports.subcribe = async (req,res) => {

	const post = req.body;

	let { data } = await axios.post(`${config.paymentService}/payment/subscribe`, post);
	res.send(data);
}

exports.status = async (req,res) => {

	const post = req.body;

	let { data } = await axios.post(`${config.paymentService}/payment/status`, post);
	res.send(data);
}

exports.unsubscribe = async (req,res) => {

	const post = req.body;

	let { data } = await axios.post(`${config.paymentService}/payment/unsubscribe`, post);
	res.send(data);
}

exports.getPackages = async (req,res) => {

	let { data } = await axios.get(`${config.paymentService}/package`);
	res.send(data);
}

exports.getPackage = async (req,res) => {

	let id = req.query.id;

	let { data } = await axios.get(`${config.paymentService}/package/${id}`);
	res.send(data);
}


exports.update_package = async (req,res) => {

	const post = req.body;
	let { data } = await axios.post(`${config.paymentService}/user/update_package`, post);
	res.send(data);
}

exports.isGrayListed = async (req,res) => {
	let msisdn = req.params.msisdn;
	let { data } = await axios.get(`${config.paymentService}/user/graylist/${msisdn}`);
	res.send(data);
}