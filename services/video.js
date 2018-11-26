exports.getVideo = async (req, res) => {

    const db = req.app.locals.db;
    const collection = db.collection('videos');

	const { _id, title, category, sub_category, added_dtm, feed, anchor, guests, topics, pinned, skip, limit, source } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (title) query.title = title;
	if (category) query.category = category;
	if (sub_category) query.sub_category = sub_category;
	if (anchor) query.$or = anchor.split(',').map( el => ({anchor: el}) );	// OR query for  Anchor
	if (guests) query.guests = { $in: guests.split(',') };
	if (topics) query.topics = { $in: topics.split(',') };
	if (added_dtm) query.added_dtm = added_dtm;
	if (feed) query.feed = feed;
	// if (source) query.$or = source.split(',').map( el => ({source: el}) );	// OR query for  Source. WILL HAVE TO PUSH INTO ARRAY FOR OR
	if (source) query.source = source;
	if (pinned) query.pinned = JSON.parse(pinned);		// Conversion of string to Boolean
	
	console.log("Video Query:", query);
	query.active = true;	// Get only active videos
	let result;

	if (_id) {		// If _id then findOne
		result = await collection.findOne(query, '-active -transcoding_status');
		if (result == null) result= [];		// If no result is found then return empty array
	}
	else {
		result = await collection.find(query, '-active -transcoding_status').sort({ added_dtm:-1 }).skip( Number(skip) || 0 ).limit( Number(limit) || 16 ).toArray();		// Sorting by added_dtm, default for skip and limit is 0 and 16 respectively
		// OR
		// let options = {
		// 	limit: Number(limit) || 16,
		// 	skip: Number(skip) || 0,
		// 	sort: added_dtm
		// }
		// result = await collection.find({}, options).toArray();
	}
	res.send(result);
	// TODO: Pinned video
    // TODO: set no limit if query limit=no, if required
};