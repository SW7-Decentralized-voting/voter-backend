// Controllers for candidates

import Candidate from '../schemas/Candidate.js';
import { sanitizeFilter } from 'mongoose';

export const getCandidates = async (filter) => {
	if (!filter?.populate) {
		return await Candidate.find(sanitizeFilter(filter));
	}

	filter.populate = null;
	return await Candidate.find(sanitizeFilter(filter))
		.populate({ path: 'party', select: '-_id name list' })
		.populate({
			path: 'nominationDistrict',
			select: '-_id name constituency',
			populate: { path: 'constituency', select: '-_id name' }
		});


};