import Party from '../schemas/Party.js';
import { sanitizeFilter } from 'mongoose';

export const getParties = async (filter) => {
	if (!filter.populate) {
		return await Party.find(sanitizeFilter(filter))
	}
	
	filter.populate = null;
	return await Party.find(sanitizeFilter(filter))
		.populate({ path: 'party', select: '-_id name list' })
}