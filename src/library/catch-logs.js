function catchLogs(screen, store) {
	const state = store.getState();

	const natives = {
		log: console.log,
		error: console.error,
		info: console.info,
		debug: console.debug
	};

	function method() {
		const args = Array.prototype.slice.call(arguments);
		if (state.environment === 'development') {
			store.dispatch({
				type: 'LOG_ADD',
				payload: args.join(' ')
			});
		}
		if (state.debug) {
			screen.log(args.join(' '));
		}
	}

	console.log = method;
	console.error = method;
	console.info = method;
	console.debug = method;
	console.log('Redirecting all logs to log file');

	screen.on('destroy', () => {
		console.log = natives.log;
		console.error = natives.error;
		console.info = natives.info;
		console.debug = natives.debug;
	});

	// Try to dump the log when the application comes crashing down
	process.on('exit', code => {
		if (code === 0) {
			return;
		}
		process.stdout.write('\n');
		const {log} = store.getState();
		log.forEach(line => {
			process.stdout.write(`${line}\n`);
		});
	});
}

module.exports = catchLogs;
