import Party from '../schemas/Party.js';
import { sanitizeFilter } from 'mongoose';

/**
 * Fetches parties from the database that match the filter.
 * @param {Object} filter A query object to filter parties by name and list.
 * @returns {Promise<Array<PartyData>>} An array of parties that match the filter.
 */
export const getParties = async (filter) => {
	return await Party.find(sanitizeFilter(filter));
};

/**
 * @typedef {Object} PartyData
 * @property {ObjectId} _id The id of the party
 * @property {String} name The name of the party
 * @property {String} list The list the party is on
 * @property {NativeDate} createdAt The date the party was created
 * @property {NativeDate} updatedAt The date the party was last updated
 * @property {Number} __v The version of the party
 */