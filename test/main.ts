import fs from 'node:fs'
import process from 'node:process'
import test from 'ava'
import chalk from 'chalk'
import { stub } from 'sinon'
import pinecone from '../source/index.js'
import { readJson } from '../source/util/read-json.js'
import { writePrettyFile } from '../source/util/write-pretty-file.js'
import type { Theme, PackageTheme } from '../source/types/themes.js'

test.before(async () => {
	// Enable chalk colors in AVA
	// https://github.com/avajs/ava/issues/1124
	chalk.level = 2

	stub(console, 'log')
	stub(process, 'exit')

	await pinecone('init')
})

test.after(async () => {
	try {
		fs.rmSync(process.cwd() + '/themes', { recursive: true })
	} catch {}

	try {
		fs.unlinkSync(process.cwd() + '/pinecone.config.js')
	} catch {}

	const packageJson = readJson<Record<string, unknown>>('package.json')
	const cleanedPackageJson = { ...packageJson, contributes: undefined }

	await writePrettyFile(
		'package.json',
		JSON.stringify(cleanedPackageJson, null, 2),
		'json-stringify',
	)
})

test.serial('generates default files', async (t) => {
	await pinecone()

	const theme = {
		colors: {
			'badge.background': '',
			'editor.background': '$bg',
			'editor.foreground': '$fg',
			'widget.shadow': '$none',
		},
		tokenColors: [
			{
				scope: ['comment'],
				settings: {
					foreground: '$fg',
					fontStyle: 'italic',
				},
			},
		],
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, node/no-unsupported-features/es-syntax
	const { default: config } = await import(
		`${process.cwd()}/pinecone.config.js`
	)

	t.is(theme.colors['editor.background'], '$bg')
	t.is(config.options.prefix, '$')
})

test('generates themes', async (t) => {
	await pinecone()

	const theme = readJson<Theme>(`./themes/caffe-latte-color-theme.json`)

	t.is(theme.colors?.['editor.background'], '#faf8f6')
})

// TODO: Test this against italic variants
test('removes empty values', async (t) => {
	await pinecone()

	const theme = readJson<Theme>(`./themes/caffe-latte-color-theme.json`)
	t.is(theme.colors?.['badge.background'], undefined)
})

test('generates non-italic variants', async (t) => {
	await pinecone('', { includeNonItalicVariants: true })

	const theme = readJson<Theme>(
		`./themes/caffe-latte-no-italics-color-theme.json`,
	)

	t.notRegex(JSON.stringify(theme), /fontStyle.*?italic/g)
	t.is(theme.name, 'Caffè Latte (no italics)')
})

test('updates contributes', async (t) => {
	await pinecone('', { tidy: true })

	const packageJson = readJson<{
		[key: string]: unknown
		contributes: { themes: PackageTheme[] }
	}>('package.json')

	t.is(packageJson?.contributes?.themes?.[0]?.label, 'Caffè')
})
