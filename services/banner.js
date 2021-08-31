const axios = require('axios');
const config = require('../config');

exports.getBanners = async (req,res) => {
	try{
		let { data } = await axios.get(`${config.goonjService}/banner`);
		res.send(data);
	}catch(err){
		console.log(err);
		res.send('Error occured');
	}
}