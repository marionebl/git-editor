import {merge} from 'lodash';
import {createEditorReducers} from 'react-blessed-editor';

import debug from './debug';
import environment from './environment';
import form from './form';
import log from './log';
import validate from './validate';

export function createReducers(amend = {}) {
	const reducers = {
		debug,
		environment,
		form,
		log,
		validate,
		...createEditorReducers('body'),
		...createEditorReducers('footer')
	};

	return merge({}, reducers, amend);
}

module.exports = createReducers;
