import path from 'path';
import {LocalStorage} from 'node-localstorage';

export async function create(basePath = process.cwd(), options) {
	const directory = path.resolve(basePath, '.localstorage');
	return new LocalStorage(directory);
}

export default create;
