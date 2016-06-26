#!/usr/bin/env node
'use strict';

const editor = './git-editor';
const pkg = require('../package');

if (process.env.NODE_ENV === 'development') {
  require('babel-register');
  const live = require('@marionebl/babel-live');
  const rc = require('rc');
  var gitEditor = live(require.resolve(editor), {}, pkg.babel);
} else {
  var gitEditor = require('./git-editor');
}

function main() {
  const editor = gitEditor('chore(test): input', {
    title: pkg.name
  });
  return Promise.resolve(editor);
}

main()
  .then(function(output) {
    process.exit(0);
  })
  .catch(function(error) {
    setTimeout(() => {
      if (global.screen) {
        global.screen.destroy();
      }
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
