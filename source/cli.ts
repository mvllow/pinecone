#!/usr/bin/env node

import meow from 'meow'
import pinecone from '.'

const cli = meow(
  `
  Usage
    $ pinecone <options>

    Creating a new theme
      $ pinecone init

  Options
    --include-non-italics  Include non-italic variants

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
