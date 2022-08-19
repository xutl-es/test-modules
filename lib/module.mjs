import { substitute } from './mockdata.cjs';

export function resolve(specifier, context, nextResolve) {
	specifier = substitute(specifier);
	return nextResolve(specifier, context);
}
