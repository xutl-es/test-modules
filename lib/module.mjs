import { substitute } from './mockdata.cjs';

export function resolve(specifier, context, nextResolve) {
	specifier = substitute(specifier, context.parentURL ? [context.parentURL] : []);
	return nextResolve(specifier, context);
}
