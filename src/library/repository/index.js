const path = require('path');
const git = require('git-fs-repo');

export function create(basePath = process.cwd()) {
  return new Promise((resolve, reject) => {
		const directory = path.resolve(basePath, '.git');

		git(directory, function(error, repository) {
			if (error) {
				return reject(error);
			}
			resolve(repository);
		});
	});
}

export async function hash(ref, repository) {
	const repo = await repository;
  return (repo.ref(ref) || {}).hash;
}