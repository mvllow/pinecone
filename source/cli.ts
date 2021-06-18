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
        --include-non-italic-variants  Generate additional non-italic variants
        --update-contributes           Add contributed themes to \`package.json\`

    Examples
        $ pinecone
        $ pinecone watch --include-non-italic-variants --update-contributes
    `,
	{
		booleanDefault: undefined,
		importMeta: import.meta,
		flags: {
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
