export function stringify(input) {
	const {
		scope: passedScope,
		type,
		subject,
		body,
		footer
	} = input;

	const scope = passedScope ? `(${passedScope})` : '';
	const prefix = [type, scope].filter(Boolean).join('');
	const delimiter = prefix ? ': ' : '';
	const header = [prefix, delimiter, subject].filter(Boolean).join('');

	return [
		header,
		body ? '\n' : '',
		body,
		footer ? '\n' : '',
		footer
	]
	.filter(Boolean)
	.join('\n');
}

export default stringify;
