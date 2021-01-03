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

test.todo('`pinecone --no-italic` generates non-italic variants')
