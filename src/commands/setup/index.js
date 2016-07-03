import gitconfig from 'gitconfig';

function setupGitEditor(options) {
	return gitconfig.set({
		'core.editor': 'git-editor'
	}, options);
}

export default setupGitEditor;
