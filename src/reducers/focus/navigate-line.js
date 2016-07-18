import {clamp} from 'lodash';

import find from './find';
import select from './select';

export function navigateLine(current, offset, space) {
	if (!current) {
		return select(0, 0, space);
	}

	const {x, y} = find(current, space);

	if (x === -1 || y === -1) {
		return select(0, 0, space);
	}

	const isLastLine = offset > 0 ?
		y === space.length - 1 :
		y === 0;

	if (isLastLine) {
		const target = offset > 0 ? 0 : Infinity;
		return select(target, target, space);
	}

	const nextY = clamp(y + offset, 0, space.length);
	return select(0, nextY, space);
}

export default navigateLine;
