import { describe, it } from '@xutl/test';
import assert from 'assert';

describe('mocking', () => {
	it('works', async () => {
		// @ts-ignore
		const mod = await import('zipper');
		// @ts-ignore
		assert.equal(mod.id, 'mock');
	});
});
