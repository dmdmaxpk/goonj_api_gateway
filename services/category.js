const axios = require('axios');
const config = require('../config');

exports.getCategory = async (req,res) => {
	try{
		let { data } = await axios.get(`${config.goonjService}/category`);
		res.send(data);
	}catch(err){
		console.log(err);
		res.send('Error occured');
	}
}

exports.getSubCategory = async (req,res) => {
	try{
		let {_id, name, category_name} = req.query;
		// console.log(`${config.goonjService}/subcat?_id=${_id ? _id: ''}&name=${name ? name : ''}&category_name=${category_name ? category_name: ''}`);
		let { data } = await axios.get(`${config.goonjService}/subcat?_id=${_id ? _id: ''}&name=${name ? name : ''}&category_name=${category_name ? category_name: ''}`);
		res.send(data);
	}catch(err){
		console.log(err);
		res.send('Error occured');
	}
}