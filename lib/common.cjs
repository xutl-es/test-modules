const { Module } = require('node:module');
const { pathToFileURL } = require('node:url');
const { substitute, pathOf } = require('./mockdata.cjs');

const findPath = Module._findPath;
Module._findPath = (id, paths, ...args) => {
	id = substitute(
		id,
		(paths ?? []).map((p) => `${pathToFileURL(p)}/`),
	);
	return findPath(pathOf(id), paths, ...args);
};
