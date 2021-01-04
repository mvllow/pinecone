# Pinecone

> These docs are for our pre 1.0.0 release

Dynamically generating theme variants since 2020 ✨

## Usage

```sh
$ npm install -g pinecone-cli
```

```
  Usage
    $ pinecone <options>

    Creating a new theme
      $ pinecone init

  Options
    --include-non-italics  Include non-italic variants

  Examples
    $ pinecone
    $ pinecone init
    $ pinecone --include-non-italics
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
