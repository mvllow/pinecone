import path from 'node:path';
import slugify from '@sindresorhus/slugify';
import type {Config} from '../config.js';
import {log, readToJson, type Theme} from '../utilities.js';

export const lint = ({options, variants}: Config) => {
	const firstVariant = Object.keys(variants)[0];

	if (typeof firstVariant === 'undefined') {
		throw new TypeError('No themes found');
	}

	const selectedVariant = variants[firstVariant];

	const slug = slugify(selectedVariant?.name ?? '', {lowercase: true});
	const theme = readToJson<Theme>(
		path.join(options.output, `${slug}-color-theme.json`),
	);

	const checkThemeValues = (source: Theme) => {
		for (const key in source) {
			if (key) {
				const currentValue = source[key];

				if (typeof currentValue === 'object') {
					checkThemeValues(currentValue as Record<string, unknown>);
					return;
				}

				if (typeof currentValue === 'undefined') {
					log.warn(`
						Color is undefined.

							{
								"${key}": "undefined"
							}
					`);
					return;
				}

				if (typeof currentValue === 'string') {
					if (currentValue.includes('[object Object]')) {
						log.warn(`
							Color has invalid value:

								{
									"${key}": "${currentValue}"
								}
						`);
						return;
					}

					if (currentValue.includes(options.prefix)) {
						log.warn(`
							Color was not formatted:

								{
									"${key}": "${currentValue}"
								}
						`);
						return;
					}

					if (currentValue.includes('#ff0000')) {
						log.warn(`
							Color has default value:

								{
									"${key}": "${currentValue}"
								}

							 This usually occurs when a color is not formatted.
						`);
						return;
					}
				}
			}
		}
	};

	checkThemeValues(theme);
};
