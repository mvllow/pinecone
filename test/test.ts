import test from 'ava'
import chalk from 'chalk'
import sinon from 'sinon'
import pinecone from '../source'

test.before(() => {
  // enable chalk colors in AVA
  // https://github.com/avajs/ava/issues/1124
  chalk.level = 2

  // suppress console during tests
  sinon.stub(console, 'log')
})

test.todo('`pinecone init` generates default files')

test('`pinecone` generates themes', (t) => {
  // TODO: check generated themes
  t.notThrows(() => pinecone())
})

test.todo('`pinecone --no-italic` generates non-italic variants')
