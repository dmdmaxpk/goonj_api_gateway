exports.getTopic = async (req, res) => {

    const db = req.app.locals.db;
    const collection = db.collection('topics');

	const { _id, weightage, name, skip, limit } = req.query;
	const query = {};

	if (_id || name) query._id = _id;
	if (weightage) query.weightage = Number(weightage);
	console.log("Topic Query:", query);

	let result;

	if (_id) {		// If _id then findOne
		result = await collection.findOne(query);
	}
	else {
		result = await collection.find(query).sort({weightage:-1}).skip( Number(skip) || 0 ).limit( Number(limit) || 16 ).toArray();
	}
	res.send(result);
};