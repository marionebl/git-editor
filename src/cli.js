#!/usr/bin/env node
'use strict';

const editor = './library/git-editor';
const pkg = require('../package');

function getGitEditor() {
	if (process.env.NODE_ENV === 'development') {
		require('babel-register');
		const live = require('@marionebl/babel-live');
		return live(require.resolve(editor), {}, pkg.babel);
	}
	return require('./git-editor');
}

function main() {
	return new Promise((resolve, reject) => {
		try {
			const gitEditor = getGitEditor();
			const editor = gitEditor('chore(test): input', {
				title: pkg.name,
				environment: process.env.NODE_ENV
			});
			editor
				.then(resolve)
				.catch(reject);
		} catch (error) {
			reject(error);
		}
	});
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch(error => {
		if (global.screen) {
			global.screen.destroy();
		}
		setTimeout(() => {
			throw error;
		});
	});

/* process.on('unhandledRejection', error => {
	setTimeout(() => {
		console.log(Object.keys(error));
		if (global.screen) {
			global.screen.destroy();
		}
		console.log('!'.repeat(100));
		throw error;
	});
}); */
