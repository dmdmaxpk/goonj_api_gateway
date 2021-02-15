const axios = require('axios');
const config = require('../config');

exports.getChannel = async (req, res) => {

    const { db } = req.app.locals;
    const collection = db.collection('channels');

	let { _id, slug, package_id } = req.query;
	const query = {};

	const country = req.headers['http_country_code'];
	if(country){
        console.log("Request From: "+country);
	}else{
		console.log("No country available!")
	}

	if (_id) query._id = _id;
	if (slug) query.slug = slug;
	if (!package_id) package_id = undefined;

	query.active = true;	// Only returning the active channels
	let aggregationPipeline =  [];
	// we need to unwind the package_id array and perform matching then regroup its
	let match = { $match : query};
	let unwind = { $unwind : "$package_id" };
	let group = { $group : 
					{
						_id : "$_id",
						ad_tag: { $first : "$ad_tag" },
						views_count : { $first : "$views_count" },
						name : { $first : "$name" },
						hls_link : { $first : "$hls_link" },
						slug : { $first : "$slug" },
						thumbnail : { $first : "$thumbnail" },
						package_id : { $addToSet: "$package_id" },
						seq: {$first : "$seq"},
						is_streamable : { $max : { $eq : [ "$package_id", package_id ] }}
					}
				}
	let sort = { $sort: {seq: 1	}};
	aggregationPipeline = [match,unwind,group,sort];
	let result;
	try {
		result = await collection.aggregate(aggregationPipeline).toArray();
	} catch  (err) {
		console.log("Error",err)
	}
		
	res.send(result);
}

exports.postChannelViews = async (req, res) => {
	res.send("Done");
	
	//let {data} = await axios.post(`${config.goonjService}/channelViews`, req.body);
    //res.send(data);
}

exports.channelCategoryWise = async (req,res) => {
	let { data } = await axios.get(`${config.goonjService}/channel/channel-category-wise`);
	res.send(data);
}