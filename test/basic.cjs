const { describe, it } = require('@xutl/test');
const assert = require('assert');

describe('mocking', () => {
	it('works', async () => {
		// @ts-ignore
		const mod = await import('zipper');
		// @ts-ignore
		assert.equal(mod.id, 'mock');
	});
});
