import { log } from './log'

interface Theme {
  variants: {
    [key: string]: {
      name: string
      type: 'light' | 'dark'
    }
  }
  colors: {
    [key: string]:
      | string
      | {
          [key: string]: string
        }
  }
}

export interface Config {
  themeFile: string
  outputDir: string
  varPrefix: string
  options?: Options
  theme: Theme
}

export interface Options {
  includeNonItalicVariants: boolean
}

export const getConfig = () => {
  const defaultConfig: Config = {
    themeFile: './themes/_pinecone-color-theme.json',
    outputDir: './themes',
    varPrefix: '_',
    options: {
      includeNonItalicVariants: false,
    },
    theme: {
      variants: {
        dark: {
          name: 'Charcoal',
          type: 'dark',
        },
        light: {
          name: 'Soap',
          type: 'light',
        },
      },
      colors: {},
    },
  }

  let config = defaultConfig

  try {
    let userConfig: Config = require(`${process.cwd()}/pinecone.config.js`)

    config = { ...defaultConfig, ...userConfig }
  } catch (error) {
    log.error(error)
  }

  return config
}
