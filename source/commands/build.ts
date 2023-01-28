import path from 'node:path';
import escapeStringRegexp from 'escape-string-regexp';
import slugify from '@sindresorhus/slugify';
import {log, readToJson, writeToFile, type Theme} from '../utilities.js';
import type {Config} from '../types/config.js';

const parseVariant = (
	currentVariant: string,
	{name, type, ...baseTheme}: Theme,
	{options, variants, colors}: Config,
) => {
	const variant = variants[currentVariant];

	if (
		typeof variant === 'undefined' ||
		typeof variant.name === 'undefined' ||
		typeof variant.type === 'undefined'
	) {
		log.error(`
			Check that variants are set properly, e.g.

				variants: {
					caffe: {
						name: "Caffè",
						type: "dark"
					},
					...
				}

			Documentation:
			https://github.com/mvllow/pinecone#config
		`);

		throw new TypeError(`Unable to read variant.`);
	}

	const theme = Object.keys(colors).reduce((result, currentColor) => {
		const color = colors[currentColor];

		const undefinedColor = () => {
			log.warn(`
				Unable to find "${currentColor}" in colors. Check that color exists, e.g.

					colors: {
						"background": {
							"caffe": "#36261b",
							"latte": "#faf8f6"
						},
						...
					}

				Documentation:
				https://github.com/mvllow/pinecone#config
			`);
			return '';
		};

		if (typeof color === 'undefined') {
			return undefinedColor();
		}

		const colorValue =
			typeof color === 'string' ? color : color[currentVariant];

		if (typeof colorValue === 'undefined') {
			return undefinedColor();
		}

		return result.replace(
			new RegExp(escapeStringRegexp(`"${options.prefix}${currentColor}"`), 'g'),
			`"${colorValue}"`,
		);
	}, JSON.stringify(baseTheme));

	const parsedTheme = {
		name: variant.name,
		type: variant.type,
		...(JSON.parse(theme) as Theme),
	};

	// TODO: Refactor this to be more predictable/less destructive.
	const workingColors = Object.keys(parsedTheme.colors ?? {});
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

	const slug = slugify(parsedTheme.name, {lowercase: true});

	writeToFile(
		path.join(options.output, `${slug}-color-theme.json`),
		JSON.stringify(parsedTheme, null, '\t'),
	);

	if (options.includeNonItalicVariants) {
		const parsedNonItalicTheme = {
			...parsedTheme,
			name: `${variant.name} (no italics)`,
		};

		writeToFile(
			path.join(options.output, `${slug}-no-italics-color-theme.json`),
			JSON.stringify(parsedNonItalicTheme, null, '\t').replace(
				/\s?italic\s?/g,
				'',
			),
		);
	}

	return variant.name;
};

export const build = (config: Config) => {
	const {source} = config.options;

	if (!source.includes('-color-theme')) {
		log.tip(`
			Append "-color-theme.json" to your color themes for improved code completions, color decorators, and color pickers when editing.

			Maybe rename "${source}" to "${source.replace('.json', '-color-theme.json')}".
		`);
	}

	const template = readToJson<Theme>(source);
	const themeList = new Set<string>();

	for (const variant in config.variants) {
		if (Object.prototype.hasOwnProperty.call(config.variants, variant)) {
			const themeName = parseVariant(variant, template, config);
			themeList.add(themeName);
		}
	}

	log.info(`Generated themes:`);
	for (const theme of [...themeList].sort()) {
		console.log(`> ${theme}`);
		if (config.options.includeNonItalicVariants) {
			console.log(`> ${theme} (no italics)`);
		}
	}
};
