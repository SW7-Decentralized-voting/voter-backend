import PortMapping from '../schemas/PortMapping.js';

/**
 * Get the polling station ID by port number
 * @param {Request} req Express request object with the port number as a parameter
 * @param {Response} res Express response object
 * @returns {Response} The polling station ID and service name for the given port or an error message
 */
export default async function getStationIdByPort(req, res) {
	const { port } = req.params;

	if (!port) {
		return res.status(400).send('Port number is required');
	}

	const portNumber = parseInt(port, 10);

	if (isNaN(portNumber)) {
		return res.status(400).send('Port number must be a number');
	}

	const portMapping = await PortMapping.findOne({ port: portNumber });

	if (!portMapping) {
		return res.status(404).send('Port not found');
	}

	return res.status(200).json({
		port: portMapping.port,
		service: portMapping.service,
	});
}

/**
 * @import { Request, Response } from 'express';
 */