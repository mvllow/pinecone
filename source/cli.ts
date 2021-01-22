#!/usr/bin/env node

import meow from 'meow'
import pinecone from '.'

const cli = meow(
	`
	Usage
		$ pinecone <command> [options]

	Commands
		init   Create new theme files
		watch  Rebuild themes when \`pinecone.config.js\` changes

	Options
		--include-non-italics  Generate additional variants with no italics
		-m, --write-meta       Add contributed themes to \`package.json\`

	Examples
		$ pinecone
		$ pinecone init
		$ pinecone watch
		$ pinecone --include-non-italics
		$ pinecone --write-meta
`,
	{
		booleanDefault: undefined,
		flags: {
			includeNonItalicVariants: {
				alias: 'include-non-italics',
				type: 'boolean',
			},
			writeMeta: {
				alias: 'm',
				type: 'boolean',
			},
		},
	}
)

pinecone(cli.input[0], cli.flags)
