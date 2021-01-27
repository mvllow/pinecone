import path from 'path'
import nodeWatch from 'node-watch'
import { log } from '../utils/pretty-log'
import { getConfig } from '../utils/get-config'
import pinecone from '..'

export const watch = async () => {
	let config = getConfig()
	let themePath = path.join(process.cwd(), config.themeFile)
	let configPath = path.join(process.cwd(), 'pinecone.config.js')

	nodeWatch([themePath, configPath], async () => {
		await pinecone()
			.then(() => {
				console.log('👀 Waiting for changes...')
				console.log()
			})
			.catch((error) => {
				log.error(error)
			})
	})
}
