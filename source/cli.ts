#!/usr/bin/env node

import meow from 'meow'
import pinecone from '.'

// TODO
// - implement non-italic variants
//   - need to add pinecone.config.js option as well
// - add init functionality
//   - generate default pinecone.config.js and _color-theme.json

const cli = meow(
  `
  Usage
    $ pinecone <options>

    Creating a new theme
      $ pinecone init

  Options
    --no-italics  Include non-italic variants

  Examples
    $ pinecone
    $ pinecone init
    $ pinecone --no-italics
`,
  {
    flags: {
      noItalics: {
        type: 'boolean',
      },
    },
  }
)

pinecone(cli.input[0], cli.flags)
