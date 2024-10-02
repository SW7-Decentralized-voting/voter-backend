import Party from '../models/parties.js';

export const getParties = async () => {
	return await Party.findAll();
};