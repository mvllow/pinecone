import chalk from 'chalk'

export const log = {
  error: (message: string) => {
    console.error(chalk.red('✕', message))
    process.exit(1)
  },
}
