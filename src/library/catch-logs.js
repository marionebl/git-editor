import {inspect} from 'util';

function catchLogs(screen, store) {
	const natives = {
		log: console.log,
		error: console.error,
		info: console.info,
		debug: console.debug
	};

	function method(...args) {
		const chunks = args.map(arg => {
			if (typeof arg === 'object') {
				return inspect(arg, {
					colors: true,
					depth: null
				});
			}
			return arg;
		});
		screen.log(`[${Date.now()}]`, chunks.join(' '));
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
