function log(state = [], {type, payload}) {
	switch (type) {
		case 'LOG_ADD':
			return state.concat(`[${Date.now()}] ${payload}`);
		default:
			return state;
	}
}

export default log;
