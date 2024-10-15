// Controllers for candidates

import Candidate from '../schemas/Candidate.js';

export const getCandidates = async (filter) => {
	return await Candidate.find(filter);
};