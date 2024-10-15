import Party from '../schemas/Party.js';
import { sanitizeFilter } from 'mongoose';

export const getParties = async (filter) => {
	return await Party.find(sanitizeFilter(filter));
};