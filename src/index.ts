#!/usr/bin/env node

const fs = require('fs')
const { parseObject } = require('./helpers')

const defaultConfig = require('./default.config.js')

let config = defaultConfig

try {
  const userConfig = require(`${process.cwd()}/pinecone.config`)
  config = { ...defaultConfig, ...userConfig }
} catch (err) {
  console.warn(err)
}

let themeFile = fs.readFileSync(config.input)
let theme = JSON.parse(themeFile)

config.themes.map((variant: any) => {
  let { colors, name, slug, type } = variant
  let newTheme: any = { name, type }

  Object.keys(colors).forEach((key, index) => {
    let pattern = `${config.prefix}${key}`

    if (index == 0) {
      newTheme = parseObject(theme, pattern, colors[key])
    } else {
      newTheme = parseObject(newTheme, pattern, colors[key])
    }
  })

  newTheme.name = name
  newTheme.type = type

  fs.writeFileSync(
    `${config.dir}/${slug}-color-theme.json`,
    JSON.stringify(newTheme)
  )
})
