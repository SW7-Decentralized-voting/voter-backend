// Sanitize query string and return an object for Sequelize query

const handleQuery = (query, model) => {
	// Sanitize query string
	let queryObj = { };

	for (const key in query) {
		if (model.schema.paths[key] && typeof query[key] === 'string')
			queryObj[key] = sanitize(query[key].split(','));
		else if (model.schema.paths[key])
			queryObj[key] = sanitize(query[key]);
		else if (key === 'populate' && query[key]) {
			queryObj.populate = query[key];
		}
		else
			throw Error(`Invalid query parameter: ${key}`);
	}

	return queryObj;
};

const sanitize = (string) => {
	if (typeof string !== 'string')
		return string.map(str => str.replace(/[^a-zA-Z0-9]/g, ''));
	return string.replace(/[^a-zA-Z0-9]/g, '');
};

export default handleQuery;