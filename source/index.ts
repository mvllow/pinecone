import {build, init, lint, tidy, watch} from './commands/index.js';
import {resolveConfig, type UserOptions} from './config.js';
import {log} from './utilities.js';

export const pinecone = async (command?: string, flags?: UserOptions) => {
	console.clear();
	console.log('🌲 Pinecone\n');

	const config = await resolveConfig(flags);

	if (command === 'init') {
		await init(config);
		return;
	}

	build(config);

	if (config.options.tidy) await tidy(config);

	lint(config);

	if (config.options.watch) {
		log.list('👀 Watching for changes...', [
			config.options.source,
			'./pinecone.config.js',
		]);

		await watch(config);
	}
};

export {colorish} from 'colorish';
export {defineConfig} from './config.js';
export default pinecone;
