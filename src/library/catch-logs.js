const inspect = require('util').inspect;

function catchLogs(screen, store) {
	const state = store.getState();

	const natives = {
		log: console.log,
		error: console.error,
		info: console.info,
		debug: console.debug
	};

	const method = state.environment === 'production' && state.debug ?
		function () {
			const args = Array.prototype.slice.call(arguments);
			screen.log(args);
		} :
		function () {
			const args = Array.prototype.slice.call(arguments)
				.map(arg => {
					if (typeof arg === 'object') {
						return inspect(arg);
					}
					return arg;
				});

			store.dispatch({
				type: 'LOG_ADD',
				payload: args.join(' ')
			});
		};

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
