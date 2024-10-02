// Make model for candidates
import { DataTypes } from 'sequelize';
import sequelize from '../db-init/connectToDb.js';

const Candidate = sequelize.define('candidates', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	fullName: {
		type: DataTypes.STRING,
		allowNull: false,
		field: 'full_name',
	},
	partyId: {
		type: DataTypes.INTEGER,
		allowNull: true,
		field: 'party_id',
		references: {
			model: 'parties',
			key: 'id',
		},
	},
});

export default Candidate;