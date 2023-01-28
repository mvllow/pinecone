import fs from 'node:fs';
import path from 'node:path';
import slugify from '@sindresorhus/slugify';
import {readJson} from '../util/read-json.js';
import {writePrettyFile} from '../util/write-pretty-file.js';
import type {Config} from '../types/config.js';
import type {PackageTheme} from '../types/themes.js';

export async function tidy({options, variants}: Config) {
	const packageJson = readJson<{
		[key: string]: unknown;
		contributes: {
			[key: string]: any;
			themes: PackageTheme[];
		};
	}>('package.json');
	const safeFiles: string[] = [path.basename(options.source)];
	const themes: PackageTheme[] = [];
	const themesDir = './' + path.normalize(options.output);

	for (const variant of Object.keys(variants)) {
		const currentVariant = variants[variant];

		if (typeof currentVariant !== 'undefined') {
			const {name, type} = currentVariant;
			const slug = slugify(name, {lowercase: true});

			safeFiles.push(`${slug}-color-theme.json`);
			themes.push({
				label: name,
				uiTheme: type === 'light' ? 'vs' : 'vs-dark',
				path: `${themesDir}/${slug}-color-theme.json`,
			});

			if (options.includeNonItalicVariants) {
				safeFiles.push(`${slug}-no-italics-color-theme.json`);
				themes.push({
					label: `${name} (no italics)`,
					uiTheme: type === 'light' ? 'vs' : 'vs-dark',
					path: `${themesDir}/${slug}-color-theme.json`,
				});
			}
		}
	}

	// Remove non-pinecone themes from output directory
	fs.readdir(options.output, (error, files) => {
		if (error) {
			console.error(error.message);
		}

		for (const file of files) {
			const filePath = path.join(options.output, file);

			if (!safeFiles.includes(file) && file.includes('-color-theme.json')) {
				try {
					fs.unlinkSync(filePath);
				} catch {}
			}
		}
	});

	// Add pinecone themes to package.json contributes section
	if (!packageJson.contributes) packageJson.contributes = {themes: []};
	packageJson.contributes.themes = themes;

	await writePrettyFile(
		'package.json',
		JSON.stringify(packageJson, null, 2),
		'json-stringify',
	);
}
