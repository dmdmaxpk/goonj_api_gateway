exports.getAnchor = async (req, res) => {

    const db = req.app.locals.db;
    const collection = db.collection('anchors');

	const { _id, weightage } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (weightage) query.weightage = Number(weightage);
	// console.log("Anchors Query:", query);

	let result;

	if (_id) {		// If _id then findOne
		result = await collection.findOne(query);
	}
	else {
		result = await collection.find(query).sort({weightage:-1}).toArray();	// Sorting by weightage descending
	}
	res.send(result);
};