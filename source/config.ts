import fs from 'node:fs';
import {log, toRelativePath} from './utilities.js';

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

export const importFresh = async <T>(
	modulePath: string,
): Promise<T | Record<string, unknown>> => {
	const freshModulePath = `${modulePath}?update=${Date.now()}`;

	try {
		const freshModule = (await import(freshModulePath)) as {default: T};
		return freshModule.default;
	} catch {
		return {};
	}
};

export const resolveConfig = async (flags?: UserOptions) => {
	const configPath = toRelativePath('pinecone.config.js');

	try {
		const userConfig = (await importFresh<UserConfig>(
			configPath,
		)) as UserConfig;
		const options: Options = Object.assign(
			defaultConfig.options,
			userConfig.options,
			flags,
		);

		return {...defaultConfig, ...userConfig, options: {...options}};
	} catch {
		if (fs.existsSync(configPath)) {
			log.error(
				`Unable to read pinecone.config.js. This is likely due to invalid syntax.`,
			);
		} else {
			log.warn(`
				No user config found. Initialise pinecone to get started: 
				
					$ pinecone init

				https://github.com/mvllow/pinecone#config
			`);
		}
	}

	return defaultConfig;
};

export const defineConfig = (config: UserConfig): UserConfig => config;
