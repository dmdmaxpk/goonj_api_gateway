const axios = require('axios');
const config = require('../config');

exports.getVideo = async (req, res) => {
	try{
		const { db } = req.app.locals;
		const collection = db.collection('videos');

		const { _id, category, sub_category, feed, anchor, topics, pinned, skip, limit, source, program, file_name,is_premium } = req.query;
		let query = {};

		if (_id) 	  	query._id = _id;
		if (sub_category)   	query.sub_category = sub_category;
		if (source)   	query.source = source;
		if (pinned)   	query.pinned = JSON.parse(pinned);		// Conversion of string to Boolean
		if (feed) 	  	query.feed = feed;
		if (program)  	query.program = program;
		if (anchor)   	query.$or = anchor.split(',').map( el => ({ anchor: el }) );	// OR query for Anchor
		if (topics)   	query.topics = { $in: topics.split(',') };
		if (file_name)  query.file_name = file_name;
		
		query.category = category ? category : { $ne: 'premium' };		// Exclude premium category videos
		if (is_premium) {
		} else {
			query.is_premium = {$ne: true};
		}

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
				.sort({ pinned: -1, publish_dtm: -1 })		// Sorting by publish_dtm desc
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
				.sort({ pinned: -1, publish_dtm: -1 })		// Sorting by publish_dtm desc
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
				.sort({ pinned: -1, publish_dtm: -1 })		// Sorting by publish_dtm desc
				.skip( Number(skip) || 0 )		// if provided in query param otherwise 0
				.limit( Number(limit) || 16 )	// if provided in query param otherwise 16
				.toArray();
		}

		// For all the other calls
		else {
			result = await collection
				.find(query)
				.project({ 'active': 0, 'transcoding_status': 0, 'last_modified': 0, '__v': 0, 'pinned': 0 })		// Removing these fields from API
				.sort({ pinned: -1, publish_dtm: -1 })		// Sorting by publish_dtm desc
				.skip( Number(skip) || 0 )		// if provided in query param otherwise 0
				.limit( Number(limit) || 16 )	// if provided in query param otherwise 16
				.toArray();
		}

		res.send(result);
	}catch(error){
		console.log(error);
		res.send('Error occured');
	}
}

exports.dummy = async(req, res) => {
	console.log(req);
	res.send("Dummy Response Sent");
}

exports.recommendations = async (req, res) => {
	try{
		if (req.query.id && req.query.mode === 'collaborative'){
			axios.get(`${config.recommenderService}/user_collaborative_recommendations?user_id=${req.query.id}&mode=${req.query.mode}`)
				.then(function (response) {
					res.send(response.data);
				}).catch(err => {
				console.log('recommendations - Error: ', err);
				res.send({'code': -1, 'message': 'Error while computing recommendations!', details: err.message});
			});
		}else if (req.query.id && req.query.msisdn){
			axios.get(`${config.recommenderService}/user_history_wise_recommendations?video_id=${req.query.id}&msisdn=${req.query.msisdn}`)
				.then(function (response) {
					res.send(response.data);
				}).catch(err => {
				console.log('recommendations - Error: ', err);
				res.send({'code': -1, 'message': 'Error while computing recommendations!', details: err.message});
			});
		}else if(req.query.id){
			axios.get(`${config.goonjService}/video/recommended?_id=${req.query.id}`)
				.then(function (response) {
					res.send(response.data);
				}).catch(err => {
				console.log('recommendations - Error: ', err);
				res.send({'code': -1, 'message': 'Error while computing recommendations!', details: err.message});
			});
		}
		else{
			res.send({'code': -1, 'message': 'Invalid query string params'});
		}
	}catch(err){
		console.log(err);
		res.send('Error occured');
	}
}

exports.postVideoViews = async (req, res) => {
	try{
		let {data} = await axios.post(`${config.goonjService}/videoViews`, req.body);
		res.send(data);
	}catch(err){
		console.log(err);
		res.send('Error occured');
	}
}

exports.addAsNext = async (req, res) => {
	try {
		const { db } = req.app.locals;
		const {_id, subCategory} = req.body;
		const collection = db.collection('videos');
	
		let lastEpisode = await collection.find({sub_category: subCategory}).sort({episode: -1});
		console.log('lastEpisode', lastEpisode);
		lastEpisode = lastEpisode.length > 0 ? lastEpisode[0] : undefined;
		
		let episodeNumber
		if (lastEpisode && lastEpisode.episode) episodeNumber = Number(lastEpisode.episode) + 1;
		else episodeNumber = 1;
	
		const result = await collection.findOneAndUpdate({_id}, {$set: {episode: episodeNumber, last_episode: lastEpisode ? lastEpisode._id : undefined} });
		console.log('result', result);
		let updateLastEpisode;
		if (lastEpisode._id !== _id) {
			updateLastEpisode = await collection.findOneAndUpdate({_id: lastEpisode._id}, {$set: {next_video: _id}});
			console.log('updateLastEpisode', updateLastEpisode);
		}
		res.send({lastVideo: updateLastEpisode, currentVideo: result});
	} catch (err) {
		console.log('err', err);
		res.send(err)
	}
}