const axios = require('axios');
const config = require('../config');

exports.getBanners = async (req,res) => {
	let { data } = await axios.get(`${config.goonjService}/banner`);
	res.send(data);
}