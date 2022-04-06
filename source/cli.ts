#!/usr/bin/env node
import meow from 'meow'
import pinecone from './index.js'

const cli = meow(
	`
	Usage
		$ pinecone <command> [options]

	Commands
		init  Create new theme

	Options
		-s, --source  Path to pinecone theme file
		-o, --output  Directory for generated themes
		-p, --prefix  Variable prefix
		-w, --watch   Rebuild themes on change

		--include-non-italic-variants  Generate additional non-italic variants
		--clean-unused-themes          Delete non-active pinecone themes
		--update-contributes           Add contributed themes to \`package.json\`

	Examples
		$ pinecone
		$ pinecone init
		$ pinecone --watch --include-non-italic-variants
	`,
	{
		booleanDefault: undefined,
		importMeta: import.meta,
		flags: {
			source: {
				alias: 's',
				type: 'string',
			},
			output: {
				alias: 'o',
				type: 'string',
			},
			prefix: {
				alias: 'p',
				type: 'string',
			},
			watch: {
				alias: 'w',
				type: 'boolean',
			},
			tidy: {
				alias: 't',
				type: 'boolean',
			},
			includeNonItalicVariants: {
				type: 'boolean',
			},
			updateContributes: {
				type: 'boolean',
			},
		},
	},
)

await pinecone(cli.input[0], cli.flags)
