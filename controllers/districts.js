import NominationDistrict from '../schemas/NominationDistrict.js';
import { sanitizeFilter } from 'mongoose';

/**
 * Fetches nomination districts from the database that match the filter.
 * @param {Object} filter a query object to filter nomination districts by name and constituency
 * @returns {Promise<Array<NominationDistrictData>>} an array of nomination districts that match the filter
 */
export const getNominationDistricts = async (filter) => {
	if (!filter?.populate) {
		return await NominationDistrict.find(sanitizeFilter(filter));
	}
	
	filter.populate = null;
	return await NominationDistrict.find(sanitizeFilter(filter))
		.populate({ path: 'constituency', select: '-_id name' });
};

/**
 * @typedef {Object} NominationDistrictData
 * @property {ObjectId} _id The id of the nomination district
 * @property {String} name The name of the nomination district
 * @property {ObjectId} constituency The id of the constituency the nomination district is in
 * @property {NativeDate} createdAt The date the nomination district was created
 * @property {NativeDate} updatedAt The date the nomination district was last updated
 * @property {Number} __v The version of the nomination district
 */