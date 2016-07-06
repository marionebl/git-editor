import {escape} from 'blessed';

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
	switch (action.type) {
		case 'AREA_KEYPRESS': {
			const {payload: {value, name}} = action;
			if (value.length === 0) {
				return Object.assign({}, state, {[name]: value});
			}
			if (!state[name] && value.length > 0) {
				return Object.assign({}, state, {[name]: value});
			}
			return state;
		}
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
		case 'AREA_FOCUS':
		case 'INPUT_FOCUS': {
			if (state.focused !== action.payload) {
				return Object.assign({}, state, {focused: action.payload});
			}
			return state;
		}
		case 'AREA_BLUR':
		case 'INPUT_BLUR': {
			if (state.focused === action.payload) {
				return Object.assign({}, state, {focused: null});
			}
			return state;
		}
		default: {
			const keys = Object.keys(state);

			// Set focus to first empty field or first one if none is focused
			const focused = state.focused ||
				keys.filter(Boolean)[0] ||
				keys[0];

			return Object.assign({}, state, {focused});
		}
	}
}
