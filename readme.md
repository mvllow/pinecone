# Pinecone

> These docs are for 0.4.0 beta

Dynamically generating theme variants since 2020 ✨

## Getting started

**Install**

```sh
  npm install @mvllow/pinecone@beta
```

**Update package.json**

```json
{
  "scripts": {
    "generate": "pinecone"
  }
}
```

**Configure pinecone**

```js
// pinecone.config.js

module.exports = {
  // Using `color-theme` in the name enables vscode theme intellisense
  in: './themes/color-theme.json',
  out: './themes',
  themes: [
    {
      name: 'Pinecone Dark',
      slug: 'pinecone-dark',
      type: 'dark',
      colors: {
        foreground: '#fff',
        background: '#000',
      },
    },
    {
      name: 'Pinecone Light',
      slug: 'pinecone-light',
      type: 'light',
      colors: {
        foreground: '#000',
        background: '#fff',
      },
    },
  ],
}
```

**Update base theme**

With the above config, we would want our `color-theme.json` to look something like this:

```json
{
  "colors": {
    "editor.foreground": "_foreground",
    "editor.background": "_background"
  }
}
```

**Run pinecone**

```sh
npm run generate
```

That's it, enjoy your multiple variants ✨

## Contributing

Pull requests are welcome and appreciated!

To build from source, run:

```sh
npm run build
```
