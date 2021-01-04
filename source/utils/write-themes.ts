import { writeFileSync } from 'fs'
import slugify from 'slugify'
import prettier from 'prettier'
import { log } from './log'
import { getConfig } from './get-config'

// TODO: types
export const writeThemes = async (themes: any) => {
  let config = getConfig()

  await Promise.all(
    Object.keys(themes).map(async (variant) => {
      let slug = slugify(themes[variant].name, { lower: true, strict: true })
      let fileName = `${slug}-color-theme.json`

      try {
        // get prettier user options if available (uses cosmiconfig)
        await prettier.resolveConfig(process.cwd()).then((options) => {
          const formatted = prettier.format(
            // we use `null` to add new lines for prettier to then format
            JSON.stringify(themes[variant], null, 2),
            {
              ...options,
              parser: 'json',
            }
          )

          writeFileSync(`${config.outputDir}/${fileName}`, formatted)
          console.log(`Writing ${themes[variant].name} (${fileName})`)
        })
      } catch (error) {
        log.error(error)
      }
    })
  )
}
