import fs from 'fs'
import path from 'path'
import pinecone from '.'

export const watch = async () => {
	fs.watch(path.join(process.cwd(), 'pinecone.config.js'), async () => {
		await pinecone().then(() => {
			console.log('👀 Waiting for changes...')
			console.log()
		})
	})
}
