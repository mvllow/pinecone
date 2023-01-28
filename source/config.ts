import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {init} from './commands/index.js';
import type {Config, Options, UserConfig, UserOptions} from './types/config.js';

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

export async function importFresh<T>(
	modulePath: string,
): Promise<T | Record<string, unknown>> {
	const freshModulePath = `${modulePath}?update=${Date.now()}`;
	try {
		const freshModule = (await import(freshModulePath)) as {default: T};
		return freshModule.default;
	} catch {
		return {};
	}
}

export async function resolveConfig(flags?: UserOptions) {
	const configPath = path.join(process.cwd(), 'pinecone.config.js');

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
	} catch (error: unknown) {
		if (fs.existsSync(`${process.cwd()}/pinecone.config.js`)) {
			console.error('Something went wrong in pinecone.config.js', error);
		} else {
			console.warn('No user config found, creating default files\n', error);

			await init();
		}
	}

	return defaultConfig;
}

export function defineConfig(config: UserConfig): UserConfig {
	return config;
}
