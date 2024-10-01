// Make model for candidates
import { DataTypes } from 'sequelize';
import sequelize from '../db-init/connectToDb.js';

const Candidate = sequelize.define('candidates', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	full_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	partyId: {
		type: DataTypes.INTEGER,
		field: 'party_id',
		allowNull: false,
	},
});

export default Candidate;