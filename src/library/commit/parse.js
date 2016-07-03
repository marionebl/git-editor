import {sync as parseCommit} from 'conventional-commits-parser';

export function parse(input) {
	return parseCommit(input);
}

export default parse;
