const blessed = require('blessed');
const createStore = require('redux').createStore;

const catchLogs = require('./catch-logs');
const reducers = require('./reducers');
const renderApplication = require('./render-application');

function gitEditor() {
  return new Promise((resolve, reject) => {
    // Basic screen setup
    const screen = blessed.screen({
      autoPadding: true,
      smartCSR: true,
      title: 'git-editor',
      log: './git-editor.log'
    });

    // Redirect all log output to file
    catchLogs(screen);
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
    const store = createStore(reducers);

    // Render the application
    renderApplication(screen, store);

    if (module.hotswap) {
      module.hotswap.on('hotswap', function(filename) {
        renderApplication(screen, store);
      });
    }
  });
}

module.exports = gitEditor;
