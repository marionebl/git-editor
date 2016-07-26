import {inspect} from 'util';

function catchLogs(screen) {
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
}

module.exports = catchLogs;
