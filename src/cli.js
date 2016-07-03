#!/usr/bin/env node
'use strict';
require('babel-polyfill');
const path = require('path');

const Promise = require('bluebird');
const meow = require('meow');
const fs = require('mz/fs');
const home = require('home-or-tmp');
const mkdirp = require('mkdirp-promise');
const pkg = require('../package');

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
	return Promise.resolve();
}

function prepare(filePath) {
	const configPath = path.resolve(home, `.${pkg.name}`);

	return Promise.all([
		read(filePath),
		mkdirp(configPath).then(() => configPath)
	]);
}

function live(id) {
	if (process.env.NODE_ENV === 'development') {
		return require(id + '/live'); // eslint-disable-line
	}
	return require(id);
}

const commands = {
	editor: live('./commands/editor'),
	setup: live('./commands/setup')
};

function main(filePath, flags) {
	return new Promise((resolve, reject) => {
		if (flags.local || flags.global) {
			const location = flags.global ? 'global' : 'local';
			return commands.setup({location})
				.then(resolve);
		}

		prepare(filePath)
			.spread((input, home) => commands.editor(pkg)(input, {
				title: pkg.name,
				environment: process.env.NODE_ENV,
				debug: Boolean(process.env.NODE_DEBUG),
				home: home
			}))
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
