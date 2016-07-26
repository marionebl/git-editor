import ARSON from 'arson';

export async function get(name, db) {
	const persisted = db.getItem(name);

	if (!persisted) {
		return {};
	}

	return ARSON.parse(persisted);
}

export default get;
