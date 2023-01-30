import path from 'node:path';
import escapeStringRegexp from 'escape-string-regexp';
import slugify from '@sindresorhus/slugify';
import {
	log,
	readToJson,
	styles,
	writeToFile,
	type Theme,
} from '../utilities.js';
import type {Config} from '../config.js';

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
			${styles.url('https://github.com/mvllow/pinecone#config')}
		`);

		throw new TypeError(`Unable to read variant.`);
	}

	const theme = Object.keys(colors).reduce((result, currentColor) => {
		const color = colors[currentColor];

		const undefinedColor = () => {
			log.warn(`
				Unable to find ${styles.string(
					currentColor,
				)} in colors. Check that color exists, e.g.

					colors: {
						"background": {
							"caffe": "#36261b",
							"latte": "#faf8f6"
						},
						...
					}

				Documentation:
				${styles.url('https://github.com/mvllow/pinecone#config')}
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
		const removeItalics = JSON.stringify(parsedTheme).replace(
			/\s?italic\s?/g,
			'',
		);
		const parsedNonItalicTheme = {
			...(JSON.parse(removeItalics) as Theme),
			name: `${variant.name} (no italics)`,
		};

		writeToFile(
			path.join(options.output, `${slug}-no-italics-color-theme.json`),
			JSON.stringify(parsedNonItalicTheme, null, '\t'),
		);
	}

	return variant.name;
};

export const build = (config: Config) => {
	const {source} = config.options;

	if (!source.includes('-color-theme')) {
		console.log(
			`🌸 Maybe rename ${styles.string(source)} to ${styles.string(
				source.replace('.json', '-color-theme.json'),
			)}\n   for improved code completions, color decorators, and color pickers when editing.\n`,
		);
	}

	const template = readToJson<Theme>(source);
	const themeList = new Set<string>();

	for (const variant in config.variants) {
		if (Object.prototype.hasOwnProperty.call(config.variants, variant)) {
			const themeName = parseVariant(variant, template, config);
			themeList.add(themeName);
		}
	}

	const variantNames: string[] = [];
	for (const theme of [...themeList].sort()) {
		variantNames.push(theme);
		if (config.options.includeNonItalicVariants) {
			variantNames.push(`${theme} (no italics)`);
		}
	}

	log.list('🌿 Generated variants:', variantNames);
};
