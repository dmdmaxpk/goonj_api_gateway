const axios = require('axios');

exports.getUser = async (req, res) => {

	const { user_id } = req.query;

	console.log("User_IDDD", user_id);
	let { data } = await axios.get(`http://api.pockettv.com.pk/v2/api/users/${user_id}`);	// Replace it with user service
	const user = data.data;

	// console.log(user);
	res.send(user);
};

exports.postUser = async (req, res) => {

	const post = req.body;
	console.log(post);
	let { data } = await axios.post(`http://api.pockettv.com.pk/v2/api/users`, post);	// Replace it with user service
	console.log(data.data);
	res.send(data.data);
};