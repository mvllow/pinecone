import fs from 'fs'
import { init } from './init.js'
import { log } from './util/pretty-log.js'

export interface Options {
	/**
	 * Generate additional variants with no italics
	 * @default false
	 * @deprecated Renamed to "includeNonItalicVariants"
	 */
	includeNonItalics?: boolean
	/**
	 * Generate additional variants with no italics
	 * @default false
	 */
	includeNonItalicVariants?: boolean
	/**
	 * Update `package.json` to include contributed themes
	 * @default false
	 * @deprecated Renamed to "updateContributes"
	 */
	writeMeta?: boolean
	/**
	 * Update `package.json` to include contributed themes
	 * @default false
	 */
	updateContributes?: boolean
}

export interface Config {
	/**
	 * Theme file. It's recommended to append "-color-theme" to your source file
	 * for VSCode intellisense.
	 * @default './themes/_pinecone-color-theme.json'
	 * @deprecated Renamed to "source"
	 */
	themeFile?: never
	/**
	 * Theme file. It's recommended to append "-color-theme" to your source file
	 * for VSCode intellisense.
	 * @default './themes/_pinecone-color-theme.json'
	 */
	source: string
	/**
	 * Output directory.
	 * @default './themes'
	 * @deprecated Renamed to "output"
	 */
	outputDir?: never
	/**
	 * Output directory.
	 * @default './themes'
	 */
	output: string
	/**
	 * Variable prefix.
	 * @default '$'
	 * @deprecated Renamed to "prefix"
	 */
	varPrefix?: never
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
		includeNonItalicVariants: false,
		updateContributes: false,
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
		// TODO: This no longer works with pure ESM
		// https://github.com/nodejs/modules/issues/307
		// delete require.cache[require.resolve(`${process.cwd()}/pinecone.config.js`)]

		const { default: userConfig }: { default: Partial<Config> } = await import(
			`${process.cwd()}/pinecone.config.js`
		).catch(() => {
			// noop
		})

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
