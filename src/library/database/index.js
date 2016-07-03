const path = require('path');
const level = require('level');
const ARSON = require('arson');

export async function create(basePath = process.cwd(), options) {
	const directory = path.resolve(basePath, '.level');
	return level(directory, options);
}

export function get(name, db) {
	return new Promise((resolve, reject) => {
		db.get(name, (error, result) => {
			if (error) {
				// reject(error);
			}
			resolve(result);
		})
	})
	.then(payload => {
		try {
			return ARSON.parse(payload);
		} catch (error) {
			return null;
		}
	});
}

export function put(name, payload, db) {
	return new Promise((resolve, reject) => {
		db.put(name, ARSON.stringify(payload), (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}