export interface Config {
	themeFile: string
	outputDir: string
	varPrefix: string
	options?: Options
	theme: Theme
}

export interface Options {
	// TODO: deprecate one of the below options
	includeNonItalicVariants?: boolean
	includeNonItalics?: boolean
	writeMeta?: boolean
}

export interface Theme {
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

export const getConfig = () => {
	const defaultConfig: Config = {
		themeFile: './themes/_pinecone-color-theme.json',
		outputDir: './themes',
		varPrefix: '_',
		options: {
			includeNonItalicVariants: false,
			writeMeta: false,
		},
		theme: {
			variants: {
				dark: {
					name: 'Charcoal',
					type: 'dark',
				},
				light: {
					name: 'Soap',
					type: 'light',
				},
			},
			colors: {},
		},
	}

	let config = defaultConfig

	try {
		delete require.cache[require.resolve(`${process.cwd()}/pinecone.config.js`)]
		let userConfig: Config = require(`${process.cwd()}/pinecone.config.js`)

		config = { ...defaultConfig, ...userConfig }
	} catch (error) {
		// noop
	}

	return config
}
