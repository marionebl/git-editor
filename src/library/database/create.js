import path from 'path';
import level from 'level';

export async function create(basePath = process.cwd(), options) {
	const directory = path.resolve(basePath, '.level');
	return level(directory, options);
};

export default create;
