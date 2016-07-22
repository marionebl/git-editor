import {clamp} from 'lodash';

import find from './find';
import select from './select';

export function navigateOnLine(current, target, space) {
	if (!current) {
		return select(0, 0, space);
	}

	const {x, y} = find(current, space);

	if (x === -1 || y === -1) {
		return select(0, 0, space);
	}

	const line = space[y];

	const nextX = clamp(target, 0, line.length - 1);
	return select(nextX, y, space);
}

export default navigateOnLine;
