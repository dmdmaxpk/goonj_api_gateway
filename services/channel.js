const axios = require('axios');
const config = require('../config');

exports.getChannel = async (req, res) => {

    const { db } = req.app.locals;
    const collection = db.collection('channels');

	const { _id, slug } = req.query;
	const query = {};

	const headers = JSON.stringify(req.headers);

	if(headers)
		console.log(headers.HTTP_Country_Code);

	if (_id) query._id = _id;
	if (slug) query.slug = slug;
	query.active = true;	// Only returning the active channels

	let result;

	if (_id || slug) {		// If _id || slug then findOne
		result = await collection.findOne(query);
		if (result == null) result= [];		// If no result is found then return empty array
	}
	else {
		result = await collection
			.find(query)
			.project({ 'active': 0, 'added_dtm': 0, 'description': 0, '__v': 0, 'country': 0, 'seq': 0, 'logo': 0, 'category': 0, 'last_modified': 0 })
			.sort({ seq:1 })
			.toArray();
	}
	res.send(result);
}

exports.postChannelViews = async (req, res) => {
    let {data} = await axios.post(`${config.goonjService}/channelViews`, req.body);
    res.send(data);
}