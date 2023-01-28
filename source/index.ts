import chalk from 'chalk';
import {init, tidy, watch} from './commands/index.js';
import {resolveConfig} from './config.js';
import {parseThemes} from './util/parse-themes.js';
import {generateThemes} from './util/generate-themes.js';
import {readJson} from './util/read-json.js';
import {checkThemes} from './util/check-themes.js';
import type {UserOptions} from './types/config.js';
import type {Theme} from './types/themes.js';

async function pinecone(command?: string, flags?: UserOptions) {
	console.clear();
	console.log(chalk.green('🌲 Pinecone\n'));

	if (command === 'init') {
		await init();
		return;
	}

	const config = await resolveConfig(flags);

	const template = readJson<Theme>(config.options.source);
	const parsedThemes = await parseThemes(template, config);

	if (typeof parsedThemes === 'undefined') {
		throw new TypeError('Unable to parse themes');
	}

	const generatedThemes = await generateThemes(parsedThemes, config);
	const sortedThemes = generatedThemes.sort((a, b) => {
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	});

	console.log(`🌿 Variants`);
	for (const theme of sortedThemes) {
		console.log(`   ${chalk.grey('-')} ${chalk.magenta(theme)}`);
	}

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
