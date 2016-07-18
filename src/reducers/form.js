const commands = [
	'tab',
	'escape',
	'enter',
	'up',
	'right',
	'down',
	'left'
];

function isCommand(name) {
	return commands.includes(name);
}

function getValue(current = '', input = {}) {
	const result = input.full === 'backspace' ?
		current.slice(0, current.length - 1) :
		`${current}${input.ch || input.sequence || ''}`;

	return result.replace(/[\x00-\x1F\x7F-\x9F]/ug, '');
}

export default function (state = {}, action) {
	/* console.log(state);
	console.log(action);

	switch (action.type) {
		case 'INPUT_KEYPRESS': {
			const {data, name} = action.payload;

			if (data.name === 'return') {
				return state;
			}

			if (isCommand(data.name)) {
				return state;
			}

			const value = getValue(state[name], data);

			if (state[name] !== value) {
				return Object.assign({}, state, {[name]: value});
			}
			return state;
		}
		default: {
			return state;
		}
	} */
	return state;
}
