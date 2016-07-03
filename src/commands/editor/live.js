function getLiveGitEditor(pkg) {
	require('babel-register');
	const live = require('@marionebl/babel-live');
	const result = live(require.resolve('./'), {}, pkg.babel);
	return result.default || result;
}

module.exports = getLiveGitEditor;
