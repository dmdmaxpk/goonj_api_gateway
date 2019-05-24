exports.getVideo = async (req, res) => {

    const db = req.app.locals.db;
    const collection = db.collection('videos');

	const { _id, category, feed, anchor, topics, pinned, skip, limit, source, program, file_name } = req.query;
	let query = {};

	if (_id) 	  	query._id = _id;
	if (source)   	query.source = source;
	if (pinned)   	query.pinned = JSON.parse(pinned);		// Conversion of string to Boolean
	if (feed) 	  	query.feed = feed;
	if (program)  	query.program = program;
	if (anchor)   	query.$or = anchor.split(',').map( el => ({anchor: el}) );	// OR query for Anchor
	if (topics)   	query.topics = { $in: topics.split(',') };
	if (file_name)  query.file_name = file_name;
	
	query.category = category ? category : { $ne: 'premium' };		// Exclude premium category videos

	query.active = true;	// Get only active videos
	let result;

	if (_id) {		// If _id then findOne

		result = await collection.findOne(query);
		if (result == null) result= [];		// If no result is found then return empty array
	}

	// For App category: My Feed, customized feed
	else if ( (feed == 'myfeed' || category == 'myfeed') && (program || anchor || topics) ) {

		let feedQuery = [];
		if (program) feedQuery.push({ '$or': program.split(',').map( el => ({program: el}) ) });	// Sample: { '$or': [ { program: 'NewsEye' }, { program: 'To The Point' } ] }
		if (anchor)  feedQuery.push({ '$or': anchor.split(',').map( el => ({anchor: el}) ) });		// Sample: { '$or': [ { anchor: 'Iftikhar Shirazi' }, { anchor: 'Arifa Noor' } ] }
		if (topics)  feedQuery.push({ '$or': [{ topics: { $in: topics.split(',') } }] });			// Sample: { '$or': [ { topics: {$in: ['Social Media', 'Rights of Women']} }] } 
			
		result = await collection
			.find({
				$and: [
					{ $or: feedQuery },
					{ active: true }
				]
			})
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })		// Hiding these fields
			.sort({ added_dtm: -1 })
			.skip( Number(skip) || 0 )
			.limit( Number(limit) || 16 )
			.toArray();		// Sorting by added_dtm, default for skip and limit is 0 and 16 respectively
	}

	// For App category: Pakistan, replicating functionality same as web which contains further categories
	else if ( category == 'pakistan' ) {
		result = await collection
			.find({
				active: true,
				'$or': [
					{ category: 'politics' },
					{ category: 'entertainment' },
					{ category: 'technology' },
					{ category: 'culture' },
					{ category: 'law & order' },
					{ category: 'economy' },
					{ category: 'environment' }
				]
			})
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })
			.sort({ added_dtm: -1 })
			.skip( Number(skip) || 0 )
			.limit( Number(limit) || 16 )
			.toArray();		// Sorting by added_dtm, default for skip and limit is 0 and 16 respectively
	}

	// For App category: Top Stories
	else if ( category == 'topstories' ) {
		result = await collection
			.find({ active: true, topics: 'Top Story' })
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })
			.sort({ added_dtm: -1 })
			.skip( Number(skip) || 0 )
			.limit( Number(limit) || 16 )
			.toArray();		// Sorting by added_dtm, default for skip and limit is 0 and 16 respectively
	
		let [ pinned ] = await collection
			.find({ pinned: true })
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })
			.toArray();

		result.unshift(pinned);
	}

	// For App category: Premium
	else if ( category == 'premium' ) {
		result = await collection
			.find({ active: true, category: 'premium' })
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })
			.sort({ added_dtm: -1 })
			.skip( Number(skip) || 0 )
			.limit( Number(limit) || 16 )
			.toArray();		// Sorting by added_dtm, default for skip and limit is 0 and 16 respectively
	}

	// For all the other calls
	else {
		result = await collection
			.find(query)
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })
			.sort({ added_dtm: -1 })
			.skip( Number(skip) || 0 )
			.limit( Number(limit) || 16 )
			.toArray();		// Sorting by added_dtm, default for skip and limit is 0 and 16 respectively
	}

	res.send(result);
};