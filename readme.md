# pinecone

> Lovely VSCode theme builder

Create multiple theme variants from a single source _with variables_.

## Install

```sh
npm install --global pinecone-cli
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
	theme: {
		variants: {
			latte: {
				name: 'Latte',
				type: 'light',
			},
			cappuccino: {
				name: 'Cappuccino',
				type: 'light',
			},
			espresso: {
				name: 'Espresso',
				type: 'dark',
			},
		},
		colors: {
			transparent: '#0000', // Shorthand to set for all three variants
			bg: {
				latte: '#faf8f6',
				cappuccino: '#c29d84',
				espresso: '#36261b',
			},
			fg: {
				latte: '#c29d84',
				cappuccino: '#573d2b',
				espresso: '#d5bbaa',
			},
		},
	},
})
```

## Made with pinecone

- [Rosé Pine](https://github.com/rose-pine/vscode)
