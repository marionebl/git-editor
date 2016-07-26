import {sync as parseCommit} from 'conventional-commits-parser';

const fields = ['type', 'scope', 'subject', 'body', 'footer'];

export function parse(input) {
	const parsed = parseCommit(input);
	const lines = input.split('\n');
	const secondLine = lines[1] || '';

	if (input[0] === '#' || secondLine[0] === '#') {
		parsed.footer = [parsed.header, parsed.body].join('\n');
		parsed.body = '';
		parsed.header = '';
	}

	fields.forEach(field => {
		if (parsed[field] === null) {
			parsed[field] = '';
		}
	});

	return parsed;
}

export default parse;
