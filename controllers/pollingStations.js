import PortMapping from "../schemas/PortMapping";

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