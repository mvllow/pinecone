import fs from 'node:fs';
import {init} from './commands/index.js';
import {importFresh, log, styles, toRelativePath} from './utilities.js';

export type Options = {
	/**
	 * Path to pinecone theme file.
	 * Append "-color-theme" to your source file for intellisense.
	 * @default './themes/_pinecone-color-theme.json'
	 */
	source: string;

	/**
	 * Path to pinecone theme file.
	 * Append "-color-theme" to your source file for intellisense.
	 * @default './themes/_pinecone-color-theme.json'
	 */
	output: string;

	/**
	 * Variable prefix.
	 * @default '$'
	 */
	prefix: string;

	/**
	 * Rebuild themes on change.
	 * @default false
	 */
	watch: boolean;

	/**
	 * Purge non-pinecone themes and sync package.json contributes
	 * section.
	 * @default false
	 */
	tidy?: boolean;

	/**
	 * Generate additional variants with no italics.
	 * @default false
	 */
	includeNonItalicVariants: boolean;
};

export type Variant = {
	name: string;
	type: 'dark' | 'light';
};

export type Config = {
	options: Options;
	variants: Record<string, Variant>;
	colors: Record<string, string | Record<string, string>>;
};

export type UserOptions = Partial<Options>;
export type UserConfig = Partial<Config>;

export const defaultConfig: Config = {
	options: {
		source: './themes/_pinecone-color-theme.json',
		output: './themes',
		prefix: '$',
		watch: false,
		tidy: false,
		includeNonItalicVariants: false,
	},
	variants: {
		caffe: {
			name: 'Caffè',
			type: 'dark',
		},
		latte: {
			name: 'Caffè Latte',
			type: 'light',
		},
	},
	colors: {
		transparent: '#0000',
		background: {
			caffe: '#36261b',
			latte: '#faf8f6',
		},
		foreground: {
			caffe: '#d5bbaa',
			latte: '#c29d84',
		},
	},
};

export const resolveConfig = async (flags?: UserOptions) => {
	const configPath = toRelativePath('pinecone.config.js');
	const userConfig = await importFresh<UserConfig>(configPath);
	const options: Options = Object.assign(
		defaultConfig.options,
		userConfig?.options,
		flags,
	);

	if (typeof userConfig === 'undefined') {
		if (fs.existsSync(configPath)) {
			log.error(`
				Unable to read ${styles.string(
					'pinecone.config.js',
				)}. This is likely due to invalid syntax.
			`);

			throw new TypeError('Unable to read user config.');
		}

		await init(flags?.source ?? defaultConfig.options.source);
	}

	return {...defaultConfig, ...userConfig, options: {...options}};
};

export const defineConfig = (config: UserConfig): UserConfig => config;
