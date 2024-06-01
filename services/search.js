exports.getSearch = async (req, res) => {
	try{
		const { db } = req.app.locals;
		const collection = db.collection('videos');

		const { term, skip, limit,is_premium } = req.query;
		const query = {};
		query.is_premium = is_premium;
		if (term) query.term = term;
		
		let result;
		let andArr = [];
		if (req.query.category) andArr.push({ category:  {$in: req.query.category.split(',')} });
		andArr.push({ active: true }) // Videos should be active
		// andArr.push({ $text: { $search: `\"${query.term}\"` }}) // Text search on Phrase. More info: https://docs.mongodb.com/manual/reference/operator/query/text/
		andArr.push({ title: { $regex: query.term, $options: 'i' } });

		if (is_premium) {
		} else {
			andArr.push({ is_premium:{ $ne: true} })
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
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
};