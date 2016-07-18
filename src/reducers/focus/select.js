import {clamp} from 'lodash';

export function select(passedX, passedY, space) {
	const y = clamp(passedY, 0, space.length - 1);
	const x = clamp(passedX, 0, space[y].length - 1);
	return space[y][x];
}

export default select;
