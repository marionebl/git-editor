import {merge} from 'lodash';
import {createEditorReducers} from 'react-blessed-editor';

import debug from './debug';
import environment from './environment';
import focus from './focus';
import validate from './validate';

export function createReducers(amend = {}) {
	const reducers = {
		debug,
		environment,
		focus,
		validate,
		...createEditorReducers('type'),
		...createEditorReducers('scope'),
		...createEditorReducers('subject'),
		...createEditorReducers('body'),
		...createEditorReducers('footer')
	};

	return merge({}, reducers, amend);
}

module.exports = createReducers;
