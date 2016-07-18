import navigate from './navigate';

const space = [
	['type', 'scope', 'subject'],
	['body'],
	['footer']
];

export function focusReducer(state = '', action) {
	switch (action.type) {
		case 'FORM_NAVIGATE_FORWARD': {
			const {payload: {length}} = action;
			return navigate(state, length, space);
		}
		case 'FORM_NAVIGATE_BACKWARD': {
			const {payload: {length}} = action;
			return navigate(state, length * -1, space);
		}
		default:
			return state;
	}
}

export default focusReducer;
