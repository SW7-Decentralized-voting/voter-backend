import Constituency from '../schemas/Constituency.js';
import { sanitizeFilter } from 'mongoose';
import { ObjectId } from 'mongoose';

/**
 * Fetches constituencies from the database that match the filter.
 * @param {Object} filter A query object to filter constituencies by name.
 * @returns {Promise<Array<ConstituencyData>>} An array of constituencies that match the filter.
 */
export const getConstituencies = async (filter) => {
	return await Constituency.find(sanitizeFilter(filter));
};

/**
 * @typedef {Object} ConstituencyData
 * @property {ObjectId} _id The id of the constituency
 * @property {String} name The name of the constituency
 * @property {NativeDate} createdAt The date the constituency was created
 * @property {NativeDate} updatedAt The date the constituency was last updated
 * @property {Number} __v The version of the constituency
 */
