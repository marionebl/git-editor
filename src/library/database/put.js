import ARSON from 'arson';

export async function put(name, payload, db) {
	return db.setItem(name, ARSON.stringify(payload));
}

export default put;
