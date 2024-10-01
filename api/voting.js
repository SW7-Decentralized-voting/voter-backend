import { Sequelize, DataTypes } from 'sequelize';

// Create a new instance of Sequelize for the local PostgreSQL database
const sequelize = new Sequelize('candidates', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        // eslint-disable-next-line no-console
        console.error('Unable to connect to the database:', err);
    });

// Define the models
const Party = sequelize.define('Party', {
    party_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'parties', // Explicitly specify the table name
    timestamps: false // Disable timestamps
});

const Candidate = sequelize.define('Candidate', {
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    party_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Party,
            key: 'id'
        }
    }
}, {
    tableName: 'candidates', // Explicitly specify the table name
    timestamps: false // Disable timestamps
});

// Define the relationships
Party.hasMany(Candidate, { foreignKey: 'party_id' });
Candidate.belongsTo(Party, { foreignKey: 'party_id' });

// Fetch all candidates
const getCandidates = async () => {
    return await Candidate.findAll();
};

export { getCandidates };