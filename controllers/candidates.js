// Controllers for candidates

import Candidate from '../schemas/Candidate.js';
import { sanitizeFilter } from 'mongoose';

/**
 * Fetches candidates from the database that match the filter.
 * @param {object} filter A query object to filter candidates by party, nominationDistrict, name. The populate key is used to populate the party and nominationDistrict fields.
 * @returns {Promise<Array<CandidateData>>} An array of candidates that match the filter.
 */
export const getCandidates = async (filter) => {
	// If the populate key is not present, return the candidates without populating the party and nominationDistrict fields.
	if (!filter?.populate) { 
		return await Candidate.find(sanitizeFilter(filter));
	}

	// If the populate key is present, populate the party and nominationDistrict fields.
	filter.populate = null; 
	return await Candidate.find(sanitizeFilter(filter))
		.populate({ path: 'party', select: '-_id name list' })
		.populate({
			path: 'nominationDistrict',
			select: '-_id name constituency',
			populate: { path: 'constituency', select: '-_id name' }
		});


};

/**
 * @import { ObjectId } from 'mongoose';
 * @typedef {object} CandidateData
 * @property {ObjectId} _id The id of the candidate
 * @property {string} name The name of the candidate
 * @property {ObjectId} party The id of the party the candidate is a member of
 * @property {ObjectId} nominationDistrict The id of the nomination district the candidate is running in
 * @property {Date} createdAt The date the candidate was created
 * @property {Date} updatedAt The date the candidate was last updated
 * @property {number} __v The version of the candidate
 */