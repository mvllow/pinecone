import fs from 'fs'
import path from 'path'
import { log } from './utils/pretty-log'
import { writePrettyFile } from './utils/write-pretty-file'
import { readJson } from './utils/read-json'
import config from './template/template.config'

export const init = async () => {
  let theme = readJson('source/template/themes/_pinecone-color-theme.json')
  let { themeFile } = config
  let themePath = path.normalize(themeFile)
  let configPath = path.normalize(`./pinecone.config.js`)

  if (fs.existsSync(themePath)) {
    log.error(`\`${themePath}\` already exists`)
  }

  if (fs.existsSync(configPath)) {
    log.error(`\`${configPath}\` already exists`)
  }

  fs.mkdirSync(path.dirname(themeFile), { recursive: true })

  await writePrettyFile(
    'themes/_pinecone-color-theme.json',
    JSON.stringify(theme, null, 2)
  )
  await writePrettyFile(
    configPath,
    `module.exports = ${JSON.stringify(config, null, 2)}`,
    'babel'
  )
}
