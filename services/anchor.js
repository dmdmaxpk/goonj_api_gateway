exports.getAnchor = async (req, res) => {

	const { version } = req.query;
	
	if (version) {

		const db = req.app.locals.db;
		let collection = db.collection('videos');	// Getting direct results from Videos Collection based on total count of each anchor

		const { limit, days } = req.query;

		let result;
		// Calculating no.of days
		let today = new Date();
		let oneDay = ( 1000 * 60 * 60 * 24 );
		let customDays;
		if (days) customDays = new Date( today.valueOf() - ( Number(days) * oneDay ) );		// Setting no. of days if provided by query
		let defaultDays = new Date( today.valueOf() - ( 30 * oneDay ) );					// If not provided then default
		
		result = await collection.aggregate([
			{ $match: {
				added_dtm: { $gte: customDays || defaultDays },		// Days by Query OR Default 30 days
				anchor: { $exists: true, $ne: "" }					// Neglect empty anchors
				}
			},
			{ $group : { 
				_id: "$anchor", 
				count: { $sum: 1 }		// Grouping by SUM count
				}
			},
			{ $sort: { "count": -1 } },			// Sort by descending order of total counts
			{ $limit: Number(limit) || 50 },	// Limit by query or default 50
			{ $project: {
				name: "$_id",		// Show _id by name field
				// "count": 1,		// Show count field
				_id: 0,				// Remove _id field
				}
			}
		]).toArray();

		res.send(result);
	}

	else {
		const db = req.app.locals.db;
		const collection = db.collection('anchors');

		const { _id, weightage } = req.query;
		const query = {};

		if (_id) query._id = _id;
		if (weightage) query.weightage = Number(weightage);
		// console.log("Anchors Query:", query);

		let result;

		if (_id) {		// If _id then findOne
			result = await collection.findOne(query);
		}
		else {
			// TODO: Add projection after some time when the old user migrates cos old APP versions are storing avatar, added_dtm etc. (duhh! IKR!)
			result = await collection.find({ weightage: {$gt: 0} }).sort({weightage:-1}).project({ '__v': 0 }).toArray();	// Sorting by weightage descending
		}
		res.send(result);
	}
};