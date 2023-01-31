import fs from 'node:fs';
import path from 'node:path';
import slugify from '@sindresorhus/slugify';
import {readPackage} from 'read-pkg';
import {writePackage} from 'write-pkg';
import {log, type PackageTheme} from '../utilities.js';
import type {Config} from '../config.js';

export const tidy = async ({options, variants}: Config) => {
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
			log.error(error.message);
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

	const pkg = await readPackage({normalize: false});
	await writePackage({...pkg, contributes: {themes: themes ?? []}} as any);
};
