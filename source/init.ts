import fs from 'fs'
import path from 'path'
import { log } from './utils/pretty-log'
import { writePrettyFile } from './utils/write-pretty-file'
import config from './template/template.config'
import theme from './template/themes/_pinecone-color-theme.json'

export const init = async () => {
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
    `/**
    * @type { import("./node_modules/pinecone-cli/dist/types/utils/get-config").Config }
    */
    module.exports = ${JSON.stringify(config, null, 2)}`,
    'babel'
  )
}
