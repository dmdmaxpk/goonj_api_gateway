exports.getTopic = async (req, res) => {

	try{
		const { version } = req.query;

		// For popularity in recent videos (OLD APP: This is still the better approach for sorting instead of manually setting weightage)
		if (version == 'auto') {

			const { db } = req.app.locals;
			const collection = db.collection('videos');		// Getting direct results from Videos Collection based on total count of each topic

			const { limit, days } = req.query;

			let result;
			// Calculating no.of days
			let today = new Date();
			let oneDay = ( 1000 * 60 * 60 * 24 );
			let customDays;
			if (days) customDays = new Date( today.valueOf() - ( Number(days) * oneDay ) );		// Setting no. of days if provided by query
			let defaultDays = new Date( today.valueOf() - ( 7 * oneDay ) );						// If not provided then default 7
			
			result = await collection.aggregate([
				{ $match: {
					added_dtm: { $gte: customDays || defaultDays },		// Days by Query OR Default
					topics: { $exists: true, $ne: "" }					// Neglect empty topics
					}
				},
				{ $unwind: "$topics" },		// Deconstructs an array field from the input documents to output a document for each element. 
				{ $group : { 
					_id: "$topics", 
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

		// After App Redesign (Setting weightage manually through CMS by Zubair, NOT PRACTICAL!)
		else {
			const { db } = req.app.locals;
			const collection = db.collection('topics');

			const { _id, weightage, name, skip, limit } = req.query;
			const query = {};

			if (_id || name) query._id = _id;
			if (weightage) query.weightage = Number(weightage);

			let result;

			if (_id) {		// If _id then findOne
				result = await collection.findOne(query);
			}
			else {
				result = await collection
					.find({ weightage: { $gt: 0 } })								// Finding all with weightage greater than 0
					.sort({ weightage: -1 })									// Sorting by weightage desc
					.project({ '__v': 0, 'added_dtm': 0, 'weightage': 0 })		// Removing these fields from API
					.toArray();
			}
			res.send(result);
		}
	}catch(error){
		console.log(error);
		res.send('Error occured');
	}
};