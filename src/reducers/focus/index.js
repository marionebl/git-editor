import select from './select';
import navigate from './navigate';
import navigateLine from './navigate-line';
import navigateOnLine from './navigate-on-line';

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
		case 'FORM_NAVIGATE_DOWN': {
			const {payload: {length}} = action;
			return navigateLine(state, length, space);
		}
		case 'FORM_NAVIGATE_UP': {
			const {payload: {length}} = action;
			return navigateLine(state, length * -1, space);
		}
		case 'FORM_NAVIGATE_LINE_END': {
			return navigateOnLine(state, Infinity, space);
		}
		case 'FORM_NAVIGATE_LINE_START': {
			return navigateOnLine(state, 0, space);
		}
		default:
			return state || select(0, 0, space);
	}
}

export default focusReducer;
