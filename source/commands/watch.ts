import chokidar from 'chokidar';
import pinecone from '../index.js';
import {log, toRelativePath} from '../utilities.js';
import type {Config} from '../config.js';

export const watch = async (config: Config) => {
	const themePath = toRelativePath(config.options.source);
	const configPath = toRelativePath('pinecone.config.js');

	const watcher = chokidar.watch([themePath, configPath]);

	watcher.on('change', async () => {
		await pinecone()
			.then(() => {
				console.log('👀 Waiting for changes...\n');
			})
			.catch((error: unknown) => {
				log.error(`Unable to watch for changes`);
				throw new Error(error as string);
			});
	});
};
