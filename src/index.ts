import Module from 'module';
import path from 'path';
import fs from 'fs';
import { readSync } from '@xutl/json';

let folder = path.dirname(process.argv[1]);

const substitutions = new Map<RegExp, string>();
//@ts-ignore
const findPath = Module._findPath;
//@ts-ignore
Module._findPath = (id: string, paths: string[], ...args: boolean[]) => {
	for (let [pattern, substitute] of substitutions) {
		if (pattern.test(id)) {
			id = id.replace(pattern, substitute);
			break;
		}
	}
	const result = findPath(id, [folder, ...paths], ...args);
	return result;
};

if (fs.existsSync(folder)) {
	let done = false;
	while (folder && !done) {
		const opt = path.join(folder, 'modules.json');
		if (fs.existsSync(opt)) {
			const config = readSync(opt);
			for (let [key, value] of Object.entries(config)) {
				let mod = path.resolve(folder, `${value}`);
				if (!fs.existsSync(mod)) mod = `${value}`;
				substitutions.set(new RegExp(key), mod);
			}
			done = true;
		} else {
			const nf = path.dirname(folder);
			folder = nf === folder ? '' : nf;
		}
	}
}
