import Promise from 'bluebird';

import blessed from 'blessed';
import {merge, omit} from 'lodash';
import {combineReducers} from 'redux';

const createStore = require('../../library/store');
const commit = require('../../library/commit');
const render = require('../../library/render-application');
const repository = require('../../library/repository');
const database = require('../../library/database');
const catchLogs = require('../../library/catch-logs');
const createReducers = require('../../reducers');

const baseLineState = {
	type: {
		contents: ''
	},
	scope: {
		contents: ''
	},
	subject: {
		contents: ''
	},
	body: {
		contents: ''
	},
	footer: {
		contents: ''
	}
};

function wrap(name, data) {
	return {
		[name]: {
			contents: data[name]
		}
	};
}

function unwrap(name, data) {
	return data[name].contents || '';
}

function getInitialState(message, options, previous) {
	const {environment, debug} = options;
	const parsed = message ? commit.parse(message) : {};

	return merge(
		baseLineState,
		previous,
		{
			environment,
			debug,
			...wrap('type', parsed),
			...wrap('scope', parsed),
			...wrap('subject', parsed),
			...wrap('body', parsed),
			...wrap('footer', parsed)
		}
	);
}

function wait(screen, store) {
	return new Promise(resolve => {
		// Let the user kill the application
		screen.key(['C-c'], () => {
			screen.destroy();
			resolve('');
		});

		// Let the user save and quit
		screen.key(['C-s'], () => {
			const state = store.getState();
			const message = commit.stringify({
				type: unwrap('type', state),
				scope: unwrap('scope', state),
				subject: unwrap('subject', state),
				body: unwrap('body', state),
				footer: unwrap('footer', state)
			});
			resolve(message);
		});
	});
}

async function gitEditor(message, options) {
	const db = await database.create(options.home);
	const repo = await repository.create();
	const hash = await repository.hash('HEAD', repo);

	// Try to obtain last state for git hash
	const previous = (await database.get(hash, db)) || {};
	const initial = getInitialState(message, options, previous);

	// Setup the redux store
	const reducers = createReducers();
	const store = createStore(reducers, initial);

	// Persist store changes to node-localstorage
	store.subscribe(async () => {
		const state = omit(store.getState(), ['log']);
		const hash = await repository.hash('HEAD', repo);
		await database.put(hash, state, db);
	});

	// Basic screen setup
	const screen = blessed.screen({
		autoPadding: true,
		smartCSR: true,
		title: 'git-editor',
		ignoreLocked: ['C-c', 'C-s'],
		log: './git-editor.log'
	});

	// Start the interface loop
	const waiting = wait(screen, store);

	// Redirect all log output to file
	catchLogs(screen, store);

	// Render the application
	render(screen, store);

	// Enable hotswapping
	if (module.hotswap) {
		module.hotswap.on('hotswap', () => {
			try {
				const nextReducers = createReducers();
				const next = combineReducers(nextReducers);
				store.replaceReducer(next);
				screen.off('keypress');
				render(screen, store);
				console.log('Hot swap successful');
			} catch (error) {
				module.hotswap.emit('error', error);
			}
		});

		module.hotswap.on('error', error => {
			console.log('Error while hotswapping: ');
			if (error.message) {
				console.error(error.message);
			}
			if (error.stack) {
				console.error(error.stack);
			}
		});
	}

	// Wait for explicit user exits
	return await waiting;
}

export default gitEditor;
