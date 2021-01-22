import chalk from 'chalk'

export const log = {
	suggest: (message: string) => {
		console.warn(chalk.yellow('>'), message)
	},
	error: (message: string) => {
		console.error(chalk.red('✕', message))
		process.exit(1)
	},
}
