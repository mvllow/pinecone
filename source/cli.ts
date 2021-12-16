#!/usr/bin/env node
import meow from 'meow'
import pinecone from './index.js'

const cli = meow(
	`
    Usage
        $ pinecone <command> [options]

    Commands
        watch  Rebuild themes on change
               Watches pinecone.config.js and themes/*

    Options
		-s, --source  Path to pinecone theme file
		-o, --output  Directory for generated themes
		-p, --prefix  Variable prefix

		--clean-unused-themes          Delete non-active pinecone themes
        --include-non-italic-variants  Generate additional non-italic variants
        --update-contributes           Add contributed themes to \`package.json\`

    Examples
        $ pinecone
        $ pinecone watch --clean-unused-themes --include-non-italic-variants --update-contributes
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
			cleanUnusedThemes: {
				type: 'boolean',
			},
			includeNonItalicVariants: {
				type: 'boolean',
			},
			updateContributes: {
				type: 'boolean',
			},
		},
	}
)

pinecone(cli.input[0], cli.flags)
