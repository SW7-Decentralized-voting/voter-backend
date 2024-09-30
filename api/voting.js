const { Sequelize, DataTypes } = require('sequelize');

// Create a new instance of Sequelize for the local PostgreSQL database
const sequelize = new Sequelize('candidates', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

/*
CREATE TABLE parties (
    id SERIAL PRIMARY KEY,
    party_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(50) UNIQUE NOT NULL,
    party_id INT REFERENCES parties(id)
);
*/

// Define the models
const Party = sequelize.define('Party', {
    party_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

const Candidate = sequelize.define('Candidate', {
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

// Define the relationships
Party.hasMany(Candidate);
Candidate.belongsTo(Party);

// Fetch all candidates
const getCandidates = async () => {
    return await Candidate.findAll();
};