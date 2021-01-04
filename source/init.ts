import { mkdirSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import prettier from 'prettier'
import { log } from './utils/log'
import theme from './template/themes/_pinecone-color-theme.json'
import config from './template/template.config'

export const init = async () => {
  let themeDir = path.dirname(config.themeFile)
  let themePath = path.normalize(config.themeFile)
  let configPath = `./pinecone.config.js`

  if (existsSync(themePath)) {
    log.error(`\`${themePath}\` already exists`)
  }

  if (existsSync(configPath)) {
    log.error(`\`${configPath}\` already exists`)
  }

  try {
    mkdirSync(themeDir, { recursive: true })
  } catch (error) {
    log.error(error)
  }

  try {
    await prettier.resolveConfig(process.cwd()).then((options) => {
      let formattedTheme = prettier.format(JSON.stringify(theme, null, 2), {
        ...options,
        parser: 'json',
      })
      let formattedConfig = prettier.format(
        `module.exports = ${JSON.stringify(config, null, 2)}`,
        {
          ...options,
          parser: 'babel',
        }
      )
      writeFileSync(themePath, formattedTheme)
      writeFileSync(configPath, formattedConfig)
    })
  } catch (error) {
    log.error(error)
  }
}
