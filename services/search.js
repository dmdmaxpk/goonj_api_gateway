exports.getSearch = async (req, res) => {

    const { db } = req.app.locals;
    const collection = db.collection('videos');

	const { term, skip, limit,is_premium } = req.query;
	const query = {};
	query.is_premium = is_premium;
	if (term) query.term = term;

	let result;
	let andArr = [];
	andArr.push({ active: true }) // Videos should be active
	andArr.push({ $text: { $search: `\"${query.term}\"` }}) // Text search on Phrase. More info: https://docs.mongodb.com/manual/reference/operator/query/text/
	if (is_premium) {
		andArr.push({ active: true })
	} else {
		andArr.push({ active:{ $ne: true} })
	}
	
	result = await collection
		.find({ 
			$and:  andArr	 
		})
		.project({ 'active' : 0, 'transcoding_status' : 0, 'last_modified' : 0, '__v': 0 })
		.sort({ publish_dtm: -1 })			// Sort by desc publish_dtm
		.skip( Number(skip) || 0 )			// Skip by query or default 0
		.limit( Number(limit) || 16 )		// Limit by query or default 16
		.toArray();

	res.send(result);
};