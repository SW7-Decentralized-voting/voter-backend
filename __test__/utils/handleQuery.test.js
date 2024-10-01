// Tests for /utils/handleQuery.js

import handleQuery from '../../utils/handleQuery.js';

describe('handleQuery', () => {
	it('should return an object with where key', () => {
		const query = {
			partyId: '1',
		};
		const model = {
			rawAttributes: {
				partyId: {
					type: 'INTEGER',
				},
			},
		};
		const result = handleQuery(query, model);
		expect(result).toEqual({ where: { partyId: '1' } });
	});

	it('should return an object with where key for multiple query string', () => {
		const query = {
			partyId: '1',
			full_name: 'John',
		};
		const model = {
			rawAttributes: {
				partyId: {
					type: 'INTEGER',
				},
				full_name: {
					type: 'STRING',
				},
			},
		};
		const result = handleQuery(query, model);
		expect(result).toEqual({ where: { partyId: '1', full_name: 'John' } });
	});

	it('should throw an error for invalid query string', () => {
		const query = {
			invalid: '1',
		};
		const model = {
			rawAttributes: {
				partyId: {
					type: 'INTEGER',
				},
			},
		};
		expect(() => handleQuery(query, model)).toThrow('Invalid query parameter: invalid');
	});

	it('should sanitize query string', () => {
		const query = {
			partyId: '1+"*@',
			full_name: 'Jo#hn"',
		};
		const model = {
			rawAttributes: {
				partyId: {
					type: 'INTEGER',
				},
				full_name: {
					type: 'STRING',
				},
			},
		};
		const result = handleQuery(query, model);
		expect(result).toEqual({ where: { partyId: '1', full_name: 'John' } });
	});
});