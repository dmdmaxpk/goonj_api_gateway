exports.getChannel = async (req, res) => {

    const db = req.app.locals.db;
    const collection = db.collection('channels');

	const { _id, slug } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (slug) query.slug = slug;
	query.active = true;	// Only returning the active channels
	// console.log("Channel Query:", query);

	let result;

	if (_id || slug) {		// If _id then findOne
		result = await collection.findOne(query);
		if (result == null) result= [];		// If no result is found then return empty array
	}
	else {
		result = await collection.find(query).sort({seq:1}).toArray();
	}
	res.send(result);
};