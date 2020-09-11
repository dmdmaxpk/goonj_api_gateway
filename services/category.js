const axios = require('axios');
const config = require('../config');

exports.getCategory = async (req,res) => {
	let { data } = await axios.get(`${config.goonjService}/category`);
	res.send(data);
}

exports.getSubCategory = async (req,res) => {
	let {_id, name, category_name} = req.query;
	// console.log(`${config.goonjService}/subcat?_id=${_id ? _id: ''}&name=${name ? name : ''}&category_name=${category_name ? category_name: ''}`);
	let { data } = await axios.get(`${config.goonjService}/subcat?_id=${_id ? _id: ''}&name=${name ? name : ''}&category_name=${category_name ? category_name: ''}`);
	res.send(data);
}