import path from 'path';
import git from 'git-fs-repo';

export function create(basePath = process.cwd()) {
	return new Promise((resolve, reject) => {
		const directory = path.resolve(basePath, '.git');

		git(directory, (error, repository) => {
			if (error) {
				return reject(error);
			}
			resolve(repository);
		});
	});
}

export default create;
