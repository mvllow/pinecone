#!/usr/bin/env node

const fs = require('fs')
const { replaceJsonValues } = require('./helpers')

const defaultConfig = require('./default.config.js')

let config = defaultConfig

try {
  const userConfig = require(`${process.cwd()}/pinecone.config`)
  config = { ...defaultConfig, ...userConfig }
} catch (err) {
  console.warn(err)
}

let themeFile = fs.readFileSync(config.input)

config.themes.map((variant: any) => {
  let newTheme: any = null
  let theme = JSON.parse(themeFile)

  Object.keys(variant.colors).forEach((key, index) => {
    let pattern = `${config.prefix}${key}` // _pine

    if (!newTheme) {
      newTheme = replaceJsonValues(theme, pattern, variant.colors[key])
    } else {
      newTheme = replaceJsonValues(newTheme, pattern, variant.colors[key])
    }
  })

  newTheme.name = variant.name
  newTheme.type = variant.type

  fs.writeFileSync(
    `${config.dir}/${variant.slug}-color-theme.json`,
    JSON.stringify(newTheme)
  )
})
