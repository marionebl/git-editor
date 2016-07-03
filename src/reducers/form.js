const commands = [
	'tab',
	'escape',
	'enter',
	'return',
	'up',
	'right',
	'down',
	'left'
];

export default function (state = {}, action) {
	switch (action.type) {
		case 'keypress': {
			const {data, name} = action.payload;

			if (commands.includes(data.name)) {
				return state;
			}

			const oldValue = state[name] || '';

			const newValue = data.full === 'backspace' ?
				oldValue.slice(0, oldValue.length - 1) :
				`${oldValue}${data.ch || data.sequence || ''}`;

			// strip control characters
			const sanitized = newValue.replace(/[\x00-\x1F\x7F-\x9F]/ug, '');

			if (oldValue !== sanitized) {
				return Object.assign({}, state, {[name]: sanitized});
			}
			return state;
		}
		case 'focus': {
			if (state.focused !== action.payload) {
				return Object.assign({}, state, {focused: action.payload});
			}
			return state;
		}
		case 'blur': {
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

			return Object.assign({}, {state}, {focused});
		}
	}
}
