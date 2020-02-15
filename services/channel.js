const axios = require('axios');
const config = require('../config');

exports.getChannel = async (req, res) => {

    const { db } = req.app.locals;
    const collection = db.collection('channels');

	const { _id, slug, package_id } = req.query;
	const query = {};

	const country = req.headers['http_country_code'];
	if(country){
        console.log("Request From: "+country);
	}else{
		console.log("No country available!")
	}

	if (_id) query._id = _id;
	if (slug) query.slug = slug;
	if (package_id) query.package_id = package_id;
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