const axios = require('axios');
const config = require('../config');

exports.getCategory = async (req,res) => {
	let { data } = await axios.get(`${config.goonjService}/category`);
	res.send(data);
}

exports.getSubCategory = async (req,res) => {
	let { data } = await axios.get(`${config.goonjService}/subcat`);
	res.send(data);
}