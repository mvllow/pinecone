import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { defaultConfig } from './config.js'
import { log } from './util/pretty-log.js'
import { writePrettyFile } from './util/write-pretty-file.js'

export async function init() {
	let { source } = defaultConfig
	let themePath = path.normalize(source)
	let configPath = path.normalize(`./pinecone.config.js`)

	console.log('🌱 Init')

	await writePrettyFile(
		configPath,
		`export default ${JSON.stringify(defaultConfig, null, 2)}`,
		'babel'
	).then(() => {
		console.log(
			`   ${chalk.grey('-')} Config: ${chalk.magenta('pinecone.config.js')}`
		)
	})

	if (fs.existsSync(themePath)) {
		log.error(`\`${themePath}\` already exists`)
	}

	fs.mkdirSync(path.dirname(source), { recursive: true })

	await writePrettyFile(
		'themes/_pinecone-color-theme.json',
		`{
            "colors": {
                "editor.background": "$bg",
                "editor.foreground": "$fg",
                "widget.shadow": "$transparent"
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
        }`
	).then(() => {
		console.log(
			`   ${chalk.grey('-')} Theme: ${chalk.magenta(
				'themes/_pinecone-color-theme-json'
			)}\n`
		)
	})
}
