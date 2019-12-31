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