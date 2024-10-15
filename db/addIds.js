import Constituency from '../schemas/Constituency.js';
import NominationDistrict from '../schemas/NominationDistrict.js';
import Party from '../schemas/Party.js';

export async function districtsWithIds(districts) {
	return await Promise.all(
		districts.map(async district => {
			const constituency = await Constituency.findOne({ name: district.constituency });

			return {
				...district,
				constituency: constituency._id,  // Map the ObjectId of the found constituency
			};
		})
	);
}

export async function candidateWithIds(candidates) {
	return await Promise.all(
		candidates.map(async candidate => {
			const party = await Party.findOne({ name: candidate.party });
			const nominationDistrict = await NominationDistrict.findOne({ name: candidate.nominationDistrict });

			return {
				...candidate,
				party: party._id,
				nominationDistrict: nominationDistrict._id,
			};
	}));
}