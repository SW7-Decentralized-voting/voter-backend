import Constituency from '../schemas/Constituency.js';
import { sanitizeFilter } from 'mongoose';

/**
 * Fetches constituencies from the database that match the filter.
 * @param {object} filter A query object to filter constituencies by name.
 * @returns {Promise<Array<ConstituencyData>>} An array of constituencies that match the filter.
 */
export const getConstituencies = async (filter) => {
	return await Constituency.find(sanitizeFilter(filter));
};

/**
 * @import { ObjectId } from 'mongoose';
 * @typedef {object} ConstituencyData
 * @property {ObjectId} _id The id of the constituency
 * @property {string} name The name of the constituency
 * @property {Date} createdAt The date the constituency was created
 * @property {Date} updatedAt The date the constituency was last updated
 * @property {number} __v The version of the constituency
 */
