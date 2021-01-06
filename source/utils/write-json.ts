import fs from 'fs'
import path from 'path'
import prettier from 'prettier'
import { log } from './log'

/**
 * Write JSON
 *
 * @param file starts from root
 * @param usePrettier format JSON via Prettier
 */
export const writeJson = async (
  filePath: string,
  fileContents: Buffer,
  usePrettier = true
) => {
  try {
    let formattedContents = JSON.stringify(fileContents, null, ' ')

    if (usePrettier) {
      await prettier.resolveConfig(process.cwd()).then((options) => {
        formattedContents = prettier.format(formattedContents, {
          ...options,
          parser: 'json-stringify',
        })
      })
    }

    fs.writeFileSync(path.join(process.cwd(), filePath), formattedContents)
  } catch (error) {
    log.error(error)
  }
}
