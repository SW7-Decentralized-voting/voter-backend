import Party from '../schemas/Party.js';
import { sanitizeFilter } from 'mongoose';

/**
 * Fetches parties from the database that match the filter.
 * @param {object} filter A query object to filter parties by name and list.
 * @returns {Promise<Array<PartyData>>} An array of parties that match the filter.
 */
export const getParties = async (filter) => {
	return await Party.find(sanitizeFilter(filter));
};

/**
 * @import { ObjectId } from 'mongoose';
 * @typedef {object} PartyData
 * @property {ObjectId} _id The id of the party
 * @property {string} name The name of the party
 * @property {string} list The list the party is on
 * @property {Date} createdAt The date the party was created
 * @property {Date} updatedAt The date the party was last updated
 * @property {number} __v The version of the party
 */