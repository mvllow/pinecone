import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import { defaultConfig, resolveConfig, type UserOptions } from './config.js'
import { writePrettyFile } from './util/write-pretty-file.js'

export async function init(flags?: UserOptions) {
	const { options } = await resolveConfig(flags)
	const themePath = path.normalize(options.source)
	const configPath = path.normalize(`./pinecone.config.js`)

	console.log('🌱 Init')

	await writePrettyFile(
		configPath,
		`import { defineConfig } from 'pinecone-cli'\n
		export default defineConfig(${JSON.stringify(defaultConfig, null, 2)})`,
		'babel',
	).then(() => {
		console.log(
			`   ${chalk.grey('-')} Config: ${chalk.magenta('pinecone.config.js')}`,
		)
	})

	if (fs.existsSync(themePath)) {
		console.error(`\`${themePath}\` already exists`)
	}

	fs.mkdirSync(path.dirname(options.source), { recursive: true })

	await writePrettyFile(
		'themes/_pinecone-color-theme.json',
		`{
            "colors": {
                "editor.background": "$bg",
                "editor.foreground": "$fg",
                "widget.shadow": "$none"
            },
            "tokenColors": [
                {
                    "scope": ["comment"],
                    "settings": {
                        "foreground": "$fg",
                        "fontStyle": "italic"
                    }
                }
            ]
        }`,
	).then(() => {
		console.log(
			`   ${chalk.grey('-')} Theme: ${chalk.magenta(
				'themes/_pinecone-color-theme-json',
			)}\n`,
		)
	})
}
