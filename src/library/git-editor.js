const blessed = require('blessed');
const createStore = require('redux').createStore;

const parseCommit = require('conventional-commits-parser').sync;

const catchLogs = require('./catch-logs');
const reducers = require('../reducers');
const renderApplication = require('./render-application');

function gitEditor(message, options) {
	return new Promise((resolve, reject) => {
		const parsed = parseCommit(message, {});

		const initial = {
			environment: options.environment || 'production',
			// parsed,
			form: {
				type: parsed.type,
				scope: parsed.scope,
				subject: parsed.subject,
				body: parsed.body,
				footer: parsed.footer
			}
		};

		// Basic screen setup
		const screen = blessed.screen({
			autoPadding: true,
			smartCSR: true,
			title: 'git-editor',
			ignoreLocked: ['C-c', 'C-s'],
			log: './git-editor.log'
		});

		// Redirect all log output to file
		console.log('Starting git-editor');

		// Let the user kill the application
		screen.key(['C-c'], () => {
			screen.destroy();
			console.log('Quitting git-editor without saving');
			resolve();
		});

		// Let the user save and quit
		screen.key(['C-s'], () => {
			screen.destroy();
			console.log('Saving git-editor');
			resolve();
		});

		// Setup the redux store
		const store = createStore(reducers, initial);

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
	});
}

module.exports = gitEditor;
