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
		-t, --tidy    Remove non-pinecone themes from output and \`package.json\`

		--include-non-italic-variants  Generate additional non-italic variants

	Examples
		$ pinecone
		$ pinecone init
		$ pinecone --watch --tidy --include-non-italic-variants
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
		},
	},
)

await pinecone(cli.input[0], cli.flags)
