import {log, writeToFile, toRelativePath, makeDirectory} from '../utilities.js';
import {defaultConfig} from '../config.js';
import type {Config} from '../types/config.js';

export const init = async (config: Config) => {
	const themePath = toRelativePath(config.options.source);
	const configPath = toRelativePath('./pinecone.config.js');

	log.info(`Creating pinecone theme files:\n> ${themePath}\n> ${configPath}`);

	makeDirectory(themePath);

	writeToFile(
		themePath,
		`{
\t"colors": {
\t\t"badge.background": "",
\t\t"editor.background": "$background",
\t\t"editor.foreground": "$foreground",
\t\t"widget.shadow": "$transparent"
\t},
\t"tokenColors": [
\t\t{
\t\t\t"scope": ["comment"],
\t\t\t"settings": {
\t\t\t\t"foreground": "$foreground",
\t\t\t\t"fontStyle": "italic"
\t\t\t}
\t\t}
\t]
}`,
	);

	writeToFile(
		configPath,
		`import {defineConfig} from 'pinecone-cli';\n\nexport default defineConfig(${JSON.stringify(
			defaultConfig,
			null,
			'\t',
		)})`,
	);
};
