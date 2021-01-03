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
  theme: Theme
}

export const getConfig = () => {
  const defaultConfig: Config = {
    themeFile: './themes/_color-theme.json',
    outputDir: './themes',
    varPrefix: '_',
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
    console.log(error)
  }

  return config
}
