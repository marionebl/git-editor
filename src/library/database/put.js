import ARSON from 'arson';

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

export default put;
