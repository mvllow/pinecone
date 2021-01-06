import path from 'path'
import slugify from 'slugify'
import { getConfig } from './get-config'
import { readJson } from './read-json'
import { writeJson } from './write-json'

interface VSTheme {
  label: string
  uiTheme: 'vs' | 'vs-dark'
  path: string
}

export const writeMeta = async () => {
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
  })

  if (!packageJson.contributes) {
    packageJson.contributes = { themes: [] }
  }
  packageJson.contributes.themes = Object.assign(
    packageJson.contributes.themes,
    themes
  )

  writeJson('package.json', packageJson)
}
