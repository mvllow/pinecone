import path from 'node:path';
import slugify from '@sindresorhus/slugify';
import type {Config} from '../types/config.js';
import type {Theme} from '../types/themes.js';
import {writePrettyFile} from './write-pretty-file.js';

export async function generateThemes(
	themes: Record<string, Theme>,
	{options}: Config,
) {
	const variants: string[] = [];

	await Promise.all(
		Object.keys(themes).map(async (variant) => {
			const currentVariant = themes[variant];

			if (typeof currentVariant !== 'undefined') {
				const slug = slugify(currentVariant.name ?? '', {lowercase: true});

				await writePrettyFile(
					path.join(options.output, `${slug}-color-theme.json`),
					JSON.stringify(currentVariant, null, 2),
				);

				if (
					typeof currentVariant.name !== 'undefined' &&
					!currentVariant.name?.includes('(no italics)')
				) {
					if (options.includeNonItalicVariants) {
						variants.push(
							`${currentVariant.name} / ${currentVariant.name} (no italics)`,
						);
					} else {
						variants.push(currentVariant.name);
					}
				}
			}
		}),
	);

	return variants;
}
