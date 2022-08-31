const fs = require('node:fs');
const path = require('node:path');

const substitutions = loadMockTable();

exports.substitute = function substitute(spec) {
	const orig = spec;
	for (let [pattern, substitute] of substitutions) {
		if (pattern.test(spec)) {
			spec = spec.replace(pattern, substitute);
			break;
		}
	}
	if (process.env.DEBUG && orig !== spec) {
		console.error(`# Module: ${orig} -> ${spec}`);
	}

	return spec;
};
function loadTable(file, substitutions = new Map()) {
	file = path.resolve(file);
	const folder = path.dirname(file);
	const config = JSON.parse(fs.readFileSync(file, 'utf-8'));
	for (let [key, value] of Object.entries(config)) {
		if (key === 'include') {
			loadTable(path.resolve(folder, `${value}`), substitutions);
		} else {
			let mod = path.resolve(folder, `${value}`);
			if (!fs.existsSync(mod)) mod = `${value}`;
			substitutions.set(new RegExp(key), mod);
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
