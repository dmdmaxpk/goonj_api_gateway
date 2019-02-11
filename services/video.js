exports.getVideo = async (req, res) => {

    const db = req.app.locals.db;
    const collection = db.collection('videos');

	const { _id, category, feed, anchor, guests, topics, pinned, skip, limit, source, program } = req.query;
	let query = {}, feedParams = {};

	if (_id) 	  query._id = _id;
	if (category) query.category = category;
	if (source)   query.source = source;
	if (pinned)   query.pinned = JSON.parse(pinned);		// Conversion of string to Boolean
	if (feed) 	  query.feed = feed;
	if (program)  query.program = program;
	if (anchor)   query.$or = anchor.split(',').map( el => ({anchor: el}) );	// OR query for  Anchor
	if (topics)   query.topics = { $in: topics.split(',') };
	
	query.active = true;	// Get only active videos
	// console.log("Video Query:", query);
	let result;

	if (_id) {		// If _id then findOne

		result = await collection.findOne(query);
		if (result == null) result= [];		// If no result is found then return empty array
	}
	// For APP: Customized feed
	else if ( feed=='myfeed' && (program || anchor || topics || guests) ) {

		// console.log('myfeed---------');
		let feedQuery = [];
		if (program) feedQuery.push({ '$or': program.split(',').map( el => ({program: el}) ) });
		if (anchor)  feedQuery.push({ '$or': anchor.split(',').map( el => ({anchor: el}) ) });
		if (topics)  feedQuery.push({ '$or': [{ topics: { $in: topics.split(',') } }] });
		if (guests)  feedQuery.push({ '$or': [{ guests: { $in: guests.split(',') } }] });
		
		// console.dir(feedQuery, {depth: null});
		
		result = await collection.find( {
			$and: [
				// {$or: [ 
				// 	{ '$or': query.program }, 	// Full form: { '$or': [ { program: 'NewsEye' }, { program: 'To The Point' } ] }
				// 	{ '$or': query.anchor }, 	// Full form: { '$or': [ { anchor: 'Iftikhar Shirazi' }, { anchor: 'Arifa Noor' } ] }

				// For topics 2 ways
				// 	// { '$or': [ { topics: {$in: ['Social Media']} }, { topics: {$in: ['Lahore']} }] },	// Query rps: 59, 120, 120, 121
				// 	// { '$or': [ { topics: {$in: ['Social Media', 'Rights of Women']} }] } 	// Query rps: 60, 129, 99, 118
				// 	// { '$or': [ { topics: query.topics }] }

				// Or all 3 can be combined in one OR
				// {$or: [ { program: 'NewsEye' }, { anchor: 'Faisal Ilyas' }, { topics: {$in: ['Social Media', 'PTI']} } ]},
				// ]},
				
				{ $or: feedQuery },
				{ active: true }
			]
		} ).project({ 'active' : 0, 'transcoding_status' : 0, 'last_modified' : 0, '__v': 0 })
		   .sort({ added_dtm: -1 })
		   .skip( Number(skip) || 0 )
		   .limit( Number(limit) || 16 )
		   .toArray();		// Sorting by added_dtm, default for skip and limit is 0 and 16 respectively
		
	}
	// For App category Pakistan, replicating functionality like on web
	else if ( category == 'pakistan' ){
		console.log('Pakistan');
		result = await collection.find({ '$or': [ { category: 'politics' }, { category: 'entertainment' }, { category: 'technology' }, { category: 'culture' }, { category: 'crime' }, { category: 'economy' }, { category: 'environment' } ] })
								 .project({ 'active' : 0, 'transcoding_status' : 0, 'last_modified' : 0, '__v': 0 })
								 .sort({ added_dtm: -1 })
								 .skip( Number(skip) || 0 )
								 .limit( Number(limit) || 16 )
								 .toArray();		// Sorting by added_dtm, default for skip and limit is 0 and 16 respectively
	}
	// For all the other calls
	else {
		// console.log('else===========');
		result = await collection.find(query)
								 .project({ 'active' : 0, 'transcoding_status' : 0, 'last_modified' : 0, '__v': 0 })
								 .sort({ added_dtm: -1 })
								 .skip( Number(skip) || 0 )
								 .limit( Number(limit) || 16 )
								 .toArray();		// Sorting by added_dtm, default for skip and limit is 0 and 16 respectively

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