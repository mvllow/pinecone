import { readFileSync } from 'fs'
import { getConfig } from './get-config'

export interface Theme {
  name?: string
  type?: 'light' | 'dark'
  /**
   * @example bg: '#000' or bg: { dark: '#000', light: '#fff' }
   */
  colors?: {
    [key: string]:
      | string
      | {
          [key: string]: string
        }
  }
  tokenColors?: any[]
  semanticHighlighting?: boolean
  semanticTokenColors?: {}
  [key: string]: unknown
}

export const getTheme = () => {
  let config = getConfig()
  let theme = {} as Theme

  try {
    theme = JSON.parse(readFileSync(config.themeFile).toString())
  } catch (error) {
    console.log(error)
  }

  return theme
}
