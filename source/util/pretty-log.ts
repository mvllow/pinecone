import chalk from 'chalk'

export const log = {
	suggest: (message: unknown) => {
		if (typeof message === 'string') {
			console.warn(chalk.yellow('>'), message)
		}
	},
	error: (message: unknown) => {
		if (typeof message === 'string') {
			console.error(chalk.red('✕', message.toString()))
		}
		process.exit(1)
	},
}
