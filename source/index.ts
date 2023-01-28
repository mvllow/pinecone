import chalk from 'chalk';
import {build, init, tidy, watch} from './commands/index.js';
import {resolveConfig} from './config.js';
import {checkThemes} from './util/check-themes.js';
import type {UserOptions} from './types/config.js';

async function pinecone(command?: string, flags?: UserOptions) {
	console.clear();
	console.log(chalk.green('🌲 Pinecone\n'));

	const config = await resolveConfig(flags);

	if (command === 'init') {
		await init();
		return;
	}

	await build(config);

	if (config.options.tidy) await tidy(config);

	checkThemes(config);

	if (config.options?.watch) {
		console.log('👀 Waiting for changes...\n');
		await watch();
	}
}

export {colorish} from 'colorish';
export {defineConfig} from './config.js';
export default pinecone;
