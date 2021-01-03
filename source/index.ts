#!/usr/bin/env node

import chalk from 'chalk'
import { getTheme } from './utils/get-theme'
import { parseThemes } from './utils/parse-themes'
import { writeThemes } from './utils/write-themes'

console.clear()
console.log(chalk.green('🌲 Pinecone'))

let theme = getTheme()
let parsedThemes = parseThemes(theme)
writeThemes(parsedThemes)
