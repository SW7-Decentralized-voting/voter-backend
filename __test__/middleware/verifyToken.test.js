import jwt from 'jsonwebtoken';
import { auth } from '../../middleware/verifyToken.js';
import { jest } from '@jest/globals';

jest.unstable_mockModule('jsonwebtoken', () => {
	return {
		verify: jest.fn(),
	};
});

describe('auth', () => {
	let req, res, next;

	beforeEach(() => {
		req = {
			headers: {}
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		next = jest.fn();
	});

	it('should return 401 if no token is provided', () => {
		auth(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
	});

	it('should return 401 if token is invalid', () => {
		req.headers['authorization'] = 'invalidToken';
		jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error(); });

		auth(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Failed to authenticate token' });
	});

	it('should call next if token is valid', () => {
		const decodedToken = { id: 'userId' };
		req.headers['authorization'] = 'validToken';
		jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken);

		auth(req, res, next);

		expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_KEY);
		expect(req.user).toEqual(decodedToken);
		expect(next).toHaveBeenCalled();
	});
});