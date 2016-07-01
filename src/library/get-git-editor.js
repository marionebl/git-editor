function getGitEditor(pkg) {
	if (process.env.NODE_ENV === 'development') {
		require('babel-register');
		const live = require('@marionebl/babel-live');
		return live(require.resolve('./git-editor'), {}, pkg.babel);
	}
	return require('./git-editor');
}

module.exports = getGitEditor;
