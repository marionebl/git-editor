export async function hash(ref, repository) {
	const repo = await repository;
	return (repo.ref(ref) || {}).hash;
}

export default hash;
