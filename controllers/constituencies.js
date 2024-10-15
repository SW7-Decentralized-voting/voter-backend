import Constituency from '../schemas/Constituency.js';
import { sanitizeFilter } from 'mongoose';

export const getConstituencies = async (filter) => {
	return await Constituency.find(sanitizeFilter(filter))
}
