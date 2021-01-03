import test from 'ava'
import path from 'path'
import chalk from 'chalk'
import sinon from 'sinon'
import pinecone from '../source'
import templateConfig from '../source/template/template.config'

test.before(() => {
  // enable chalk colors in AVA
  // https://github.com/avajs/ava/issues/1124
  chalk.level = 2

  // suppress console during tests
  sinon.stub(console, 'log')

  // ignore process.exit during tests
  sinon.stub(process, 'exit')
})

test.serial('`pinecone init` generates default files', async (t) => {
  await pinecone('init')

  let { themeFile } = templateConfig

  let theme = require(`${process.cwd()}/${path.normalize(themeFile)}`)
  let config = require(`${process.cwd()}/pinecone.config.js`)

  t.is(theme.colors['editor.background'], '_bg')
  t.is(config.varPrefix, '_')
})

test('`pinecone` generates themes', (t) => {
  // TODO: check generated themes
  t.notThrows(() => pinecone())
})

test('`pinecone --include-non-italics` generates non-italic variants', async (t) => {
  await pinecone('--include-non-italics')

  let theme = require(`${process.cwd()}/themes/latte-no-italics-color-theme.json`)

  t.notRegex(theme.tokenColors[0].settings.fontStyle, /italic/g)
})
