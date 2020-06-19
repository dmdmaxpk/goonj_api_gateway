exports.getSearch = async (req, res) => {

    const { db } = req.app.locals;
    const collection = db.collection('videos');

	const { term, skip, limit,is_premium } = req.query;
	const query = {};
	query.is_premium = is_premium;
	if (term) query.term = term;

	let result;
		
	result = await collection
		.find({ 
			$and: [												// AND condition
				{ active: true }, 								// Videos should be active
				{ $text: { $search: `\"${query.term}\"` } } 	// Text search on Phrase. More info: https://docs.mongodb.com/manual/reference/operator/query/text/
			] 
		})
		.project({ 'active' : 0, 'transcoding_status' : 0, 'last_modified' : 0, '__v': 0 })
		.sort({ publish_dtm: -1 })			// Sort by desc publish_dtm
		.skip( Number(skip) || 0 )			// Skip by query or default 0
		.limit( Number(limit) || 16 )		// Limit by query or default 16
		.toArray();

	res.send(result);
};