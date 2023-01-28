import type {Config} from '../types/config.js';
import type {Theme} from '../types/themes.js';
import {replaceJsonValues} from './replace-json-values.js';
import {removeWordFromString} from './remove-word-from-string.js';

export async function parseThemes(
	{name, type, ...baseTheme}: Theme,
	{options, variants, colors}: Config,
) {
	const template = JSON.stringify(baseTheme);
	const result: Record<string, Theme> = {};

	for (const variant of Object.keys(variants)) {
		let theme = template;

		for (const color of Object.keys(colors)) {
			const searchFor = `${options.prefix}${color}`;
			const currentColor = colors[color];

			if (typeof currentColor === 'undefined') return;

			const replaceWith =
				typeof currentColor === 'string' ? currentColor : currentColor[variant];

			if (replaceWith) {
				theme = replaceJsonValues(theme, searchFor, replaceWith);
			} else {
				console.error(`Bad format for \`${color}\``);
			}
		}

		const parsedTheme = JSON.parse(theme) as Theme;
		const workingColors = Object.keys(parsedTheme.colors ?? {});

		// Remove empty JSON values
		if (typeof workingColors !== 'undefined') {
			for (const key of workingColors) {
				if (
					typeof parsedTheme.colors !== 'undefined' &&
					parsedTheme.colors[key] === ''
				) {
					// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
					delete parsedTheme.colors[key];
				}
			}
		}

		result[variant] = {
			name: variants[variant]?.name,
			type: variants[variant]?.type,
			...parsedTheme,
		};

		if (options.includeNonItalicVariants) {
			const nonItalicVariant = removeWordFromString(
				JSON.stringify(parsedTheme),
				'italic',
			);

			result[`${variant}-no-italics`] = {
				name: `${variants[variant]?.name ?? ''} (no italics)`,
				type: variants[variant]?.type,
				...(JSON.parse(nonItalicVariant) as Theme),
			};
		}
	}

	return result;
}
