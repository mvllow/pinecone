import path from 'node:path'
import process from 'node:process'
import chokidar from 'chokidar'
import { resolveConfig } from './config.js'
import pinecone from './index.js'

export async function watch() {
	const config = await resolveConfig()
	const themePath = path.join(process.cwd(), config.options.source)
	const configPath = path.join(process.cwd(), 'pinecone.config.js')

	const watcher = chokidar.watch([themePath, configPath])

	watcher.on('change', async () => {
		await pinecone()
			.then(() => {
				console.log('👀 Waiting for changes...\n')
			})
			.catch((error: unknown) => {
				console.error(error)
			})
	})
}
