import {
	combineReducers,
	createStore as createReduxStore
} from 'redux';

function createStore(reducers, initial) {
	const reducer = combineReducers(reducers);
	return createReduxStore(reducer, initial);
}

module.exports = createStore;
