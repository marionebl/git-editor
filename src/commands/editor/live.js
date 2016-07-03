function getLiveGitEditor(pkg) {
	require('babel-register');
	const live = require('@marionebl/babel-live');
	return live(require.resolve('./'), {}, pkg.babel);
}

module.exports = getLiveGitEditor;
