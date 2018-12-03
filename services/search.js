exports.getSearch = async (req, res) => {

    const db = req.app.locals.db;
    const collection = db.collection('videos');

	const { term, skip, limit } = req.query;
	const query = {};

	if (term) query.term = term;

	let result;
		
	result = await collection.find( { $and: [ { active: true }, { $text: { $search: `\"${query.term}\"` } } ] } )	// Exact Phrase text search
							.project({ 'active' : 0, 'transcoding_status' : 0, 'last_modified' : 0, '__v': 0 })
							.sort({ added_dtm: -1 })
							.skip( Number(skip) || 0 )
							.limit( Number(limit) || 16 )
							.toArray();

	res.send(result);
};