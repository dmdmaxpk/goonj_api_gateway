const axios = require('axios');
const config = require('../config');

exports.getCities = async (req,res) => {
	try{
		let { data } = await axios.get(`${config.goonjService}/city`);
		res.send(data);
	}catch(err){
		console.log(err);
		res.send('Error occured');
	}
}