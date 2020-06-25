import { describe, it } from '@xutl/test';
import assert from 'assert';

import * as modules from '../';

describe('mocking', () => {
	it('loaded', () => assert(modules));
	it('works', async () => {
		// @ts-ignore
		const mod = await import('zipper');
		// @ts-ignore
		assert.equal(mod.id, 'mock');
	});
});
