const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');

const substitutions = loadMockTable();

exports.substitute = function substitute(spec, parents) {
	let specURL = urlOf(spec, parents);
	for (let [pattern, substitute] of substitutions) {
		if (pattern.test(specURL)) {
			specURL = `${substitute}`;
			if (process.env.DEBUG) console.error(`# Module: ${spec} -> ${specURL}`);
			return `${specURL}`;
		}
	}
	if (fileURLExists(specURL)) {
		if (false && process.env.DEBUG) console.error(`# Resolved: ${spec} -> ${specURL}`);
		return `${specURL}`;
	}
	if (false && process.env.DEBUG) console.error(`# Original: ${spec}`);
	return `${spec}`;
};
exports.pathOf = function pathOf(spec) {
	if (`${spec}`.startsWith('file://')) {
		return `${fs.realpathSync.native(`${url.fileURLToPath(spec)}`)}`;
	} else {
		return `${spec}`;
	}
};
function fileURLExists(fileURL) {
	if (!`${fileURL}`.startsWith('file://')) return false;
	try {
		const file = url.fileURLToPath(fileURL);
		if (fs.statSync(file).isFile()) {
			return true;
		}
	} catch (e) {
		if (e.code !== 'ENOENT') console.error(e);
	}
	return false;
}
function urlOf(spec, parents) {
	if (!spec.startsWith(`../`) && !spec.startsWith(`./`)) return spec;
	for (const p of parents) {
		const candidate = `${new url.URL(spec, p)}`;
		if (!candidate.startsWith('file://')) continue;
		if (fileURLExists(candidate)) {
			return `${url.pathToFileURL(fs.realpathSync.native(url.fileURLToPath(candidate)))}`;
		}
		for (const ext of ['.js', '.mjs', '.cjs', '.node', '/index.js', '/index.mjs', '/index.cjs', '/index.node']) {
			if (fileURLExists(`${candidate}${ext}`)) {
				return `${url.pathToFileURL(fs.realpathSync.native(url.fileURLToPath(`${candidate}${ext}`)))}`;
			}
		}
	}
	return spec;
}

function loadTable(file, substitutions = new Map()) {
	file = path.resolve(file);
	const folder = path.dirname(file);
	const config = JSON.parse(fs.readFileSync(file, 'utf-8'));
	for (let [key, value] of Object.entries(config)) {
		if (key === 'include') {
			value = [value].flat().forEach((item) => {
				loadTable(path.resolve(folder, `${item}`), substitutions);
			});
		} else {
			value = urlOf(value, [`${url.pathToFileURL(folder)}/`]);
			if (process.env.DEBUG) console.error(`# Substitution: ${key} => ${value}`);
			substitutions.set(new RegExp(key), `${value}`);
		}
	}
	return substitutions;
}
function loadMockTable() {
	let folder = process.argv[1] ? path.dirname(path.resolve(process.argv[1])) : process.cwd();
	if (process.env.MOCK_TABLE) return loadTable(process.env.MOCK_TABLE);
	while (folder && fs.existsSync(folder)) {
		const opt = path.join(folder, 'modules.json');
		if (fs.existsSync(opt)) return loadTable(opt);
		const nf = path.dirname(folder);
		folder = nf === folder ? '' : nf;
	}
	return new Map();
}
