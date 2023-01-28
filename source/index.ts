import chalk from 'chalk';
import {build, init, lint, tidy, watch} from './commands/index.js';
import {resolveConfig} from './config.js';
import type {UserOptions} from './types/config.js';

async function pinecone(command?: string, flags?: UserOptions) {
	console.clear();
	console.log(chalk.green('🌲 Pinecone\n'));

	const config = await resolveConfig(flags);

	if (command === 'init') {
		await init(config);
		return;
	}

	build(config);

	if (config.options.tidy) await tidy(config);

	lint(config);

	if (config.options?.watch) {
		console.log('👀 Waiting for changes...\n');
		await watch();
	}
}

export {colorish} from 'colorish';
export {defineConfig} from './config.js';
export default pinecone;
