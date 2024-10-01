import sequelize from "./connectToDb.js";
import Candidate from "../models/candidates.js";
import Party from "../models/parties.js";
import { parties, candidates } from "./mockData.js";

const populateDb = async () => {
	try {
		Party.hasMany(Candidate);
		Candidate.belongsTo(Party, { foreignKey: 'partyId' });
		await Party.sync();
		await Candidate.sync();
		await Party.bulkCreate(parties);
		await Candidate.bulkCreate(candidates);
		console.log("Database has been populated");
		await sequelize.close();
	} catch (error) {
		console.error("An error has occured:", error);
	}
}

if (process.argv[2] === "force") {
	await Party.sync({ force: true });
	await Candidate.sync({ force: true });
	console.log("Tables have been reset");
} 

populateDb();