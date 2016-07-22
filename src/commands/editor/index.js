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

function wait(screen, store) {
	return new Promise(resolve => {
		// Let the user kill the application
		screen.key(['C-c'], () => {
			screen.destroy();
			resolve('');
		});

		// Let the user save and quit
		screen.key(['C-s'], () => {
			screen.destroy();
			const {form} = store.getState();
			resolve(commit.stringify({
				type: form.type,
				scope: form.scope,
				subject: form.subject,
				body: form.body,
				footer: form.footer
			}));
		});
	});
}

async function gitEditor(message, options) {
	const parsed = message ? commit.parse(message) : {};
	const filled = message.split('\n')[0].length > 0;

	const db = await database.create(options.home);
	const repo = await repository.create();
	const hash = await repository.hash('HEAD', repo);

	// Try to obtain last state for git hash
	const previous = (await database.get(hash, db)) || {};
	const form = filled ? parsed : {};

	const initial = merge({}, previous, {
		environment: options.environment,
		debug: options.debug,
		type: {
			contents: form.type,
			cursor: previous.type && previous.type.cursor ? previous.type.cursor : {x: 0, y: 0}
		},
		scope: {
			contents: form.scope,
			cursor: previous.scope && previous.scope.cursor ? previous.scope.cursor : {x: 0, y: 0}
		},
		subject: {
			contents: form.subject,
			cursor: previous.subject && previous.subject.cursor ? previous.subject.cursor : {x: 0, y: 0}
		},
		body: {
			contents: form.body,
			cursor: previous.body && previous.body.cursor ? previous.body.cursor : {x: 0, y: 0}
		},
		footer: {
			contents: form.footer
		}
	});

	// Setup the redux store
	const reducers = createReducers();
	const store = createStore(reducers, initial);

	// Persist store changes to leveldb
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
