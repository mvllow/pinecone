import { Config } from '../utils/get-config'

const config: Config = {
  themeFile: './themes/_pinecone-color-theme.json',
  outputDir: './themes',
  varPrefix: '_',
  options: {
    includeNonItalicVariants: false,
    writeMeta: false,
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
      transparent: '#0000',
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
}

export default config
