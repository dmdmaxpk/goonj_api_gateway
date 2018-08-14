exports.getVideo = async (req, res) => {

    const db = req.app.locals.db;
    const collection = db.collection('videos');

	const { _id, title, category, sub_category, added_dtm, feed, anchor, topics, pinned, skip, limit, source } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (title) query.title = title;
	if (category) query.category = category;
	if (sub_category) query.sub_category = sub_category;
	if (anchor) query.anchor = { $in: anchor.split(',') };
	if (topics) query.topics = { $in: topics.split(',') };
	if (added_dtm) query.added_dtm = added_dtm;
	if (feed) query.feed = feed;
	if (source) query.source = source;
	if (pinned) query.pinned = JSON.parse(pinned);		// Conversion of string to Boolean
	
	// console.log("Video Query:", query);
	query.active = true;	// Get only active videos
	let result;

	if (_id) {		// If _id then findOne
		result = await collection.findOne(query);
		if (result == null) result= [];		// If no result is found then return empty array
	}
	else {
		result = await collection.find(query).sort({ added_dtm:-1 }).skip( Number(skip) || 0 ).limit( Number(limit) || 16 ).toArray();		// Sorting by added_dtm, default for skip and limit is 0 and 16 respectively
	}
	res.send(result);
	// TODO: Pinned video
    // TODO: set no limit if query limit=no, if required
};