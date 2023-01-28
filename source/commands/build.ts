import chalk from 'chalk';
import type {Config} from '../types/config.js';
import type {Theme} from '../types/themes.js';
import {generateThemes} from '../util/generate-themes.js';
import {parseThemes} from '../util/parse-themes.js';
import {readJson} from '../util/read-json.js';

export const build = async (config: Config) => {
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
};
