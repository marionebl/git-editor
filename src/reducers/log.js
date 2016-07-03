function logReducer(state = [], action) {
	switch (action.type) {
		case 'LOG_ADD':
			return state.concat(action.payload);
		default:
			return state;
	}
}

export default logReducer;
