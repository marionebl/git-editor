import Promise from 'bluebird';

import blessed from 'blessed';
import {merge} from 'lodash';
import {combineReducers, createStore} from 'redux';

import commit from '../../library/commit';
import reducers from '../../reducers';
import renderApplication from '../../library/render-application';
import repository from '../../library/repository';
import database from '../../library/database';
import catchLogs from '../../library/catch-logs';

function wait(screen, store) {
	return new Promise((resolve, reject) => {
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

	const initial = merge({}, previous, {
		environment: options.environment,
		debug: options.debug,
		form: filled ? parsed : previous.form
	});

	// Setup the redux store
	const combined = combineReducers(reducers);
	const store = createStore(combined, initial);

	// Persist store changes to leveldb
	store.subscribe(async () => {
		const state = store.getState();
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
	renderApplication(screen, store);

	// Enable hotswapping
	if (module.hotswap) {
		module.hotswap.on('hotswap', () => {
			try {
				const next = combineReducers(reducers);
				store.replaceReducer(next);
				renderApplication(screen, store);
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
