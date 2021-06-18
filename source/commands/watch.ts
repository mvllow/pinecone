import path from 'path'
import chokidar from 'chokidar'
import { log } from '../util/pretty-log.js'
import { getConfig } from '../config.js'
import pinecone from '../index.js'

export async function watch() {
	let config = await getConfig()
	let themePath = path.join(process.cwd(), config.source)
	let configPath = path.join(process.cwd(), 'pinecone.config.js')

	const watcher = chokidar.watch([themePath, configPath])

	watcher.on('change', async () => {
		await import(`${process.cwd()}/pinecone.config.js`)
		await pinecone()
			.then(() => {
				console.log('👀 Waiting for changes...\n')
			})
			.catch((error) => {
				log.error(error)
			})
	})
}
