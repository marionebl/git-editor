'use strict';
const gitEditor = require('./git-editor');
const pkg = require('./package');

function main() {
  return gitEditor('chore(test): input', {
    title: pkg.name
  });
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
