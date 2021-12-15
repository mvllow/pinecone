import fs from 'fs'
import { init } from './init.js'
import { log } from './util/pretty-log.js'

export interface Options {
	/**
	 * Delete non-active pinecone themes
	 * @default false
	 */
	cleanUnusedThemes?: boolean
	/**
	 * Generate additional variants with no italics
	 * @default false
	 */
	includeNonItalicVariants?: boolean
	/**
	 * Update `package.json` to include contributed themes
	 * @default false
	 */
	updateContributes?: boolean
	/**
	 * Experimental options that may alter the expected result of some values
	 */
	experimental?: {
		/**
		 * Update `package.json` to include contributed themes
		 * @default false
		 */
		removeEmptyThemeValues?: boolean
	}
}

export interface Config {
	/**
	 * Theme file. It's recommended to append "-color-theme" to your source file
	 * for VSCode intellisense.
	 * @default './themes/_pinecone-color-theme.json'
	 */
	source: string
	/**
	 * Output directory.
	 * @default './themes'
	 */
	output: string
	/**
	 * Variable prefix.
	 * @default '$'
	 */
	prefix: string
	options: Options
	theme: {
		variants: {
			[key: string]: {
				name: string
				type: 'light' | 'dark'
			}
		}
		colors: {
			[key: string]:
				| string
				| {
						[key: string]: string
				  }
		}
	}
}

export const defaultConfig: Config = {
	source: './themes/_pinecone-color-theme.json',
	output: './themes',
	prefix: '$',
	options: {
		cleanUnusedThemes: false,
		includeNonItalicVariants: false,
		updateContributes: false,
		experimental: {
			removeEmptyThemeValues: false,
		},
	},
	theme: {
		variants: {
			latte: {
				name: 'Latte',
				type: 'light',
			},
			cappuccino: {
				name: 'Cappuccino',
				type: 'light',
			},
			espresso: {
				name: 'Espresso',
				type: 'dark',
			},
		},
		colors: {
			transparent: '#0000',
			bg: {
				latte: '#faf8f6',
				cappuccino: '#c29d84',
				espresso: '#36261b',
			},
			fg: {
				latte: '#c29d84',
				cappuccino: '#573d2b',
				espresso: '#d5bbaa',
			},
		},
	},
}

export async function getConfig() {
	try {
		// FIXME: This will cause memory leaks
		// One of very few workarounds for invalidating cache using esm
		const { default: userConfig }: { default: Partial<Config> } = await import(
			`${process.cwd()}/pinecone.config.js?update=${new Date()}`
		)

		return { ...defaultConfig, ...userConfig }
	} catch (error) {
		if (fs.existsSync(`${process.cwd()}/pinecone.config.js`)) {
			log.error(`Something's not quite right in pinecone.config.js\n${error}`)
		} else {
			log.suggest('No user config found, creating default files\n')
			await init()
		}

		return defaultConfig
	}
}

// TODO: Expose this once we figure out how to import from 'pinecone-cli' without errors
export function defineConfig(config: Partial<Config>): Partial<Config> {
	return config
}
