// Make model for parties
import sequelize from '../db-init/connectToDb.js';
import { DataTypes } from 'sequelize';


const Party = sequelize.define('parties', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	party_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

export default Party;