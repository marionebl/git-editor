import {inspect} from 'util';

function catchLogs(screen) {
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
}

module.exports = catchLogs;
