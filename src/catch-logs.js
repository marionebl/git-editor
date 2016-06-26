function catchLogs(screen) {
  global.console.log = screen.log.bind(screen);
  global.console.error = screen.log.bind(screen);
  global.console.info = screen.log.bind(screen);
  global.console.debug = screen.log.bind(screen);
  console.log('Redirecting all logs to log file');
}

module.exports = catchLogs;
