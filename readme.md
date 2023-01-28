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
		init  Create new theme

	Options
		-s, --source  Path to pinecone theme file
		-o, --output  Directory for generated themes
		-p, --prefix  Variable prefix
		-w, --watch   Rebuild themes on change
		-t, --tidy    Remove non-pinecone themes from output and package.json

		--include-non-italic-variants  Generate additional non-italic variants

	Examples
		$ pinecone
		$ pinecone init
		$ pinecone --watch --tidy --include-non-italic-variants
```

## Theme

Pinecone themes look similar to any other theme with the addition of variables and difference in how empty values are handled. VSCode treats empty values as `#ff0000` whereas pinecone removes empty values for cleaner intellisense and organisation.

**Example `./themes/_pinecone-color-theme.json`**

```json
{
	"colors": {
		"editor.background": "$bg",
		"editor.foreground": "$fg",
		"editor.hoverHighlightBackground": "$transparent",
		"widget.shadow": "$shadow"
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

**Example `./pinecone.config.js`**

```js
import {colorish, defineConfig} from 'pinecone-cli';

export default defineConfig({
	options: {
		source: './themes/_pinecone-color-theme.json',
		output: './themes',
		prefix: '$',
		includeNonItalicVariants: false,
	},
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
		transparent: '#0000', // Shorthand to set all variants
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
		shadow: {
			latte: colorish('#c29d84', 0.1),
			cappuccino: colorish('#573d2b', 0.1),
			espresso: colorish('#d5bbaa', 0.1),
		},
	},
});
```

## Made with pinecone

- [Rosé Pine](https://github.com/rose-pine/vscode)
