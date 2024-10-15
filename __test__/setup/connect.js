import { connect } from 'mongoose';

let connection, db;

export default async function connectDb() {
  connection =
		connection ||
		await connect(
			global.__MONGO_URI__
		);
  //db = db || connection.db(global.__MONGO_DB_NAME__)
  db = db || connection.connection.db; // Assign the database object

  return db; // Return the database object
}
