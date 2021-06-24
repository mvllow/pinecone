import test from 'ava'
import chalk from 'chalk'
import sinon from 'sinon'
import pinecone from '../source/index.js'
import { readJson } from '../source/util/read-json.js'

test.before(() => {
	// Enable chalk colors in AVA
	// https://github.com/avajs/ava/issues/1124
	chalk.level = 2

	// Suppress console during tests
	sinon.stub(console, 'log')

	// Ignore process.exit during tests
	sinon.stub(process, 'exit')
})

test.serial('generates default files', async (t) => {
	await pinecone()

	let theme = JSON.parse(
		`{
		"colors": {
			"editor.background": "$bg",
			"editor.foreground": "$fg",
			"widget.shadow": "$transparent"
		},
		"tokenColors": [
			{
				"scope": ["comment"],
				"settings": {
					"foreground": "$fg",
					"fontStyle": "italic"
				}
			}
		]
	}`
	)
	let { default: config } = await import(`${process.cwd()}/pinecone.config.js`)

	t.is(theme.colors['editor.background'], '$bg')
	t.is(config.prefix, '$')
})

test('generates themes', async (t) => {
	await pinecone()

	let theme = readJson(`./themes/latte-color-theme.json`)

	t.is(theme.colors['editor.background'], '#faf8f6')
})

test.todo('cleans themes')
test.todo('checks themes')

// TODO: Mock functions and such so that real files are not being created etc.
// Idealy this would allow us to pass a new config file with comments to test
test.todo('removes comments from theme file')

test('generates non-italic variants', async (t) => {
	await pinecone('', { includeNonItalicVariants: true })

	let theme = readJson(`./themes/latte-no-italics-color-theme.json`)

	t.is(theme.name, 'Latte (no italics)')
	t.notRegex(theme.tokenColors[0].settings.fontStyle, /italic/g)
	t.is(theme.name, 'Latte (no italics)')
})

test.skip('updates contributes', async (t) => {
	await pinecone('', { updateContributes: true })

	let packageJson = readJson(`./package.json`)

	t.is(packageJson.contributes.themes[0].label, 'Latte')
})

test.todo('`pinecone watch`')
