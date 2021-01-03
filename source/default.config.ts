export interface ITheme {
  name: string
  slug: string
  type: 'light' | 'dark'
  colors: {}
}

export interface IDefaultConfig {
  in: string
  out: string
  themes: Array<ITheme>
}

export interface IUserConfig {
  in?: string
  out?: string
  themes: Array<ITheme>
}

let defaultConfig: IDefaultConfig = {
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

export default defaultConfig
