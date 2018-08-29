exports.getChannel = async (req, res) => {

    const db = req.app.locals.db;
    const collection = db.collection('channels');

	const { _id, category, name, slug } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (category) query.category = category;
	if (name) query.name = name.replace(/-/g, ' ');	// Replacing the '-' in the channel name written in url for name searching.
	if (slug) query.slug = slug;
	query.active = true;	// Only returning the active channels
	// console.log("Channel Query:", query);

	let result;

	if (_id || name || slug) {		// If _id then findOne
		result = await collection.findOne(query);
		if (result == null) result= [];		// If no result is found then return empty array
	}
	else {
		result = await collection.find(query).sort({seq:1}).toArray();
	}
	res.send(result);
};