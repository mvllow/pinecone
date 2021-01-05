#!/usr/bin/env node

import meow from 'meow'
import pinecone from '.'

const cli = meow(
  `
  Usage
    $ pinecone <command>

  Commands
    init                   Create new theme files

  Options
    --include-non-italics  Generate additional variants with no italics

  Examples
    $ pinecone
    $ pinecone init
    $ pinecone --include-non-italics
`,
  {
    flags: {
      includeNonItalicVariants: {
        alias: 'include-non-italics',
        type: 'boolean',
      },
    },
  }
)

pinecone(cli.input[0], cli.flags)
