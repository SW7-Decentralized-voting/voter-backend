import NominationDistrict from "../schemas/NominationDistrict.js";
import { sanitizeFilter } from 'mongoose';

export const getNominationDistricts = async (filter) => {
	if (!filter.populate) {
		return await NominationDistrict.find(sanitizeFilter(filter))
	}
	
	filter.populate = null;
	return await NominationDistrict.find(sanitizeFilter(filter))
		.populate({ path: 'constituency', select: '-_id name' })
}
