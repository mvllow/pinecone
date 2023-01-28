import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import {defaultConfig, resolveConfig} from '../config.js';
import type {UserOptions} from '../types/config.js';
import {writeToFile} from '../utilities.js';

export async function init(flags?: UserOptions) {
	const {options} = await resolveConfig(flags);
	const themePath = path.join(process.cwd(), path.normalize(options.source));
	const configPath = path.join(
		process.cwd(),
		path.normalize(`./pinecone.config.js`),
	);

	console.log('🌱 Init');

	writeToFile(
		configPath,
		`import { defineConfig } from 'pinecone-cli'\n
		export default defineConfig(${JSON.stringify(defaultConfig, null, 2)})`,
	);

	console.log(
		`   ${chalk.grey('-')} Config: ${chalk.magenta('pinecone.config.js')}`,
	);

	if (fs.existsSync(themePath)) {
		console.error(`\`${themePath}\` already exists`);
	}

	fs.mkdirSync(path.dirname(options.source), {recursive: true});

	writeToFile(
		'themes/_pinecone-color-theme.json',
		`{
            "colors": {
                "badge.background": "",
                "editor.background": "$bg",
                "editor.foreground": "$fg",
                "widget.shadow": "$none"
            },
            "tokenColors": [
                {
                    "scope": ["comment"],
                    "settings": {
                        "foreground": "$fg",
                        "fontStyle": "italic"
                    }
                }
            ]
        }`,
	);
	console.log(
		`   ${chalk.grey('-')} Theme: ${chalk.magenta(
			'themes/_pinecone-color-theme-json',
		)}\n`,
	);
}
