import {log, writeToFile, toRelativePath, makeDirectory} from '../utilities.js';
import {defaultConfig} from '../config.js';

export const init = async (source: string) => {
	const themePath = toRelativePath(source);
	const configPath = toRelativePath('./pinecone.config.js');

	log.list('🌱 Created theme files:', [themePath, configPath]);

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
		`/** @type require('pinecone-cli').Config */\nexport default ${JSON.stringify(
			defaultConfig,
			null,
			'\t',
		)}`,
	);
};
