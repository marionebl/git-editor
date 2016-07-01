const gitconfig = require('gitconfig');

function setupGitEditor(options) {
	console.log(options);
	return gitconfig.set({
		'core.editor': 'git-editor'
	}, options);
}

module.exports = setupGitEditor;
