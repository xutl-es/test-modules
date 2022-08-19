const { Module } = require('node:module');
const { substitute } = require('./mockdata.cjs');

const findPath = Module._findPath;
Module._findPath = (id, paths, ...args) => {
	id = substitute(id);
	return findPath(id, paths, ...args);
};
