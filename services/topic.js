exports.getTopic = async (req, res) => {

    const db = req.app.locals.db;
    const collection = db.collection('videos');		// Getting direct results from Videos Collection based on total count of each topic

	const { limit, days } = req.query;

	let result;
	// Calculating no.of days
	let today = new Date();
	let oneDay = ( 1000 * 60 * 60 * 24 );
	let customDays;
	if (days) customDays = new Date( today.valueOf() - ( Number(days) * oneDay ) );	// Setting no. of days if provided by query
	let defaultDays = new Date( today.valueOf() - ( 7 * oneDay ) );					// If not provided then default 7
	
	result = await collection.aggregate([
		{ "$match": {
			"added_dtm": { "$gte": customDays || defaultDays }		// Days by Query OR Default
			}
		},
		{ $unwind: "$topics" },		// Deconstructs an array field from the input documents to output a document for each element. 
		{ "$group" : { 
			_id: "$topics", 
			count: { $sum: 1 }		// Grouping by SUM count
			}
		},
		{ $sort: { "count": -1 } },			// Sort by descending order of total counts
		{ $limit: Number(limit) || 50 },	// Limit by query or default 50
		{ $project: {
			"name": "$_id",		// Show _id by name field
			"count": 1,			// Show count field
			_id: 0,				// Remove _id field
			}
		}
	]).toArray();

	res.send(result);
};