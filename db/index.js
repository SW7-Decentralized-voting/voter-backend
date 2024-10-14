import mongoose from 'mongoose';

/**
 * Connect to a MongoDB database using the given URI and options
 * @param {String} uri the URI of the MongoDB database to connect to
 * @param {*} options options to pass to the MongoDB driver
 * @returns the connection object (use .close() to close the connection)
 */
function connectToDb(uri, options = {}) {

	mongoose.connect(uri, options);

	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'MongoDB connection error'));

	return db;
}

export { connectToDb };