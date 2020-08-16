#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import replaceValues, { IData } from './util/replace-values'
import defaultConfig, { IDefaultConfig, IUserConfig } from './default.config'

let prefix = '_'

interface IOutputTheme {
  name?: string
  type?: 'light' | 'dark'
  colors?: IData
  tokenColors?: Array<unknown>
}

let config: IDefaultConfig = defaultConfig

try {
  let userConfig: IUserConfig = require(`${process.cwd()}/pinecone.config`)
  config = { ...defaultConfig, ...userConfig }
} catch (err) {
  console.warn(err)
}

let themeFile: Buffer = readFileSync(config.in)

config.themes.map((variant: any) => {
  let newTheme: any = {}

  let theme = JSON.parse(themeFile.toString())

  Object.keys(variant.colors).forEach((key, index) => {
    let pattern = `${prefix}${key}`

    if (Object.keys(newTheme).length === 0) {
      newTheme = replaceValues(theme, pattern, variant.colors[key])
    } else {
      newTheme = replaceValues(newTheme, pattern, variant.colors[key])
    }
  })

  newTheme.name = variant.name
  newTheme.type = variant.type

  writeFileSync(
    `${config.out}/${variant.slug}-color-theme.json`,
    JSON.stringify(newTheme)
  )
})
