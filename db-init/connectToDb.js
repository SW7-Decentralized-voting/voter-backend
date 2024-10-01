// Use sequelize to connect to postgres database
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/candidates', {
	logging: false,
	dialect: 'postgres',
});

export default sequelize;