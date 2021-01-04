# Pinecone

Check out [our beta branch](https://github.com/mvllow/pinecone/tree/beta) to test the 1.0 version featuring:

- New package name, `pinecone-cli`
- Shared colours between variants
- User-friendly API: less clutter, more creating
- 9x faster builds seen on our own Rosé Pine theme (and more "[prettier](https://prettier.io)" than ever)
- And of course, all new documentation

---

> Note this documentation is being deprecated with the 1.0 release

Dynamically generating theme variants since 2020 ✨

## Getting started

**Install**

```sh
  npm install @mvllow/pinecone
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
  input: './themes/theme.json',
  dir: './themes',
  prefix: '_',
  themes: [
    {
      name: 'My sorta cool theme',
      slug: 'sorta-cool-filename',
      type: 'dark',
      colors: {
        accent1: '#fa8072',
        accent2: '#3eb489',
      },
    },
    {
      name: 'My less cool theme',
      slug: 'less-cool-filename',
      type: 'dark',
      colors: {
        accent1: '#ea4335',
        accent2: '#4285f4',
      },
    },
  ],
}
```

**Update base theme**

With the above config, we would want our theme (input) to look something like this:

```json
{
  "colors": {
    "something.foreground": "_accent1",
    "something.background": "_accent2"
  }
}
```

**Run pinecone**

```sh
npm run pinecone
```

This will generate all variants, for example:

```json
{
  "name": "My sorta cool theme",
  "type": "dark",
  "colors": {
    "accent1": "#fa8072",
    "accent2": "#3eb489"
  }
}

{
  "name": "My less cool theme",
  "type": "dark",
  "colors": {
    "accent1": "#ea4335",
    "accent2": "#4285f4"
  }
}
```

## Contributing

Pull requests are welcome and appreciated!

To build from source, run:

```sh
npm run build
```
