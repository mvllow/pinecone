import path from 'path'
import slugify from 'slugify'
import { getConfig, Options } from './get-config'
import { readJson } from './read-json'
import { writePrettyFile } from './write-pretty-file'

interface VSTheme {
  label: string
  uiTheme: 'vs' | 'vs-dark'
  path: string
}

export const writeMeta = async (options: Options) => {
  let themes: VSTheme[] = []
  let { theme, outputDir } = getConfig()
  let packageJson = readJson('package.json')

  Object.keys(theme.variants).map((variant) => {
    let { name, type } = theme.variants[variant]
    let slug = slugify(name, { lower: true, strict: true })

    themes.push({
      label: name,
      uiTheme: type == 'light' ? 'vs' : 'vs-dark',
      path: path.join(outputDir, `${slug}-color-theme.json`),
    })

    if (options.includeNonItalics || options.includeNonItalicVariants) {
      themes.push({
        label: `${name} (no italics)`,
        uiTheme: type == 'light' ? 'vs' : 'vs-dark',
        path: path.join(outputDir, `${slug}-no-italics-color-theme.json`),
      })
    }
  })

  if (!packageJson.contributes) {
    packageJson.contributes = { themes: [] }
  }
  packageJson.contributes.themes = themes

  await writePrettyFile(
    'package.json',
    JSON.stringify(packageJson, null, 2),
    'json-stringify'
  )
}
