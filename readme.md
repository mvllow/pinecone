# pinecone

> Lovely VSCode theme builder

Note: These docs are for v2 beta. For v1 see [here](https://github.com/mvllow/pinecone/blob/486f85e17455d8bc0684994f4bbe90253c18f87d/readme.md)

Create multiple theme variants from a single source _with variables_.

## Install

```sh
npm install --global pinecone-cli@beta
```

## Usage

> Pinecone will create any necessary files on first run

```
$ pinecone --help

	Usage
		$ pinecone <command> [options]

	Commands
		watch  Rebuild themes on change
			   Watches pinecone.config.js and themes/*

	Options
		--include-non-italic-variants  Generate additional non-italic variants
		--update-contributes           Add contributed themes to `package.json`

	Examples
		$ pinecone
		$ pinecone watch --include-non-italic-variants --update-contributes
```

## Theme

By default, pinecone looks for `./themes/_pinecone-color-theme.json`. This will look like any other VSCode theme file with the addition of variable values.

```json
{
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
}
```

## Config

Your theme config and variables will live in `./pinecone.config.js`.

```js
import { alpha, defineConfig } from 'pinecone-cli'

// Pinecone defaults
export default defineConfig({
	source: './themes/_pinecone-color-theme.json',
	output: './themes',
	prefix: '$',
	options: {
		includeNonItalicVariants: false,
		updateContributes: false,
	},
	variants: {
		charcoal: {
			name: 'Smokey Charcoal',
			type: 'dark',
		},
		soap: {
			name: 'Bubbly Soap',
			type: 'light',
		},
	},
	colors: {
		transparent: '#0000',
		bg: {
			charcoal: '#000',
			soap: '#fff',
		},
		fg: {
			charcoal: '#fff',
			soap: alpha('#000', 0.8),
		},
	},
})
```

## Made with pinecone

- [Rosé Pine](https://github.com/rose-pine/vscode)
