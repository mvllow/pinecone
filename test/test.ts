import test from 'ava'
import pinecone from '../source'

test.todo('`pinecone init` generates default files')

test('`pinecone` generates themes', (t) => {
  // TODO: check generated themes
  t.notThrows(() => pinecone())
})

test.todo('`pinecone --no-italic` generates non-italic variants')
