import { writeFileSync } from 'fs'
import path from 'path'
import prettier from 'prettier'
import slugify from 'slugify'
import { log } from './log'
import { getConfig } from './get-config'

interface Theme {
  label: string
  uiTheme: 'vs' | 'vs-dark'
  path: string
}

export const writeMeta = async () => {
  let config = getConfig()

  try {
    await prettier.resolveConfig(process.cwd()).then((options) => {
      let packageJson = require(`${process.cwd()}/package.json`)

      let themes: Theme[] = []

      Object.keys(config.theme.variants).map((variant) => {
        let current = config.theme.variants[variant]
        let slug = slugify(current.name, {
          lower: true,
          strict: true,
        })
        let fileName = `./${path.normalize(
          config.outputDir
        )}/${slug}-color-theme.json`

        themes.push({
          label: current.name,
          uiTheme: current.type == 'light' ? 'vs' : 'vs-dark',
          path: fileName,
        })
      })

      let newPackageJson = {
        ...packageJson,
        contributes: {
          themes,
        },
      }

      let formattedPackageJson = prettier.format(
        JSON.stringify(newPackageJson, null, 2),
        {
          ...options,
          parser: 'json-stringify',
        }
      )

      writeFileSync('./package.json', formattedPackageJson)
    })
  } catch (error) {
    log.error(error)
  }
}
