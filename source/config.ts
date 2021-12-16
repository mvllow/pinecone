import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { init } from './init.js'
import { log } from './util/pretty-log.js'

export interface Options {
	/**
	 * Path to pinecone theme file
	 * Append "-color-theme" to your source file for VSCode intellisense
	 * @default './themes/_pinecone-color-theme.json'
	 */
	source: string
	/**
	 * Directory for generated themes
	 * @default './themes'
	 */
	output: string
	/**
	 * Variable prefix
	 * @default '$'
	 */
	prefix: string
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
}

export interface Config {
	/** @deprecated Moved to `options.source` */
	source?: never
	/** @deprecated Moved to `options.output` */
	output?: never
	/** @deprecated Moved to `options.prefix` */
	prefix?: never
	options: Options
	variants: Record<string, { name: string; type: 'light' | 'dark' }>
	colors: Record<string, string | Record<string, string>>
}

export type UserConfig = Partial<Config>
export type UserOptions = Partial<Options>

export const defaultConfig: Config = {
	options: {
		source: './themes/_pinecone-color-theme.json',
		output: './themes',
		prefix: '$',
		cleanUnusedThemes: false,
		includeNonItalicVariants: false,
		updateContributes: false,
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
}

// TODO: Move into utilities or un-abstract logic
export async function importFresh(modulePath: string) {
	const freshModulePath = `${modulePath}?update=${Date.now()}`
	try {
		return (await import(freshModulePath)).default
	} catch {
		return {}
	}
}

export async function resolveConfig(flags?: UserOptions) {
	const configPath = path.join(process.cwd(), 'pinecone.config.js')

	try {
		const userConfig = importFresh(configPath) as UserConfig
		const options: Options = Object.assign(
			defaultConfig.options,
			userConfig.options,
			flags
		)

		return { ...defaultConfig, ...userConfig, options }
	} catch (error) {
		// TODO: Refactor initialization
		if (fs.existsSync(`${process.cwd()}/pinecone.config.js`)) {
			log.error(`Something's not quite right in pinecone.config.js\n${error}`)
		} else {
			log.suggest('No user config found, creating default files\n')
			console.error(error)

			await init()
		}
	}

	return defaultConfig
}

export function defineConfig(config: UserConfig): UserConfig {
	return config
}
