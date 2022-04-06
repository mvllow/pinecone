import path from 'path'
import chokidar from 'chokidar'
import { log } from './util/pretty-log.js'
import { resolveConfig } from './config.js'
import pinecone from './index.js'

export async function watch() {
	let config = await resolveConfig()
	let themePath = path.join(process.cwd(), config.options.source)
	let configPath = path.join(process.cwd(), 'pinecone.config.js')

	const watcher = chokidar.watch([themePath, configPath])

	watcher.on('change', async () => {
		await pinecone()
			.then(() => {
				console.log('👀 Waiting for changes...\n')
			})
			.catch((error) => {
				log.error(error)
			})
	})
}
