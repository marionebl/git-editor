import ARSON from 'arson';

export function get(name, db) {
	return new Promise(resolve => {
		db.get(name, (_, result) => {
			resolve(result);
		});
	})
	.then(payload => {
		try {
			return ARSON.parse(payload);
		} catch (error) {
			return null;
		}
	});
}

export default get;
