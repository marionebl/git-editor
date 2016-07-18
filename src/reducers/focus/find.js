export function find(name, space) {
	const y = space.findIndex(line => line.find(item => item === name));

	if (y === -1) {
		return {x: -1, y: -1};
	}

	const x = space[y].findIndex(item => item === name);
	return {x, y};
}

export default find;
