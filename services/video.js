exports.getVideo = async (req, res) => {

    const { db } = req.app.locals;
    const collection = db.collection('videos');

	const { _id, category, feed, anchor, topics, pinned, skip, limit, source, program, file_name } = req.query;
	let query = {};

	if (_id) 	  	query._id = _id;
	if (source)   	query.source = source;
	if (pinned)   	query.pinned = JSON.parse(pinned);		// Conversion of string to Boolean
	if (feed) 	  	query.feed = feed;
	if (program)  	query.program = program;
	if (anchor)   	query.$or = anchor.split(',').map( el => ({ anchor: el }) );	// OR query for Anchor
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
	else if ( (feed == 'myfeed' || category == 'myfeed') && (program || anchor || topics) ) {		// Remove feed after user adoption as category is used for consistency

		let feedQuery = [];
		if (program) feedQuery.push({ '$or': program.split(',').map( el => ({ program: el }) )});	// Sample: { '$or': [ { program: 'NewsEye' }, { program: 'To The Point' } ] }
		if (anchor)  feedQuery.push({ '$or': anchor.split(',').map( el => ({ anchor: el }) )});		// Sample: { '$or': [ { anchor: 'Iftikhar Shirazi' }, { anchor: 'Arifa Noor' } ] }
		if (topics)  feedQuery.push({ '$or': [{ topics: { $in: topics.split(',') } }] });			// Sample: { '$or': [ { topics: {$in: ['Social Media', 'Rights of Women']} }] } 
			
		result = await collection
			.find({
				$and: [	
					{ $or: feedQuery },		// OR between programs, anchors & topics
					{ active: true }		// Videos should be active
				]
			})
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })		// Removing these fields from API
			.sort({ publish_dtm: -1 })		// Sorting by publish_dtm desc
			.skip( Number(skip) || 0 )		// if provided in query param otherwise 0
			.limit( Number(limit) || 16 )	// if provided in query param otherwise 16
			.toArray();
	}

	// For App category: pakistan, replicating functionality same as web which contains further categories
	else if ( category == 'pakistan' ) {
		result = await collection
			.find({
				active: true,	// Videos should be active
				'$or': [		// Can be of any following category
					{ category: 'politics' },
					{ category: 'entertainment' },
					{ category: 'technology' },
					{ category: 'culture' },
					{ category: 'law & order' },
					{ category: 'economy' },
					{ category: 'environment' }
				]
			})
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })		// Removing these fields from API
			.sort({ publish_dtm: -1 })		// Sorting by publish_dtm desc
			.skip( Number(skip) || 0 )		// if provided in query param otherwise 0
			.limit( Number(limit) || 16 )	// if provided in query param otherwise 16
			.toArray();
	}

	// For App category: Top Stories
	else if ( category == 'topstories' ) {
		result = await collection
			.find({ active: true, topics: 'Top Story' })		// Find all videos which has a topic 'Top Story'
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })		// Removing these fields from API
			.sort({ publish_dtm: -1 })		// Sorting by publish_dtm desc
			.skip( Number(skip) || 0 )		// if provided in query param otherwise 0
			.limit( Number(limit) || 16 )	// if provided in query param otherwise 16
			.toArray();
	
		// For showing pinned videos in Top Stories tab
		let [ pinned ] = await collection
			.find({ pinned: true })		// Finding if any video is marked true for pinned field
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })		// Removing these fields from API
			.toArray();

		// Unshift - injecting the pinned video at index 0
		if (pinned) result.unshift(pinned);
	}

	// For App category: Premium
	else if ( category == 'premium' ) {
		result = await collection
			.find({ active: true, category: 'premium' })	// Find all videos with category 'premium'
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })		// Removing these fields from API
			.sort({ publish_dtm: -1 })		// Sorting by publish_dtm desc
			.skip( Number(skip) || 0 )		// if provided in query param otherwise 0
			.limit( Number(limit) || 16 )	// if provided in query param otherwise 16
			.toArray();
	}

	// For all the other calls
	else {
		result = await collection
			.find(query)
			.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })		// Removing these fields from API
			.sort({ publish_dtm: -1 })		// Sorting by publish_dtm desc
			.skip( Number(skip) || 0 )		// if provided in query param otherwise 0
			.limit( Number(limit) || 16 )	// if provided in query param otherwise 16
			.toArray();
	}

	res.send(result);
}

exports.postVideoViews = async (req, res) => {
    const post = req.body;
    let data = await axios.post(`${config.goonjService}/videoViews`, post);
    res.send(data);
}