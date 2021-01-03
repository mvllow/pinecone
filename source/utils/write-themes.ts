import { writeFileSync } from 'fs'
import slugify from 'slugify'
import { getConfig } from './get-config'

// TODO: types
export const writeThemes = (themes: any) => {
  let config = getConfig()

  Object.keys(themes).map((variant) => {
    let slug = slugify(themes[variant].name, { lower: true, strict: true })
    let fileName = `${slug}-color-theme.json`

    try {
      const formatted = JSON.stringify(themes[variant], null, 2)

      writeFileSync(`${config.outputDir}/${fileName}`, formatted)
      console.log(`Writing ${themes[variant].name} (${fileName})`)
    } catch (error) {
      console.log(error)
    }
  })
}
