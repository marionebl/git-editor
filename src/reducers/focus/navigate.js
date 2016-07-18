import {clamp} from 'lodash';

import find from './find';
import select from './select';

export function navigate(current, offset, space) {
	if (!current) {
		return select(0, 0, space);
	}

	const {x, y} = find(current, space);

	if (x === -1 || y === -1) {
		return select(0, 0, space);
	}

	const line = space[y];

	const isLast = offset > 0 ?
		x === line.length - 1 :
		x === 0;

	const isLastLine = offset > 0 ?
		y === space.length - 1 :
		y === 0;

	const isLastTotal = isLast && isLastLine;

	if (isLastTotal) {
		const target = offset > 0 ? 0 : Infinity;
		return select(target, target, space);
	}

	const nextY = isLast ? clamp(y + offset, 0, space.length) : y;
	const lineChangeX = offset > 0 ? 0 : space[nextY].length - 1;
	const nextX = isLast ? lineChangeX : x + offset;

	return select(nextX, nextY, space);
}

export default navigate;
