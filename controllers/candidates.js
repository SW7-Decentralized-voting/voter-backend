// Controllers for candidates

import Candidate from '../models/candidates.js';
import Party from '../models/parties.js';

export const getCandidates = async (filter) => {
	Candidate.hasOne(Party, { sourceKey: 'partyId', foreignKey: 'id' });
	return await Candidate.findAll(filter);
};