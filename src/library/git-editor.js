const Promise = require('bluebird');

const blessed = require('blessed');
const merge = require('lodash').merge;
const createStore = require('redux').createStore;

const commit = require('./commit');
const catchLogs = require('./catch-logs');
const reducers = require('../reducers');
const renderApplication = require('./render-application');
const repository = require('./repository');
const database = require('./database');

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
	const headerFilled = parsed.header && parsed.header[0] !== '#';

	const db = await database.create(options.home);
	const repo = await repository.create();
	const hash = await repository.hash('HEAD', repo);

	// Try to obtain last state for git hash
	const previous = (await database.get(hash, db)) || {};

	const initial = merge({}, previous, {
		environment: options.environment,
		debug: options.debug,
		form: headerFilled ? parsed : previous.form
	});

	// Setup the redux store
	const store = createStore(reducers, initial);

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

module.exports = gitEditor;
