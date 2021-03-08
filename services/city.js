const axios = require('axios');
const config = require('../config');

exports.getCities = async (req,res) => {
	let { data } = await axios.get(`${config.goonjService}/city`);
	res.send(data);
}