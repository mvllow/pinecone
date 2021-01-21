# Pinecone

> Used in the lovely [Rosé Pine](https://github.com/rose-pine/vscode) theme

Dynamically generating theme variants since 2020 ✨

## Usage

```sh
$ npm install -g pinecone-cli
```

```
$ pinecone --help

  Usage
    $ pinecone <command> [options]

  Commands
    init   Create new theme files
    watch  Rebuild themes when `pinecone.config.js` changes

  Options
    --include-non-italics  Generate additional variants with no italics
    -m, --write-meta       Add contributed themes to `package.json`

  Examples
    $ pinecone
    $ pinecone init
    $ pinecone watch
    $ pinecone --include-non-italics
    $ pinecone --write-meta
```

## Theme

**themes/\_pinecone-color-theme.json**

```json
{
  "colors": {
    "editor.background": "_bg",
    "editor.foreground": "_fg",
    "widget.shadow": "_transparent"
  },
  "tokenColors": [
    {
      "scope": ["comment"],
      "settings": {
        "foreground": "_fg",
        "fontStyle": "italic"
      }
    }
  ]
}
```

## Config

**pinecone.config.js**

```js
module.exports = {
  themeFile: './themes/_pinecone-color-theme.json',
  outputDir: './themes',
  varPrefix: '_',
  options: {
    includeNonItalicVariants: false,
    writeMeta: false,
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
      soap: '#000',
    },
  },
}
```

| Option                   | Description                                  | Default |
| ------------------------ | -------------------------------------------- | ------- |
| includeNonItalicVariants | Generate additional variants without italics | false   |
| writeMeta                | Add contributed themes to `package.json`     | false   |
