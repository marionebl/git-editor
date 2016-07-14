import {
	applyMiddleware,
	combineReducers,
	createStore as createReduxStore
} from 'redux';

import createLogger from '@marionebl/redux-cli-logger';

function createStore(reducers, initial) {
	const reducer = combineReducers(reducers);
	const middlwares = applyMiddleware(createLogger({
		console
	}));
	return createReduxStore(reducer, initial, middlwares);
}

module.exports = createStore;
