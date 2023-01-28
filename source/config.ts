import fs from 'node:fs';
import type {Config, Options, UserConfig, UserOptions} from './types/config.js';
import {log, toRelativePath} from './utilities.js';

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
		none: '#0000',
		bg: {
			caffe: '#36261b',
			latte: '#faf8f6',
		},
		fg: {
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
				`Unable to read pinecone.config.js This is likely due to invalid syntax.`,
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
