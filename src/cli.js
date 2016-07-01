#!/usr/bin/env node
'use strict';
const meow = require('meow');
const fs = require('mz/fs');

const pkg = require('../package');
const getGitEditor = require('./library/get-git-editor');
const setup = require('./library/setup');

const cli = meow(`
	Usage
		$ git-editor <file>

	Options
		-l, --local   Configure git locally to use git-editor
		-g, --global  Configure git globally to use git-editor
`, {
	alias: {
		l: 'local',
		g: 'global'
	}
});

function read(filePath) {
	if (filePath) {
		return fs.readFile(filePath, 'utf-8');
	}
	return Promise.resolve('');
}

function write(filePath, content) {
	if (filePath) {
		return fs.writeFile(filePath, content);
	}
	console.log(content);
	return Promise.resolve();
}

function main(filePath, flags) {
	return new Promise((resolve, reject) => {
		if (flags.local || flags.global) {
			const location = flags.global ? 'global' : 'local';
			return setup({location})
				.then(resolve);
		}

		const options = {
			title: pkg.name,
			environment: process.env.NODE_ENV,
			debug: Boolean(process.env.NODE_DEBUG)
		};

		read(filePath)
			.then(input => getGitEditor(pkg)(input, options))
			.then(output => write(filePath, output))
			.then(resolve)
			.catch(reject);
	});
}

main(cli.input[0], cli.flags)
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

process.on('unhandledRejection', error => {
	setTimeout(() => {
		if (global.screen) {
			global.screen.destroy();
		}
		throw error;
	});
});
